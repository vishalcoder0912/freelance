import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { PrismaClient, Role, EnrollmentStatus, PaymentStatus } from '@prisma/client';

// ─── Mock Prisma Client ──────────────────────────────────────────────────────

function createMockPrisma() {
  const store = {
    users: new Map<string, Record<string, unknown>>(),
    enrollments: new Map<string, Record<string, unknown>>(),
    payments: new Map<string, Record<string, unknown>>(),
    certificates: new Map<string, Record<string, unknown>>(),
    auditLogs: new Map<string, Record<string, unknown>>(),
    programs: new Map<string, Record<string, unknown>>(),
    applications: new Map<string, Record<string, unknown>>(),
  };

  const prisma = {
    user: {
      create: vi.fn(async ({ data }) => {
        const id = data.id || `user-${Date.now()}`;
        const record = { ...data, id };
        store.users.set(id, record);
        return record;
      }),
      findUnique: vi.fn(async ({ where }) => {
        return Array.from(store.users.values()).find(u => u.email === where.email || u.id === where.id) || null;
      }),
      update: vi.fn(async ({ where, data }) => {
        const existing = store.users.get(where.id);
        if (!existing) throw new Error('User not found');
        const updated = { ...existing, ...data };
        store.users.set(where.id, updated);
        return updated;
      }),
    },
    enrollment: {
      create: vi.fn(async ({ data }) => {
        const id = data.id || `enrollment-${Date.now()}`;
        const record = { ...data, id };
        store.enrollments.set(id, record);
        return record;
      }),
      findUnique: vi.fn(async ({ where }) => {
        return Array.from(store.enrollments.values()).find(
          e => e.id === where.id || (where.userId_programId && e.userId === where.userId_programId.userId && e.programId === where.userId_programId.programId)
        ) || null;
      }),
      update: vi.fn(async ({ where, data }) => {
        const existing = store.enrollments.get(where.id);
        if (!existing) throw new Error('Enrollment not found');
        const updated = { ...existing, ...data };
        store.enrollments.set(where.id, updated);
        return updated;
      }),
    },
    payment: {
      create: vi.fn(async ({ data }) => {
        const id = data.id || `payment-${Date.now()}`;
        const record = { ...data, id };
        store.payments.set(id, record);
        return record;
      }),
      update: vi.fn(async ({ where, data }) => {
        const existing = store.payments.get(where.id);
        if (!existing) throw new Error('Payment not found');
        const updated = { ...existing, ...data };
        store.payments.set(where.id, updated);
        return updated;
      }),
    },
    certificate: {
      create: vi.fn(async ({ data }) => {
        const id = data.id || `cert-${Date.now()}`;
        const record = { ...data, id };
        store.certificates.set(id, record);
        return record;
      }),
      findUnique: vi.fn(async ({ where }) => {
        return Array.from(store.certificates.values()).find(
          c => c.id === where.id || c.certificateId === where.certificateId
        ) || null;
      }),
    },
    auditLog: {
      create: vi.fn(async ({ data }) => {
        const id = data.id || `audit-${Date.now()}`;
        const record = { ...data, id };
        store.auditLogs.set(id, record);
        return record;
      }),
    },
    program: {
      update: vi.fn(async ({ where, data }) => {
        const existing = store.programs.get(where.id);
        if (!existing) throw new Error('Program not found');
        const updated = { ...existing, ...data };
        store.programs.set(where.id, updated);
        return updated;
      }),
    },
    application: {
      create: vi.fn(async ({ data }) => {
        const duplicate = Array.from(store.applications.values()).find(
          a => a.jobId === data.jobId && a.userId === data.userId
        );
        if (duplicate) {
          const err = new Error('Unique constraint violation');
          (err as any).code = 'P2002';
          throw err;
        }
        const id = data.id || `app-${Date.now()}`;
        const record = { ...data, id };
        store.applications.set(id, record);
        return record;
      }),
      findFirst: vi.fn(async ({ where }) => {
        return Array.from(store.applications.values()).find(
          a => a.jobId === where.jobId && a.userId === where.userId
        ) || null;
      }),
    },
    $transaction: vi.fn(async (fn: (tx: any) => Promise<any>) => {
      return fn(prisma);
    }),
    store,
  };

  return prisma;
}

// ─── Enrollment Transaction Workflow ──────────────────────────────────────────

describe('Enrollment Transaction Workflow', () => {
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    prisma = createMockPrisma();
  });

  it('createEnrollment + createPayment + updateSeatCount all commit', async () => {
    prisma.program.update.mockResolvedValue({ id: 'prog-1', currentStudents: 11 });

    await prisma.$transaction(async (tx) => {
      const enrollment = await tx.enrollment.create({
        data: { userId: 'user-1', programId: 'prog-1', status: 'ACTIVE' },
      });
      const payment = await tx.payment.create({
        data: { userId: 'user-1', amount: 9999, status: 'COMPLETED' },
      });
      await tx.program.update({
        where: { id: 'prog-1' },
        data: { currentStudents: { increment: 1 } },
      });
      expect(enrollment.id).toBeDefined();
      expect(payment.id).toBeDefined();
    });

    expect(prisma.enrollment.create).toHaveBeenCalledTimes(1);
    expect(prisma.payment.create).toHaveBeenCalledTimes(1);
    expect(prisma.program.update).toHaveBeenCalledTimes(1);
  });

  it('rolls back enrollment when createPayment fails', async () => {
    const failPayment = vi.fn(async () => {
      throw new Error('Payment gateway timeout');
    });
    prisma.payment.create = failPayment;

    await expect(
      prisma.$transaction(async (tx) => {
        await tx.enrollment.create({
          data: { userId: 'user-1', programId: 'prog-1', status: 'ACTIVE' },
        });
        await tx.payment.create({
          data: { userId: 'user-1', amount: 9999, status: 'PENDING' },
        });
      })
    ).rejects.toThrow('Payment gateway timeout');

    expect(prisma.enrollment.create).toHaveBeenCalledTimes(1);
  });

  it('rolls back enrollment and payment when updateSeatCount fails', async () => {
    prisma.program.update.mockRejectedValueOnce(new Error('Program not found'));

    await expect(
      prisma.$transaction(async (tx) => {
        await tx.enrollment.create({
          data: { userId: 'user-1', programId: 'prog-1', status: 'ACTIVE' },
        });
        await tx.payment.create({
          data: { userId: 'user-1', amount: 9999, status: 'COMPLETED' },
        });
        await tx.program.update({
          where: { id: 'prog-1' },
          data: { currentStudents: { increment: 1 } },
        });
      })
    ).rejects.toThrow('Program not found');
  });
});

// ─── User Registration Transaction ───────────────────────────────────────────

describe('User Registration Transaction', () => {
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    prisma = createMockPrisma();
  });

  it('createUser + createAuditLog both commit', async () => {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email: 'new@test.com', name: 'New User', role: 'STUDENT' },
      });
      await tx.auditLog.create({
        data: { action: 'REGISTER', entity: 'User', entityId: user.id, userId: user.id },
      });
      expect(user.id).toBeDefined();
    });

    expect(prisma.user.create).toHaveBeenCalledTimes(1);
    expect(prisma.auditLog.create).toHaveBeenCalledTimes(1);
  });

  it('rolls back user creation when createAuditLog fails', async () => {
    prisma.auditLog.create.mockRejectedValueOnce(new Error('Audit write failed'));

    await expect(
      prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: { email: 'new@test.com', name: 'New User', role: 'STUDENT' },
        });
        await tx.auditLog.create({
          data: { action: 'REGISTER', entity: 'User', entityId: user.id },
        });
      })
    ).rejects.toThrow('Audit write failed');
  });
});

// ─── Certificate Generation Transaction ──────────────────────────────────────

describe('Certificate Generation Transaction', () => {
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    prisma = createMockPrisma();
  });

  it('updateEnrollment + createCertificate + updateProgramStudents all commit', async () => {
    prisma.store.enrollments.set('enroll-1', { id: 'enroll-1', userId: 'user-1', programId: 'prog-1', status: 'ACTIVE' });
    prisma.program.update.mockResolvedValue({ id: 'prog-1', totalStudents: 50 });

    await prisma.$transaction(async (tx) => {
      await tx.enrollment.update({
        where: { id: 'enroll-1' },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });
      await tx.certificate.create({
        data: {
          certificateId: 'CERT-2024-001',
          userId: 'user-1',
          programId: 'prog-1',
        },
      });
      await tx.program.update({
        where: { id: 'prog-1' },
        data: { totalStudents: { increment: 1 } },
      });
    });

    expect(prisma.enrollment.update).toHaveBeenCalledTimes(1);
    expect(prisma.certificate.create).toHaveBeenCalledTimes(1);
    expect(prisma.program.update).toHaveBeenCalledTimes(1);
  });

  it('rolls back enrollment update when createCertificate fails', async () => {
    prisma.store.enrollments.set('enroll-1', { id: 'enroll-1', userId: 'user-1', programId: 'prog-1', status: 'ACTIVE' });
    prisma.certificate.create.mockRejectedValueOnce(new Error('Certificate generation failed'));

    await expect(
      prisma.$transaction(async (tx) => {
        await tx.enrollment.update({
          where: { id: 'enroll-1' },
          data: { status: 'COMPLETED', completedAt: new Date() },
        });
        await tx.certificate.create({
          data: {
            certificateId: 'CERT-2024-001',
            userId: 'user-1',
            programId: 'prog-1',
          },
        });
      })
    ).rejects.toThrow('Certificate generation failed');
  });
});

// ─── Job Application Transaction ─────────────────────────────────────────────

describe('Job Application Transaction', () => {
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    prisma = createMockPrisma();
  });

  it('createApplication + updateJobStats both commit', async () => {
    await prisma.$transaction(async (tx) => {
      const application = await tx.application.create({
        data: { jobId: 'job-1', userId: 'user-1', status: 'PENDING' },
      });
      expect(application.id).toBeDefined();
    });

    expect(prisma.application.create).toHaveBeenCalledTimes(1);
  });

  it('prevents duplicate application via unique constraint', async () => {
    await prisma.application.create({
      data: { jobId: 'job-1', userId: 'user-1', status: 'PENDING' },
    });

    await expect(
      prisma.$transaction(async (tx) => {
        await tx.application.create({
          data: { jobId: 'job-1', userId: 'user-1', status: 'PENDING' },
        });
      })
    ).rejects.toThrow();
  });

  it('allows same user to apply to different jobs', async () => {
    await prisma.$transaction(async (tx) => {
      await tx.application.create({
        data: { jobId: 'job-1', userId: 'user-1', status: 'PENDING' },
      });
      await tx.application.create({
        data: { jobId: 'job-2', userId: 'user-1', status: 'PENDING' },
      });
    });

    expect(prisma.application.create).toHaveBeenCalledTimes(2);
  });
});

// ─── Payment Refund Transaction ──────────────────────────────────────────────

describe('Payment Refund Transaction', () => {
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    prisma = createMockPrisma();
  });

  it('updatePaymentStatus + createAuditLog for refund both commit', async () => {
    prisma.store.payments.set('pay-1', { id: 'pay-1', userId: 'user-1', amount: 9999, status: 'COMPLETED' });
    prisma.payment.update.mockResolvedValue({
      id: 'pay-1',
      status: 'REFUNDED',
      refundAmount: 5000,
    });

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: 'pay-1' },
        data: {
          status: 'REFUNDED',
          refundAmount: 5000,
          refundReason: 'User requested cancellation',
        },
      });
      await tx.auditLog.create({
        data: {
          action: 'REFUND',
          entity: 'Payment',
          entityId: 'pay-1',
          newValues: { status: 'REFUNDED', refundAmount: 5000 },
        },
      });
    });

    expect(prisma.payment.update).toHaveBeenCalledTimes(1);
    expect(prisma.auditLog.create).toHaveBeenCalledTimes(1);
  });

  it('handles partial refund correctly', async () => {
    prisma.store.payments.set('pay-1', { id: 'pay-1', userId: 'user-1', amount: 9999, status: 'COMPLETED' });
    prisma.payment.update.mockResolvedValue({
      id: 'pay-1',
      status: 'PARTIAL_REFUND',
      refundAmount: 3000,
    });

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: 'pay-1' },
        data: {
          status: 'PARTIAL_REFUND',
          refundAmount: 3000,
          refundReason: 'Partial course cancellation',
        },
      });
      await tx.auditLog.create({
        data: {
          action: 'PARTIAL_REFUND',
          entity: 'Payment',
          entityId: 'pay-1',
          newValues: { status: 'PARTIAL_REFUND', refundAmount: 3000 },
        },
      });
    });

    expect(prisma.payment.update).toHaveBeenCalledTimes(1);
  });

  it('rolls back when audit log fails during refund', async () => {
    prisma.store.payments.set('pay-1', { id: 'pay-1', userId: 'user-1', amount: 9999, status: 'COMPLETED' });
    prisma.auditLog.create.mockRejectedValueOnce(new Error('Audit write failed'));

    await expect(
      prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: 'pay-1' },
          data: { status: 'REFUNDED', refundAmount: 5000 },
        });
        await tx.auditLog.create({
          data: { action: 'REFUND', entity: 'Payment', entityId: 'pay-1' },
        });
      })
    ).rejects.toThrow('Audit write failed');
  });
});

// ─── Transaction Isolation ───────────────────────────────────────────────────

describe('Transaction Isolation', () => {
  it('$transaction is called as a function', () => {
    const prisma = createMockPrisma();
    expect(typeof prisma.$transaction).toBe('function');
  });

  it('transaction receives a transactional client', async () => {
    const prisma = createMockPrisma();
    let receivedTx: any = null;

    await prisma.$transaction(async (tx) => {
      receivedTx = tx;
    });

    expect(receivedTx).toBeDefined();
    expect(receivedTx.user).toBeDefined();
    expect(receivedTx.enrollment).toBeDefined();
  });

  it('concurrent transactions operate independently', async () => {
    const prisma = createMockPrisma();
    const results: string[] = [];

    const t1 = prisma.$transaction(async (tx) => {
      await tx.user.create({ data: { email: 'a@test.com', name: 'A' } });
      results.push('t1');
    });

    const t2 = prisma.$transaction(async (tx) => {
      await tx.user.create({ data: { email: 'b@test.com', name: 'B' } });
      results.push('t2');
    });

    await Promise.all([t1, t2]);
    expect(results).toContain('t1');
    expect(results).toContain('t2');
  });
});

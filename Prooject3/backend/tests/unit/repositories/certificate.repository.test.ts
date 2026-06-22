import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { CertificateRepository } from '../../../src/modules/certificates/certificate.repository.js';
import { UserFactory, ProgramFactory, CertificateFactory } from '../../factories/index.js';
import { truncateAllTables } from '../../setup/prisma.js';

describe('CertificateRepository', () => {
  let prisma: PrismaClient;
  let repository: CertificateRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    repository = new CertificateRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  describe('create', () => {
    it('should create a certificate', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();

      const certificate = await repository.create({
        certificateId: 'CV-TEST001',
        userId: user.id,
        programId: program.id,
        issuedAt: new Date(),
        isRevoked: false,
      });

      expect(certificate).toBeDefined();
      expect(certificate.id).toBeDefined();
      expect(certificate.certificateId).toBe('CV-TEST001');
      expect(certificate.userId).toBe(user.id);
      expect(certificate.programId).toBe(program.id);
    });
  });

  describe('findById', () => {
    it('should find certificate by id', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      const created = await CertificateFactory.create(user.id, program.id);

      const found = await repository.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent id', async () => {
      const found = await repository.findById('non-existent-id');

      expect(found).toBeNull();
    });
  });

  describe('findByCertificateId', () => {
    it('should find certificate by certificate id', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      const created = await CertificateFactory.create(user.id, program.id, {
        certificateId: 'CV-UNIQUE123',
      });

      const found = await repository.findByCertificateId('CV-UNIQUE123');

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent certificate id', async () => {
      const found = await repository.findByCertificateId('CV-NONEXISTENT');

      expect(found).toBeNull();
    });
  });

  describe('findByUserAndProgram', () => {
    it('should find certificate by user and program', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      const created = await CertificateFactory.create(user.id, program.id);

      const found = await repository.findByUserAndProgram(user.id, program.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent combination', async () => {
      const found = await repository.findByUserAndProgram('user-id', 'program-id');

      expect(found).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find multiple certificates', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      await CertificateFactory.create(user.id, program.id);
      await CertificateFactory.create(user.id, program.id);

      const certificates = await repository.findMany({});

      expect(certificates).toHaveLength(2);
    });
  });

  describe('findByUser', () => {
    it('should find certificates by user', async () => {
      const user = await UserFactory.create();
      const program1 = await ProgramFactory.create();
      const program2 = await ProgramFactory.create();
      await CertificateFactory.create(user.id, program1.id);
      await CertificateFactory.create(user.id, program2.id);

      const certificates = await repository.findByUser(user.id);

      expect(certificates).toHaveLength(2);
      expect(certificates.every(c => c.userId === user.id)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update certificate', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      const created = await CertificateFactory.create(user.id, program.id);

      const updated = await repository.update(created.id, { pdfUrl: 'https://example.com/cert.pdf' });

      expect(updated.pdfUrl).toBe('https://example.com/cert.pdf');
    });
  });

  describe('revoke', () => {
    it('should revoke certificate', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      const created = await CertificateFactory.create(user.id, program.id);

      const revoked = await repository.revoke(created.id, 'Academic misconduct');

      expect(revoked.isRevoked).toBe(true);
      expect(revoked.revokedAt).toBeDefined();
      expect(revoked.revokedReason).toBe('Academic misconduct');
    });
  });

  describe('delete', () => {
    it('should delete certificate', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      const created = await CertificateFactory.create(user.id, program.id);

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('count', () => {
    it('should count certificates', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      await CertificateFactory.create(user.id, program.id);
      await CertificateFactory.create(user.id, program.id);

      const count = await repository.count();

      expect(count).toBe(2);
    });
  });

  describe('verify', () => {
    it('should verify valid certificate', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      const created = await CertificateFactory.create(user.id, program.id);

      const result = await repository.verify(created.certificateId);

      expect(result.valid).toBe(true);
      expect(result.certificate).toBeDefined();
    });

    it('should return invalid for non-existent certificate', async () => {
      const result = await repository.verify('CV-NONEXISTENT');

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Certificate not found');
    });

    it('should return invalid for revoked certificate', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      const created = await CertificateFactory.create(user.id, program.id);
      await repository.revoke(created.id, 'Revoked');

      const result = await repository.verify(created.certificateId);

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Certificate has been revoked');
      expect(result.certificate).toBeDefined();
    });

    it('should return invalid for expired certificate', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      const created = await CertificateFactory.create(user.id, program.id, {
        expiresAt: new Date(Date.now() - 1000000),
      });

      const result = await repository.verify(created.certificateId);

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Certificate has expired');
    });
  });
});

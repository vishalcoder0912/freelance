import { PrismaClient, Certificate } from '@prisma/client';

export class CertificateRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any): Promise<Certificate> {
    return this.prisma.certificate.create({ data });
  }

  async findById(id: string): Promise<Certificate | null> {
    return this.prisma.certificate.findUnique({ where: { id } });
  }

  async findByCertificateId(certificateId: string): Promise<Certificate | null> {
    return this.prisma.certificate.findUnique({ where: { certificateId } });
  }

  async findByUserAndProgram(userId: string, programId: string): Promise<Certificate | null> {
    return this.prisma.certificate.findUnique({
      where: { userId_programId: { userId, programId } }
    });
  }

  async findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }): Promise<Certificate[]> {
    return this.prisma.certificate.findMany(params);
  }

  async findByUser(userId: string): Promise<Certificate[]> {
    return this.prisma.certificate.findMany({
      where: { userId },
      include: { program: true }
    });
  }

  async update(id: string, data: any): Promise<Certificate> {
    return this.prisma.certificate.update({ where: { id }, data });
  }

  async revoke(id: string, reason: string): Promise<Certificate> {
    return this.prisma.certificate.update({
      where: { id },
      data: { isRevoked: true, revokedAt: new Date(), revokedReason: reason }
    });
  }

  async delete(id: string): Promise<Certificate> {
    return this.prisma.certificate.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prisma.certificate.count({ where });
  }

  async verify(certificateId: string): Promise<{
    valid: boolean;
    certificate?: Certificate;
    reason?: string;
  }> {
    const certificate = await this.prisma.certificate.findUnique({
      where: { certificateId },
      include: { user: true, program: true }
    });

    if (!certificate) {
      return { valid: false, reason: 'Certificate not found' };
    }

    if (certificate.isRevoked) {
      return { valid: false, certificate, reason: 'Certificate has been revoked' };
    }

    if (certificate.expiresAt && new Date() > certificate.expiresAt) {
      return { valid: false, certificate, reason: 'Certificate has expired' };
    }

    return { valid: true, certificate };
  }
}

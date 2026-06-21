import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { join } from 'path';
import { URL } from 'url';

const prisma = new PrismaClient();

export async function setupTestDatabase() {
  const databaseUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('TEST_DATABASE_URL or DATABASE_URL must be set');
  }

  // Run migrations
  execSync('npx prisma migrate deploy', {
    cwd: join(import.meta.dirname, '../..'),
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl
    }
  });

  return prisma;
}

export async function teardownTestDatabase() {
  // Clean all tables in reverse order of dependencies
  const tableNames = [
    'audit_logs',
    'career_analyses',
    'resume_analyses',
    'interview_sessions',
    'mentor_sessions',
    'notifications',
    'payments',
    'placements',
    'applications',
    'jobs',
    'employers',
    'certificates',
    'submissions',
    'assignments',
    'enrollments',
    'contents',
    'lessons',
    'modules',
    'programs',
    'mentor_profiles',
    'blogs',
    'faculty',
    'achievers',
    'career_paths',
    'users'
  ];

  for (const tableName of tableNames) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${tableName}"`);
  }
}

export async function truncateAllTables() {
  const tableNames = [
    'audit_logs',
    'career_analyses',
    'resume_analyses',
    'interview_sessions',
    'mentor_sessions',
    'notifications',
    'payments',
    'placements',
    'applications',
    'jobs',
    'employers',
    'certificates',
    'submissions',
    'assignments',
    'enrollments',
    'contents',
    'lessons',
    'modules',
    'programs',
    'mentor_profiles',
    'blogs',
    'faculty',
    'achievers',
    'career_paths',
    'users'
  ];

  for (const tableName of tableNames) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tableName}" CASCADE`);
  }
}

export { prisma };

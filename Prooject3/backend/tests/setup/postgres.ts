import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { join } from 'path';

let container: StartedPostgreSqlContainer;
let prisma: PrismaClient;

export async function startTestDatabase() {
  container = await new PostgreSqlContainer('postgres:17-alpine')
    .withDatabase('careerveda_test')
    .withUsername('test')
    .withPassword('test')
    .withExposedPorts(5432)
    .start();

  const connectionString = container.getConnectionUri();
  process.env.DATABASE_URL = connectionString;
  process.env.TEST_DATABASE_URL = connectionString;

  // Run migrations
  execSync('npx prisma migrate deploy', {
    cwd: join(import.meta.dirname, '../..'),
    env: {
      ...process.env,
      DATABASE_URL: connectionString
    }
  });

  prisma = new PrismaClient({
    datasources: {
      db: {
        url: connectionString
      }
    }
  });

  return { container, prisma, connectionString };
}

export async function stopTestDatabase() {
  if (prisma) {
    await prisma.$disconnect();
  }
  if (container) {
    await container.stop();
  }
}

export function getTestPrisma() {
  return prisma;
}

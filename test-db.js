const postgres = require('postgres');

const databaseUrl = process.env.DATABASE_URL || 'postgresql://resumematch:resumematch123@postgres:5432/resumematch';

async function test() {
  const sql = postgres(databaseUrl);
  try {
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Conexão com banco OK:', result);
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    await sql.end();
    process.exit(1);
  }
}

test();


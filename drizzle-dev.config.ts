import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  dialect: 'mysql',
  schema: './src/lib/server/schema.ts',
  out: './drizzle',
  dbCredentials: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.DATABASE_Connection_PW!,
    database: 'J23rdHospital_TEST',
  },
  introspect: {
    casing: 'preserve',
  },
});

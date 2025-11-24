import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'mysql',
  schema: './src/lib/server/db/schema/entities',
  out: './drizzle',
  dbCredentials: {
    url: `${process.env.MySQL_Connection_String!}${
      process.env.NODE_ENV !== 'production' ? '_TEST' : ''
    }`,
  },
  introspect: {
    casing: 'preserve',
  },
});

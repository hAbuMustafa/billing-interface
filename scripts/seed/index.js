import { createServer } from 'vite';

async function runSeed() {
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const { beginSeed } = await server.ssrLoadModule('scripts/seed/seed.js');

  console.log('🌱 STARTING SEED PROCESS...');
  await beginSeed();
  console.log('\n✅ ALL SEEDING IS DONE!');

  await server.close();
}

runSeed().catch(console.error);

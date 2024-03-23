import initializeApp from './initialize-app';
import { port } from './settings';

async function start() {
  const app = await initializeApp();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

start();

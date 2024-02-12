import http from 'node:http';
import fs from 'node:fs';
import { join } from 'path';
import dotenv from 'dotenv';
import App from './App';
import { JSON_DB_PATH } from './consts';

dotenv.config();

const PORT = process.env.PORT || 4000;
const server = http.createServer();
const jsonDbFilePath = join(__dirname, JSON_DB_PATH);
const app = new App(jsonDbFilePath);

const deleteDb = () =>
  fs.unlink(jsonDbFilePath, (err) => {
    if (err) {
      throw err;
    } else {
      process.exit(1);
    }
  });

const start = () => {
  fs.writeFile(jsonDbFilePath, '[]', (err) => {
    if (err) {
      throw err;
    } else {
      server.listen(PORT, () => {
        console.log(`Server is listening on the port ${PORT}`);
      });
      server.on('request', async (req, res) => {
        await app.handleHttpRequest(req, res);
      });
      process.on('SIGINT', () => {
        deleteDb();
      });
    }
  });
};

start();

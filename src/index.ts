import http from 'node:http';
import fs from 'node:fs';
import dotenv from 'dotenv';
import { getFilePath } from './utils';
import { JSON_DB_PATH } from './consts';

dotenv.config();

const PORT = process.env.PORT || 3000;
const server = http.createServer();
const jsonDbFilePath = getFilePath(JSON_DB_PATH);

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
      server.on('request', (req, res) => {
        console.log(req, res);
      });
      process.on('SIGINT', () => {
        deleteDb();
      });
    }
  });
};

start();

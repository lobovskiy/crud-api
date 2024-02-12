import http from 'node:http';
import fs from 'node:fs';
import { join } from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const server = http.createServer();

const deleteDb = () =>
  fs.unlink(join(__dirname, 'db.json'), (err) => {
    if (err) {
      throw err;
    } else {
      process.exit(1);
    }
  });

const createDb = () =>
  fs.writeFile(join(__dirname, 'db.json'), '[]', (err) => {
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

createDb();

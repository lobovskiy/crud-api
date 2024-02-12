import http from 'node:http';
import fs from 'node:fs';
import { join } from 'path';
import cluster from 'cluster';
import { availableParallelism } from 'os';
import dotenv from 'dotenv';
import App from './App';
import { JSON_DB_PATH } from './consts';

dotenv.config();

const PORT = process.env.PORT || 3000;
const jsonDbFilePath = join(__dirname, JSON_DB_PATH);

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
      if (cluster.isPrimary) {
        const server = http.createServer();

        server.listen(PORT, () => {
          console.log(`Server is listening on the port ${PORT}`);
        });

        const numCPUs = availableParallelism();
        console.log(`Primary ${process.pid} is running`);

        const ports: number[] = [];
        let portsIndex = 0;

        for (let i = 0; i < numCPUs; i++) {
          ports.push(Number(PORT) + i + 1);
          cluster.fork({ PORT: Number(PORT) + i + 1 });
        }

        server.on('request', async (clientReq, clientRes) => {
          const options = {
            hostname: 'localhost',
            port: ports[portsIndex],
            path: clientReq.url,
            method: clientReq.method,
            headers: clientReq.headers,
          };

          portsIndex = (portsIndex + 1) % ports.length;

          const proxy = http.request(options, function (res) {
            if (res.statusCode) {
              clientRes.writeHead(res.statusCode, res.headers);
              res.pipe(clientRes, { end: true });
            }
          });

          clientReq.pipe(proxy, { end: true });
        });

        cluster.on('exit', (worker, code, signal) => {
          console.log(`worker ${worker.process.pid} died`);
          deleteDb();
        });
        process.on('SIGINT', () => {
          deleteDb();
        });
      } else {
        const server = http.createServer();
        const app = new App(jsonDbFilePath);

        server.listen(PORT, () => {
          console.log(`Server is listening on the port ${PORT}`);
        });
        server.on('request', async (req, res) => {
          console.log(`got request on port ${PORT}`);
          await app.handleHttpRequest(req, res);
        });
      }
    }
  });
};

start();

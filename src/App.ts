import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import UserService from './services/UserService';
import {
  isJsonString,
  parseIdFromUrl,
  validatePartialUserData,
  validatePathname,
  validateUserData,
  validateUuid,
} from './utils/appUtils';
import { sendResponse } from './utils/httpUtils';
import { BASE_URL } from './consts';

export default class App {
  private userService: UserService;

  constructor(jsonDbFilePath: string) {
    this.userService = new UserService(jsonDbFilePath);
  }

  async get(url: URL, res: ServerResponse) {
    const userId = parseIdFromUrl(BASE_URL, url.pathname);

    if (userId) {
      if (validateUuid(userId)) {
        const user = await this.userService.getById(userId);

        if (user) {
          sendResponse(res, 200, user);
        } else {
          sendResponse(res, 404, {
            error: `Not found`,
          });
        }
      } else {
        sendResponse(res, 400, {
          error: 'Bad request',
        });
      }
    } else {
      const users = await this.userService.get();

      sendResponse(res, 200, users);
    }
  }

  async post(req: IncomingMessage, res: ServerResponse) {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', async () => {
      if (isJsonString(data)) {
        const body = JSON.parse(data);

        if (validateUserData(body)) {
          const newUser = await this.userService.create(body);

          sendResponse(res, 201, newUser);
        } else {
          sendResponse(res, 400, {
            error: 'Bad request',
          });
        }
      } else {
        sendResponse(res, 400, {
          error: 'Bad request',
        });
      }
    });
  }

  async put(url: URL, req: IncomingMessage, res: ServerResponse) {
    const userId = parseIdFromUrl(BASE_URL, url.pathname);

    if (userId) {
      if (validateUuid(userId)) {
        let data: string = '';

        req.on('data', (dataChunk) => {
          data += dataChunk;
        });

        req.on('end', async () => {
          if (isJsonString(data)) {
            const body = JSON.parse(data);

            if (validatePartialUserData(body)) {
              const newUser = await this.userService.update(userId, body);

              if (newUser) {
                sendResponse(res, 200, newUser);
              } else {
                sendResponse(res, 404, {
                  error: `Not found`,
                });
              }
            } else {
              sendResponse(res, 400, {
                error: 'Bad request',
              });
            }
          } else {
            sendResponse(res, 400, {
              error: 'Bad request',
            });
          }
        });
      } else {
        sendResponse(res, 400, {
          error: 'Bad request',
        });
      }
    } else {
      sendResponse(res, 404, {
        error: `Not found`,
      });
    }
  }

  async delete(url: URL, req: IncomingMessage, res: ServerResponse) {
    const userId = parseIdFromUrl(BASE_URL, url.pathname);

    if (userId) {
      if (validateUuid(userId)) {
        const deletedUser = await this.userService.delete(userId);

        if (deletedUser) {
          sendResponse(res, 204, {
            message: 'User deleted',
          });
        } else {
          sendResponse(res, 404, {
            error: 'Not found',
          });
        }
      } else {
        sendResponse(res, 400, {
          error: 'Bad request',
        });
      }
    } else {
      sendResponse(res, 404, {
        error: `Not found`,
      });
    }
  }

  async handleHttpRequest(req: IncomingMessage, res: ServerResponse) {
    try {
      const { method } = req;

      res.setHeader('Content-Type', 'application/json');

      const url = new URL(`https://${req.headers.host}${req.url}`);

      if (!validatePathname(BASE_URL, url.pathname)) {
        sendResponse(res, 404, {
          error: `Resource "${url}" not found`,
        });

        return;
      }

      switch (method) {
        case 'GET':
          await this.get(url, res);

          break;
        case 'POST':
          await this.post(req, res);

          break;
        case 'PUT':
          await this.put(url, req, res);

          break;
        case 'DELETE':
          await this.delete(url, req, res);

          break;

        default:
          sendResponse(res, 501, {
            error: 'Http method not supported',
          });
      }
    } catch (error) {
      sendResponse(res, 500, {
        error: 'Internal server error',
      });

      throw error;
    }
  }
}

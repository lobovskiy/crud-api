import { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import UserService from './services/UserService';
import { validatePathname, validateUuid } from './utils/appUtils';
import { sendResponse } from './utils/httpUtils';
import { BASE_URL } from './consts';

export default class App {
  private userService: UserService;

  constructor(jsonDbFilePath: string) {
    this.userService = new UserService(jsonDbFilePath);
  }

  async get(url: URL, req: IncomingMessage, res: ServerResponse) {
    const userId = url.pathname;

    if (userId) {
      if (validateUuid(userId)) {
        const user = await this.userService.getById(userId);

        if (user) {
          sendResponse(res, 200, user);
        } else {
          sendResponse(res, 404, {
            error: `User ${userId} not found`,
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
          await this.get(url, req, res);

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

import { ServerResponse } from 'http';

export function sendResponse<T>(
  res: ServerResponse,
  statusCode: number,
  data: T
) {
  res.statusCode = statusCode;
  res.write(JSON.stringify(data));
  res.end();
}

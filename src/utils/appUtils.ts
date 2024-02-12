import { UserData } from '../types';

export function validatePathname(baseUrl: string, path?: string) {
  if (!path) {
    return false;
  }

  return path.startsWith(baseUrl);
}

export function parseIdFromUrl(baseurl: string, path?: string) {
  if (!path || !path.startsWith(baseurl)) {
    return null;
  }

  return path.slice(`${baseurl}/`.length);
}

export function validateUuid(id: string) {
  const regExpUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return regExpUuid.test(id);
}

export function validateUserData(object: unknown): object is UserData {
  if (
    typeof object === 'object' &&
    object !== null &&
    object.hasOwnProperty('age') &&
    object.hasOwnProperty('username') &&
    object.hasOwnProperty('hobbies')
  ) {
    const { age, username, hobbies } = object as {
      age: unknown;
      username: unknown;
      hobbies: unknown;
    };

    if (typeof age !== 'number' || age <= 0) {
      return false;
    }

    if (typeof username !== 'string' || username.trim() === '') {
      return false;
    }

    if (!Array.isArray(hobbies)) {
      return false;
    }

    return true;
  }

  return false;
}

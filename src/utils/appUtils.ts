import { AtLeastOnePropOf, UserData } from '../types';

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

export function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
}

export function validateUserData(object: unknown): object is UserData {
  if (
    typeof object === 'object' &&
    object !== null &&
    object.hasOwnProperty('username') &&
    object.hasOwnProperty('age') &&
    object.hasOwnProperty('hobbies')
  ) {
    const { age, username, hobbies } = object as {
      username?: unknown;
      age?: unknown;
      hobbies?: unknown;
    };

    if (
      !!username &&
      typeof username === 'string' &&
      username.trim() !== '' &&
      !!age &&
      typeof age === 'number' &&
      age > 0 &&
      !!hobbies &&
      Array.isArray(hobbies)
    ) {
      return true;
    }
  }

  return false;
}

export function validatePartialUserData(
  object: unknown
): object is AtLeastOnePropOf<UserData> {
  if (
    typeof object === 'object' &&
    object !== null &&
    (object.hasOwnProperty('username') ||
      object.hasOwnProperty('age') ||
      object.hasOwnProperty('hobbies'))
  ) {
    const { age, username, hobbies } = object as {
      username?: unknown;
      age?: unknown;
      hobbies?: unknown;
    };

    if (!username && !age && !hobbies) {
      return false;
    }

    let isUsernameValid = true;
    let isAgeValid = true;
    let isHobbiesValid = true;

    if (!!username) {
      isUsernameValid = typeof username === 'string' && username.trim() !== '';
    }

    if (!!age) {
      isAgeValid = typeof age === 'number' && age > 0;
    }

    if (!!hobbies) {
      isHobbiesValid = Array.isArray(hobbies);
    }

    return isUsernameValid && isAgeValid && isHobbiesValid;
  }

  return false;
}

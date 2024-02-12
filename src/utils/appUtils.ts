export function validatePathname(baseUrl: string, path?: string) {
  if (!path) {
    return false;
  }

  return path.startsWith(baseUrl);
}

export function parseIdFromUrl(url?: string) {
  if (!url) {
    return null;
  }

  const userId = url.replace('/api/users', '');

  return userId.length > 1 ? userId.slice(1) : null;
}

export function validateUuid(id: string) {
  const regExpUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return regExpUuid.test(id);
}

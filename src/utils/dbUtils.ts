import fsPromises from 'fs/promises';
import fsp from 'fs/promises';

export async function readJsonDb<T>(dbFilePath: string): Promise<T[]> {
  const data = await fsPromises.readFile(dbFilePath, 'utf-8');

  return JSON.parse(data) as T[];
}

export async function updateJsonDb<T>(
  dbFilePath: string,
  data: T[]
): Promise<void> {
  await fsp.writeFile(dbFilePath, JSON.stringify(data), 'utf-8');
}

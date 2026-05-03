import { cache } from 'react';
import { Category, toMenuItems } from 'web-one';
import { db } from './db';

const sql = "select id, name, path, resource_key as resource, icon, sequence, type, parent from categories where status = 'A'"
export const getMenu = cache(async () => {
  console.log('Fetching menu...');
  const categories = await db.query<Category>(sql)
  return toMenuItems(categories)
})

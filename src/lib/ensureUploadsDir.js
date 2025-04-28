import { mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function ensureUploadsDir() {
  const publicDir = join(process.cwd(), 'public');
  const uploadsDir = join(publicDir, 'uploads');
  
  if (!existsSync(uploadsDir)) {
    try {
      await mkdir(uploadsDir, { recursive: true });
      console.log('Created uploads directory');
    } catch (error) {
      console.error('Error creating uploads directory:', error);
    }
  }
} 
import fs from 'fs';
import path from 'path';

export const setupUploadsDirectory = () => {
  const uploadsDir = path.join(__dirname, '../../uploads');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}; 
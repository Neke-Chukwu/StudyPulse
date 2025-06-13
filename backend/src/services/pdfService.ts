import pdfParse from 'pdf-parse';
import { promises as fs } from 'fs';

export const parsePDF = async (filePath: string): Promise<string> => {
  try {
    // Read the PDF file
    const dataBuffer = await fs.readFile(filePath);

    // Parse the PDF
    const data = await pdfParse(dataBuffer);

    // Extract text content
    const text = data.text;

    // Clean up the text
    const cleanedText = text
      .replace(/\r\n/g, ' ') // Replace line breaks with spaces
      .replace(/\n/g, ' ') // Replace new line breaks with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim(); // Remove leading/trailing whitespace

    // Delete the uploaded file
    await fs.unlink(filePath);

    return cleanedText;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF');
  }
}; 
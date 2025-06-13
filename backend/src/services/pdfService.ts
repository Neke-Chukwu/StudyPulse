import pdfParse from 'pdf-parse';
import fs from 'fs/promises';

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
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();

    // Delete the uploaded file after processing
    await fs.unlink(filePath);

    return cleanedText;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF');
  }
}; 
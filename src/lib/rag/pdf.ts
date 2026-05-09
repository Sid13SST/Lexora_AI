/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
/**
 * Extracts text from a PDF buffer page-by-page.
 */
export interface PDFPage {
  content: string;
  pageNumber: number;
}

export async function extractPagesFromPDF(buffer: Buffer): Promise<PDFPage[]> {
  if (typeof (global as any).DOMMatrix === 'undefined') {
    (global as any).DOMMatrix = class {};
  }

  try {
    const pdf = require('pdf-parse-fork');
    const pages: PDFPage[] = [];
    
    // Custom page renderer to capture text by page
    const options = {
      pagerender: async (pageData: any) => {
        const textContent = await pageData.getTextContent();
        const text = textContent.items.map((s: any) => s.str).join(' ');
        pages.push({
          content: text,
          pageNumber: pageData.pageIndex + 1
        });
        return text;
      }
    };

    await pdf(buffer, options);
    
    // Sort pages just in case they are processed out of order
    return pages.sort((a, b) => a.pageNumber - b.pageNumber);
  } catch (error: any) {
    console.error(">>> [PDF_EXTRACT] Error:", error);
    throw error;
  }
}

/**
 * Legacy support for single string extraction
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const pages = await extractPagesFromPDF(buffer);
  return pages.map(p => p.content).join('\n');
}

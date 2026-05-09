const pdfParseModule = require('pdf-parse/node');

async function test() {
  try {
    console.log('PDFParse/node keys:', Object.keys(pdfParseModule));
    const PDFParseClass = pdfParseModule.PDFParse || pdfParseModule;
    console.log('Type of PDFParseClass:', typeof PDFParseClass);
  } catch (err) {
    console.error('Test failed:', err);
  }
}

test();

const { PDFParse } = require('pdf-parse');

async function test() {
  try {
    console.log('PDFParse keys:', Object.keys(require('pdf-parse')));
    const parser = new PDFParse({ data: Buffer.from('test') });
    console.log('Parser created successfully');
  } catch (err) {
    console.error('Test failed:', err);
  }
}

test();

const fs = require('fs');

async function test() {
  try {
    const formData = new FormData();
    const content = 'Hello world test file';
    const blob = new Blob([content], { type: 'text/plain' });
    formData.append('file', blob, 'test.txt');

    console.log('Sending request to http://localhost:3000/api/upload...');
    const res = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch failed:', err.message);
  }
}

test();

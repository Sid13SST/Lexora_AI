const { QdrantClient } = require('@qdrant/js-client-rest');

const client = new QdrantClient({ url: 'http://localhost:6333' });

async function reset() {
  try {
    await client.deleteCollection('lexora_documents');
    console.log('Collection deleted successfully');
  } catch (err) {
    console.error('Error deleting collection:', err.message);
  }
}

reset();

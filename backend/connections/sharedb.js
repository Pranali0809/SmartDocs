const ShareDB = require('sharedb');
const richText = require('rich-text');
const ShareDBMongo = require('sharedb-mongo');

ShareDB.types.register(richText.type);

let backendInstance;

async function initShareDB() {
  if (backendInstance) return backendInstance;

  // Pass MongoDB URI string directly
  const dbAdapter = ShareDBMongo(process.env.MONGODB_URI);
  backendInstance = new ShareDB({ db: dbAdapter });

  return backendInstance;
}

module.exports = initShareDB;
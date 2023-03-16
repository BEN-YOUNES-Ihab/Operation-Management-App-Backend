const { MongoClient, Db } = require("mongodb");

let client = null;

function connect(url, callback) {
  if (client === null) {
    client = new MongoClient(url);

    client.connect((err) => {
      if (err) {
        client = null;
        callback(err);
      } else {
        callback();
      }
    });
  } else {
    callback();
  }
}

function db() {
  var db = new Db(client, "dafDemo");
  return db;
}

function close() {
  if (client) {
    client.close();
    client = null;
  }
}

module.exports = { connect, client, db, close };

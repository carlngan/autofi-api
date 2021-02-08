const sqlite3 = require("sqlite3").verbose()
const db = new sqlite3.Database(":memory:")

db.serialize(() => {
  db.run(`
    CREATE TABLE 'vehicles' (
      'uuid' VARCHAR(255) NOT NULL PRIMARY KEY UNIQUE,
      'vin' VARCHAR(255) NOT NULL UNIQUE,
      'providerName' VARCHAR(255) DEFAULT NULL,
      'make' VARCHAR(255) DEFAULT NULL,
      'model' VARCHAR(255) DEFAULT NULL,
      'mileage' INT DEFAULT NULL,
      'year' INT DEFAULT NULL,
      'price' FLOAT DEFAULT NULL,
      'zipCode' INT(5) DEFAULT NULL,
      'createDate' DATETIME DEFAULT NULL,
      'updateDate' DATETIME DEFAULT NULL
    );
  `)
})

module.exports = { db }

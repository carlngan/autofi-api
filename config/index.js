// this is to make sure we are not missing any variables from .env

if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV required from env")
}
if (!process.env.PORT) {
  throw new Error("PORT required from env")
}
if (!process.env.LOG_TYPE) {
  throw new Error("LOG_TYPE required from env")
}
if (!process.env.COLUMNS) {
  throw new Error("COLUMNS required from env")
}

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  logType: process.env.LOG_TYPE,
  columns: process.env.COLUMNS
}

module.exports.config = config

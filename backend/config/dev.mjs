import * as dotenv from 'dotenv'

dotenv.config()

export default {
  dbURL: process.env.DB_URI,
  dbName : process.env.DB_NAME
}


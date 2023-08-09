import mongoDB from 'mongodb'
const {MongoClient} = mongoDB

import {config} from '../config/index.mjs'
import {logger}  from './logger.service.mjs'

export const dbService = {
    getCollection
}

var dbConn = null

async function getCollection(collectionName) {
    try {
        const db = await connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function connect() {  
    if (dbConn) return dbConn
    try {
        logger.info('Connecting to DB',config)
        const client = await MongoClient.connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
        logger.info('Connected to DB.')
        const db = client.db(config.dbName)
        dbConn = db
        return db
    } catch (err) {
        logger.error('Cannot Connect to DB', err)
        throw err
    }
}





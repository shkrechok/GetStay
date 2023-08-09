import { dbService } from '../../services/db.service.mjs'
import { logger } from '../../services/logger.service.mjs'
import { utilService } from '../../services/util.service.mjs'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

async function query(filterBy = { txt: '' }) {
    try {
      const criteria = _buildCriteria(filterBy);
      const collection = await dbService.getCollection('order')
  
      const pipeline = [
        { $match: criteria },
        {
          $addFields: {
            buyerId: { $toObjectId: '$buyerId' }
          }
        },
        {
          $lookup: {
            from: 'user',
            localField: 'buyerId',
            foreignField: '_id',
            as: 'guest'
          }
        },
        {
          $addFields: {
            guest: {
              $arrayElemAt: [
                {
                  $map: {
                    input: '$guest',
                    as: 'user',
                    in: {
                      fullname: '$$user.fullname',
                      imgUrl: '$$user.imgUrl'
                    }
                  }
                },
                0
              ]
            }
          }
        },
      ]
  
      if (filterBy.pageIdx !== undefined) {
        pipeline.push({ $skip: filterBy.pageIdx * PAGE_SIZE })
        pipeline.push({ $limit: PAGE_SIZE })
      }
  
      const orders = await collection.aggregate(pipeline).toArray()
    //   console.log('orders service orders', orders)
      return orders
    } catch (err) {
      logger.error('Cannot find orders', err)
      throw err
    }
  }
  



function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.host) {
        criteria.hostId = `${filterBy.host}`
    }
    else if (filterBy.buyer) {

    }
    return criteria
}

async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        const order = collection.findOne({ _id: new ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`while finding order ${orderId}`, err)
        throw err
    }
}

async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ _id: new ObjectId(orderId) })
        return orderId
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}

async function add(order) {
    try {
        // console.log('order service server:', order)
        order.createrAt = Date.now()
        delete order._id
        const collection = await dbService.getCollection('order')
        await collection.insertOne(order)
        return order
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}

async function update(order) {
    try {
        const id=order._id
        delete order._id
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: new ObjectId(id) }, { $set: order })
        order._id=id
        return order
    } catch (err) {
        logger.error(`cannot update order ${order._Id}`, err)
        throw err
    }
}

export const orderService = {
    remove,
    query,
    getById,
    add,
    update,

}

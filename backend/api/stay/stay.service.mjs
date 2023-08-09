import { dbService } from '../../services/db.service.mjs'
import { logger } from '../../services/logger.service.mjs'
import { utilService } from '../../services/util.service.mjs'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

const PAGE_SIZE = 3


async function query(filterBy) {
    try {
        //todo : build criteria
        const criteria = _buildCriteria(filterBy)
        // console.log('criteria', criteria)
        const collection = await dbService.getCollection('stay')
        var stayCursor = await collection.find(criteria)

        if (filterBy.pageIdx !== undefined) {
            // console.log('here')
            stayCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
        }

        const stays = stayCursor.toArray()
        // console.log('stays stay service server', stays)
        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    var criteria = {}
    // console.log('stay service srver', filterBy)
    if (filterBy.where) {
        const keywords = filterBy.where.split(', ')
        const searchPattern1 = keywords[0]
        const searchPattern2 = keywords[1]
        criteria.$and = [
            {
                $or: [
                    { "loc.country": { $regex: searchPattern1, $options: 'i' } },
                    { "loc.city": { $regex: searchPattern1, $options: 'i' } },
                    { "name": { $regex: searchPattern1, $options: 'i' } }
                ]
            }
        ]
        if (searchPattern2) {
            criteria.$and.push(
                {
                    $or: [
                        { "loc.country": { $regex: searchPattern2, $options: 'i' } },
                        { "loc.city": { $regex: searchPattern2, $options: 'i' } },
                        { "name": { $regex: searchPattern2, $options: 'i' } }
                    ]
                }
            )
        }

    }
    if (filterBy.guests) {
        const guests = JSON.parse(filterBy.guests)

        if (guests.adults || guests.children) {
            const capacityFromFilter = {
                adults: isNaN(parseInt(guests.adults)) ? 0 : parseInt(guests.adults),
                children: isNaN(parseInt(guests.children)) ? 0 : parseInt(guests.children),
            }
            // console.log('capacityFromFilter', capacityFromFilter)
            criteria.capacity = { $gte: capacityFromFilter.adults + capacityFromFilter.children }
        }
    }

    if (filterBy.checkIn) {
        const checkIn = new Date(filterBy.checkIn)
        let checkOut
        if (filterBy.checkOut) {
            checkOut = new Date(filterBy.checkOut)
        } else {
            const nextDay = new Date(filterBy.checkIn)
            nextDay.setDate(nextDay.getDate() + 1)
            checkOut = nextDay
        }

        criteria.availableFrom = { $lte: checkIn }
        criteria.availableTill = { $gte: checkOut }
    }

    if (filterBy.label) {
        criteria.labels = filterBy.label
    }

    if (filterBy.host) {
        criteria.host = new ObjectId(filterBy.host)
        // console.log('criteria.host', criteria.host)
    }
    return criteria
}

async function getById(stayId) {
    try {
        const pipeLine = _aggregationPipeLine(stayId)
        const collection = await dbService.getCollection('stay')
        const stay = await collection.aggregate(pipeLine).toArray()
        return stay[0]
    } catch (err) {
        logger.error(`while finding stay ${stayId}`, err)
        throw err
    }
}
function _aggregationPipeLine(stayId) {
    return [
        { $match: { _id: new ObjectId(stayId) } },
        {
            $lookup: {
                from: 'user',
                foreignField: '_id',
                localField: 'host',
                as: 'host',
            },
        },
        {
            $addFields: {
                host: { $arrayElemAt: ['$host', 0] }
            }
        },
        {
            $project: {
                'host.password': 0
            }
        },
        {
            $lookup: {
                from: 'review',
                foreignField: '_id',
                localField: 'reviews',
                as: 'reviews',
            },
        },
    ]
}

async function remove(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.deleteOne({ _id: new ObjectId(stayId) })
        return stayId
    } catch (err) {
        logger.error(`cannot remove stay ${stayId}`, err)
        throw err
    }
}

async function add(stay) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.insertOne(stay)
        return stay
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}

async function update(stay) {
    try {
        const stayToSave = {
            // vendor: stay.vendor,
            // price: stay.price,
            likedByUsers: stay.likedByUsers
        }
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ _id: new ObjectId(stay._id) }, { $set: stayToSave })
        return stay
    } catch (err) {
        logger.error(`cannot update stay ${stay._Id}`, err)
        throw err
    }
}

export const stayService = {
    remove,
    query,
    getById,
    add,
    update,
}

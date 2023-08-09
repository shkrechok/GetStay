// import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
// import { userService } from './user.service.js'
import { storageService } from './async-storage.service.js'
import { socketService } from './socket.service.js'

const STORAGE_KEY = 'order_db'
const API='order'
export const orderService = {
    query,
    getById,
    // getBySellerId,
    // getByBuyerId,
    remove,
    save,
    getEmptyOrder,
    getNights,
    update,
    // getTotalPrice
}

// async function query() {
//     return httpService.get(STORAGE_KEY)
// }

async function query(filterBy) {
    // console.log('filterBy',filterBy)
    return httpService.get(API,filterBy)
    // return await storageService.query(STORAGE_KEY)
}



function getById(orderId) {
    return storageService.get(STORAGE_KEY, orderId)
}
// function getBySellerId(sellerId){
// return httpService.get(`order/${orderId}`)
// }

async function remove(orderId) {
    return httpService.delete(`order/${orderId}`)
}
async function save(order) {
    // var savedOrder
    // savedOrder = await storageService.post(STORAGE_KEY, order)
    socketService.emit('new-order', order)
    return httpService.post(API,order)

}
async function update(order){
    socketService.emit('update-order', order)
    return httpService.put('order/' + order._id, order)
}

function getEmptyOrder() {
    return {
        _id: '',
        stayId: '',
        hostId: '',
        buyerId: '',
        info: {
            checkin: 0,
            checkout: 0,
            price: 0,
            guests: {
                adults:0,
                children:0,
                infants:0,
                pets:0

            },
        },
        createdAt: 0,
        isAproved: false,

    }
}


function getNights(order) {
    console.log(new Date(order.info.checkin)-new Date(order.info.checkout))
    return (new Date(order.info.checkout) - new Date(order.info.checkin)) / (1000 * 60 * 60 * 24)
    
}

// function getTotalPrice(numberOfNights) {
//     const numberOfNights = (order.info) ? orderService.getNights(order) : 7
//     console.log(numberOfNights)
//     return (stay.price * numberOfNights + 555)
// }
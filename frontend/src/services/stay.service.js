
// import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
// import { userService } from './user.service.js'


const API = 'stay'
const gPlaces = [
    "Sydney, Australia",
    "Istanbul, Turkey",
    "Montreal, Canada",
    "New York, United States",
    "Los Angeles, United States",
    'Barcelona, Spain',
    'Maui, United States',
    'Porto, Portugal',
    'Portugal',
    'United States',
    'Spain',
    'Israel',
    'Tel Aviv, Israel',
    'Boston, United States',
    'Paris, France',
    'Berlin, Germany',
    'Madrid, Spain',
    'Rome, Italy',
    'Sydney, Australia',
    'Tokyo, Japan',
    'Cairo, Egypt',
    'London, United Kingdom',
    'Amsterdam, Netherlands',
    'Dubai, United Arab Emirates',
    'Moscow, Russia',
    'Toronto, Canada',
    'São Paulo, Brazil',
    'Mumbai, India',
    'Cape Town, South Africa',
    'Seoul, South Korea',
    'Stockholm, Sweden',
    'Mexico City, Mexico',
    'Vienna, Austria',
    'Helsinki, Finland',
    'Athens, Greece',
    'Zurich, Switzerland',
    'Oslo, Norway',
    'Dublin, Ireland',
    'Prague, Czech Republic',
    'Buenos Aires, Argentina',
    'Singapore',
    'Hong Kong',
]

export const stayService = {
    query,
    getById,
    save,
    remove,
    getPlacesQuery,
    // getEmptyStay,
    // addStayMsg,
    getDefaultFilter
}
window.cs = stayService

// function getPlacesQuery(searchStr) {
//     const keywords = searchStr.split(/[\s,]+/)
//     const searchPattern = keywords.map(word => `\\b${word}\\b`).join('.*')
//     const regex = new RegExp(searchPattern, 'i')
//     const places = gPlaces.filter(place => regex.test(place))
//     // console.log('places query', places)
//     return places


// }
// changed regex handling for safari 
function getPlacesQuery(searchStr) {
    const keywords = searchStr.split(/[\s,]+/);
    const searchPattern = keywords.map(word => `\\b${word}\\b`).join('.*');
    try {
        const regex = new RegExp(searchPattern, 'i');
        const places = gPlaces.filter(place => regex.test(place));
        // console.log('places query', places)
        return places;
    } catch (error) {
        console.error('Regular expression error:', error);
        return [];
    }
}
async function query(filterBy) {
    // const filterQueryParams = getQueryParams(filterBy)
    //TODO: add filterBy to query params
    return httpService.get(API, filterBy)
}

function getById(stayId) {
    return httpService.get(`${API}/${stayId}`)
}

async function remove(stayId) {
    return httpService.delete(`${API}/${stayId}`)
}
async function save(stay) {
    var savedStay
    console.log(stay)
    if (stay._id) {
        savedStay = await httpService.put(`${API}/${stay._id}`, stay)
        console.log(savedStay)
    } else {
        savedStay = await httpService.post(`${API}`, stay)
        console.log(savedStay)
    }
    return savedStay
}

function getDefaultFilter() {
    return {
        where: '',
        label: '',
        price: '',
        checkIn: '',
        checkOut: '',
        guests: {
            adults: 0,
            children: 0,
            infants: 0,
            pets: 0,
        }

    }
}

function getQueryParams(filterBy = {}) {
    const baseUrl = window.location.origin + window.location.pathname
    const checkInPart = filterBy.checkIn ? `checkIn=${filterBy.checkIn}` : ''
    const checkOutPart = filterBy.checkOut ? `checkOut=${filterBy.checkOut}` : ''
    const guestsPart = (filterBy.guests) && (filterBy.guests.adults || filterBy.guests.children)
        ? `guests=${JSON.stringify(filterBy.guests)}` : ''

    const wherePart = filterBy.where ? `where=${filterBy.where}` : ''
    const filterQueryParams = `?${wherePart}&${guestsPart}&${checkInPart}&${checkOutPart}`
    return filterQueryParams
    // const urlWithParams = baseUrl + filterQueryParams
    // window.history.pushState(null, null, urlWithParams)
}

// async function addStayMsg(stayId, txt) {
//     const savedMsg = await httpService.post(`stay/${stayId}/msg`, { txt })
//     return savedMsg
// }

// function getDefaultFilter() {
//     return { price: 750, txt: '', location: '', checkIn: '', checkOut: '', adults: 0, children: 0, infants: 0, pets: 0 }
// }

// function getEmptyStay() {
//     return {
//         // name: "Ribeira Charming Duplex",
//         type: "House",
//         imgUrls: ["https://image.cnbcfm.com/api/v1/image/106758801-1603459526384-picture-perfect-beautiful-house-on-the-island-of-coronado-in-sunny-california-beautifully-landscaped_t20_6lJOrv.jpg?v=1603459593&w=740&h=416&ffmt=webp&vtcrop=y"],
//         // price: 80.00,
//         summary: "Fantastic duplex apartment...",
//         capacity: 8,
//         amenities: [
//             "TV",
//             "Wifi",
//             "Kitchen",
//             "Smoking allowed",
//             "Pets allowed",
//             "Cooking basics"
//         ],
//         labels: [
//             "Top of the world",
//             "Trending",
//             "Play",
//             "Tropical"
//         ],
//         host: {
//             _id: "u101",
//             fullname: "Davit Pok",
//             imgUrl: "https://a0.muscache.com/im/pictures/fab79f25-2e10-4f0f-9711-663cb69dc7d8.jpg?aki_policy=profile_small",
//         },
//         loc: {
//             country: "Portugal",
//             countryCode: "PT",
//             city: "Lisbon",
//             address: "17 Kombo st",
//             lat: -8.61308,
//             lng: 41.1413
//         },
//         reviews: [
//             {
//                 id: "madeId",
//                 txt: "Very helpful hosts. Cooked traditional...",
//                 rate: 4,
//                 by: {
//                     _id: "u102",
//                     fullname: "user2",
//                     imgUrl: "/img/img2.jpg"
//                 }
//             }
//         ],
//         likedByUsers: ['mini-user']
//     }
// }






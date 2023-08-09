import { stayService } from '../services/stay.service.js'


export const SET_STAYS = 'SET_STAYS'
export const REMOVE_STAY = 'REMOVE_STAY'
export const ADD_STAY = 'ADD_STAY'
export const UPDATE_STAY = 'UPDATE_STAY'

export const ADD_TO_CART = 'ADD_TO_CART'
export const CLEAR_CART = 'CLEAR_CART'
export const UNDO_REMOVE_STAY = 'UNDO_REMOVE_STAY'
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART'

// FILTER
export const SET_FILTER = 'SET_FILTER'
export const SET_PLACES = 'SET_PLACES'



const initialState = {
    stays: [],
    cart: [],
    lastRemovedStay: null,
    filterBy: stayService.getDefaultFilter(),
    places: []
}

export function stayReducer(state = initialState, action) {
    var newState = state
    var stays
    var cart
    switch (action.type) {
        case SET_STAYS:
            newState = { ...state, stays: action.stays }
            break
        case REMOVE_STAY:
            const lastRemovedStay = state.stays.find(stay => stay._id === action.stayId)
            stays = state.stays.filter(stay => stay._id !== action.stayId)
            newState = { ...state, stays, lastRemovedStay }
            break
        case ADD_STAY:
            newState = { ...state, stays: [...state.stays, action.stay] }
            break
        case UPDATE_STAY:
            stays = state.stays.map(stay => (stay._id === action.stay._id) ? action.stay : stay)
            newState = { ...state, stays }
            break
        case ADD_TO_CART:
            newState = { ...state, cart: [...state.cart, action.stay] }
            break
        case REMOVE_FROM_CART:
            cart = state.cart.filter(stay => stay._id !== action.stayId)
            newState = { ...state, cart }
            break
        case CLEAR_CART:
            newState = { ...state, cart: [] }
            break
        case UNDO_REMOVE_STAY:
            if (state.lastRemovedStay) {
                newState = { ...state, stays: [...state.stays, state.lastRemovedStay], lastRemovedStay: null }
            }
            break
        case SET_FILTER:
            return { ...state, filterBy: action.filterBy }
        case SET_PLACES:
            return { ...state, places: action.places }
        default:
    }
    return newState
}

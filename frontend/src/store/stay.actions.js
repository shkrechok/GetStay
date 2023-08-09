import { ADD_STAY, ADD_TO_CART, CLEAR_CART, REMOVE_STAY, REMOVE_FROM_CART, SET_STAYS, UNDO_REMOVE_STAY, UPDATE_STAY, SET_FILTER, SET_PLACES } from "./stay.reducer.js";
import { stayService } from "../services/stay.service.js";
import { userService } from "../services/user.service.js";
import { store } from './store.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { SET_SCORE } from "./user.reducer.js";
// import { check } from "yargs";

// Action Creators:
export function getActionRemoveStay(stayId) {
    return {
        type: REMOVE_STAY,
        stayId
    }
}
export function getActionAddStay(stay) {
    return {
        type: ADD_STAY,
        stay
    }
}
export function getActionUpdateStay(stay) {
    return {
        type: UPDATE_STAY,
        stay
    }
}

export async function loadStays(filterBy = {}) {
    try {
        const stays = await stayService.query(filterBy)
        console.log('Stays from DB:', stays)
        store.dispatch({
            type: SET_STAYS,
            stays
        })

    } catch (err) {
        console.log('Cannot load stays', err)
        throw err
    }

}

export async function removeStay(stayId) {
    try {
        await stayService.remove(stayId)
        store.dispatch(getActionRemoveStay(stayId))
    } catch (err) {
        console.log('Cannot remove stay', err)
        throw err
    }
}

export async function addStay(stay) {
    try {
        const savedStay = await stayService.save(stay)
        console.log('Added Stay', savedStay)
        store.dispatch(getActionAddStay(savedStay))
        return savedStay
    } catch (err) {
        console.log('Cannot add stay', err)
        throw err
    }
}

export function updateStay(stay) {
    return stayService.save(stay)
        .then(savedStay => {
            console.log('Updated Stay:', savedStay)
            store.dispatch(getActionUpdateStay(savedStay))
            return savedStay
        })
        .catch(err => {
            console.log('Cannot save stay', err)
            throw err
        })
}

export function loadPlaces(searchStr) {
    const places = stayService.getPlacesQuery(searchStr)
    store.dispatch({
        type: SET_PLACES,
        places
    })
}

export function addToCart(stay) {
    store.dispatch({
        type: ADD_TO_CART,
        stay
    })
}

export function removeFromCart(stayId) {
    store.dispatch({
        type: REMOVE_FROM_CART,
        stayId
    })
}

export async function checkout(total) {
    try {
        const score = await userService.changeScore(-total)
        store.dispatch({ type: SET_SCORE, score })
        store.dispatch({ type: CLEAR_CART })
        return score
    } catch (err) {
        console.log('StayActions: err in checkout', err)
        throw err
    }
}


// Demo for Optimistic Mutation 
// (IOW - Assuming the server call will work, so updating the UI first)
export function onRemoveStayOptimistic(stayId) {
    store.dispatch({
        type: REMOVE_STAY,
        stayId
    })
    showSuccessMsg('Stay removed')

    stayService.remove(stayId)
        .then(() => {
            console.log('Server Reported - Deleted Succesfully')
        })
        .catch(err => {
            showErrorMsg('Cannot remove stay')
            console.log('Cannot load stays', err)
            store.dispatch({
                type: UNDO_REMOVE_STAY,
            })
        })
}

export function setFilterBy(filterBy = {}) {
    store.dispatch({ type: SET_FILTER, filterBy })
}

export function retrieveQeryParams() {
    const params = new URLSearchParams(window.location.search)
    const where = params.get('where') || ''
    const guests = JSON.parse(params.get('guests')) || { adults: 0, children: 0 , infants: 0, pets: 0}
    let checkIn 
    if (params.get('checkIn')) checkIn = new Date(params.get('checkIn'))
    let checkOut 
    if (params.get('checkOut')) checkOut = new Date(params.get('checkOut'))
    const paramsFilterBy = { where, guests: {...guests}, checkIn, checkOut }
    return paramsFilterBy
}

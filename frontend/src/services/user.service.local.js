import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import gUser from '../assets/data/user.json'

export const userService = {
    getRandomUser,
    query,
    login,
    saveLocalUser,
    getLoggedinUser,
    logout,
    signup,
    getEmptyCredentials
}

const USER_KEY = 'user_db'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

// console.log('gUser', gUser)

async function query() {
    return await storageService.query(USER_KEY)
}

function getRandomUser() {
    const users = utilService.loadFromStorage(USER_KEY)
    return users[utilService.getRandomIntInclusive(0, users.length - 1)]
}

async function login(userCred) {
    console.log(userCred)
    const users = await storageService.query('user_db')
    console.log(users)
    const user = users.find(user => user.username === userCred.username)
    // const user = await httpService.post('auth/login', userCred)
    if (user) {
        return saveLocalUser(user)
    }
}

function saveLocalUser(user) {
    console.log(user)
    user = { _id: user._id, fullname: user.fullname, imgUrl: user.imgUrl, about: user.about, isSuperhost: user.isSuperhost, location: user.location, responseTime: user.responseTime, }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

async function signup(userCred) {
    userCred.isSuperhost = false
    userCred.about = "Nice person!"
    userCred.location = "Haifa, Israel"
    userCred.responseTime = "within an hour"
    userCred._id = utilService.makeId()
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    const user = await storageService.post('user_db', userCred)
    // const user = await httpService.post('auth/signup', userCred)
    return saveLocalUser(user)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    // return await httpService.post('auth/logout')
}

function getEmptyCredentials() {
    return {
      fullname: '',
      username: '',
      password: ''
    }
  }

function _createRandomUsers() {
    return utilService.getRandomNames().map(name => {
        return _createRandomUser(name)
    })
}

function _createRandomUser(name) {
    return {
        _id: utilService.makeId(),
        fullname: name,
        imgUrl: 'https://a0.muscache.com/im/pictures/fab79f25-2e10-4f0f-9711-663cb69dc7d8.jpg?aki_policy=profile_small'
    }
}

; (() => {
    let users = utilService.loadFromStorage(USER_KEY) || []
    if (!users.length) {
        users = gUser
        utilService.saveToStorage(USER_KEY, users)
    }
    // console.log(users)
})()
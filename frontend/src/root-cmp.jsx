import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router'
import { useSelector } from 'react-redux'
import { setIsFilterShown } from './store/header.actions'
import {UserMsg} from './cmps/user-msg'
import routes from './routes'
import { eventBus, showSuccessMsg } from "./services/event-bus.service.js"

import { AppHeader } from './cmps/app-header'
import { AppFooter } from './cmps/app-footer'
import { UserDetails } from './pages/user-details'
import { socketService } from './services/socket.service'

export function RootCmp() {
    const { isFilterShown } = useSelector(state => state.headerModule)
    function handleMainContentClick() {
        setIsFilterShown(false)
    }

    useEffect(()=>{
        socketService.on('get-new-order', () => {
            // alert('Got new order')
            showSuccessMsg('You got a new order!')
          })
      
          socketService.on('order-status-change', () => {
            // alert('Order Approved!')
            showSuccessMsg('Your order was approved')
          }) 
    },[])

    return (
        <React.Fragment>
            <UserMsg/>
            <div className={`header-background-screen ${isFilterShown ? '' : 'hidden'}`} ></div>
            <div className='main-layout main' >
                <AppHeader />
                <main className="main-content" >
                    <div className={`gray-screen ${isFilterShown ? '' : 'hidden'}`}></div>
                    <div className={`white-screen ${isFilterShown ? '' : 'hidden'}`} onClick={handleMainContentClick}></div>
                    <Routes>
                        {routes.map(route => <Route key={route.path} exact={true} element={route.component} path={route.path} />)}
                        <Route path="user/:id" element={<UserDetails />} />
                    </Routes>
                </main>
                {/* <AppFooter /> */}
            </div>
        </React.Fragment>
    )
}



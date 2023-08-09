import React, { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { UserRentals } from "./user-rentals.jsx"
import { stayService } from "../services/stay.service.js"

export function Dashboard(){
    const user = useSelector((storeState) => storeState.userModule.user)
   const [userStays, setUserStays] = useState([])
   const filterOrdersByHostId = { host: user._id}

   useEffect(() => {
    (async () => {
      try {
        const userStays = await stayService.query(filterOrdersByHostId)
        setUserStays(userStays)
        console.log('userStays', userStays)
      } catch (err) {
        console.log('Cannot load stays', err)
      }
    })()
  }, [])
    // async function loadStays(filterOrdersByHostId) {
    //     try {
    //         const userStays = await stayService.query(filterOrdersByHostId)
    //     }
    //     catch (err) {
    //         console.log('Cannot load stays', err)
            
    //     }
    // }


    return(
        <section className="dashboard">
            <div className="dashboard-nav"></div>
            <div className="dashboard-content">
                <UserRentals userStays={userStays}/>
            </div>

        </section>
    )
}
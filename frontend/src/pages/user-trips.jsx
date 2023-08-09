import { orderService } from '../services/order.service.js'
import { stayService } from '../services/stay.service.js';
import { userService } from '../services/user.service.js';
import React, { useEffect, useRef, useState, useMemo } from "react"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns';import loader from '../assets/img/loader.gif'


import { loadStays } from '../store/stay.actions.js'
import { loadUsers } from '../store/user.actions.js';


export function UserTrips() {
    const user = useSelector((storeState) => storeState.userModule.user)
    const [orders, setOrders] = useState([])
    const { stays } = useSelector(storeState => storeState.stayModule)
    const { users } = useSelector(storeState => storeState.userModule)

    const navigate = useNavigate();


    useEffect(() => {
        loadOrders()
        loadUsers()
        loadStays()

    }, [])

    console.log('orders',orders)
    // console.log(stays)
    // console.log(users)

    async function loadOrders() {
        try {

            const orders = await orderService.query()
            setOrders(orders)
        }
        catch (err) {
            console.log('Cannot load orders', err)
            throw err
        }
    }

    function onStayClick(order) {
        navigate(`/stay/${order.stayId}`)
    }
    function formatDate(date) {
        let dateObj = date
        let formatString = 'dd/MM/yyyy'
        if (typeof date === 'number')
            dateObj = new Date(date)
        else
            if (date instanceof Date || typeof date === 'string')
                dateObj = parseISO(date)
            else
                return 'Invalid date'

        return format(dateObj, formatString)
    }

console.log(orders,users,stays)
    if (orders.length===0 || users.length===0 || stays.length===0 ) return <img className="loader" src={loader} />

    if (orders.length > 0 && stays.length > 0 && users.length > 0) return (
        <div>

            <div>
                <h1>My trips</h1>

                <table className='usertrips-table'>
                    <thead>

                        <tr>
                            <th className='destinations'>Destinations</th>
                            <th>Host</th>
                            <th>Check-in</th>
                            <th>Checkout</th>
                            <th>Total Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>

                        {orders && orders.map(order =>

                            order.buyerId === user._id &&

                            <tr key={order._id}>
                                <td>
                                    <div className='usertrip-preview' onClick={() => onStayClick(order)}>
                                        <img src={stays.find(stay => stay._id === order.stayId).imgUrls[0]} alt="n" />
                                        <div>
                                            {stays.find(stay => stay._id === order.stayId).name}
                                        </div>
                                    </div>
                                </td>
                                <td>{users.find(user => user._id === order.hostId).fullname}</td>
                                <td>{formatDate(order.info.checkin).substring(0, 10)}</td>
                                <td>{formatDate(order.info.checkin).substring(0, 10)}</td>
                                <td>{order.info.price}</td>
                                <td className={`${order.isAproved ? 'approved-green' : 'pending-yellow'}`}>{order.isAproved ? 'Approved' : 'Pending'}</td>
                            </tr>

                        )}
                    </tbody>

                </table>

            </div>

        </div>


    )
}
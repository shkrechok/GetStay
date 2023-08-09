import { orderService } from '../services/order.service.js'
import React, { useEffect, useState, useRef } from "react"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { format, parseISO, set } from 'date-fns';
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import loader from '../assets/img/loader.gif';
import { Chart } from 'chart.js/auto'
import { Pie } from 'react-chartjs-2';
import randomColor from 'randomcolor';



export function UserRentals({ userStays }) {
    const user = useSelector((storeState) => storeState.userModule.user)
    const [orders, setOrders] = useState([])
    const [statusChanged, setStatusChanged] = useState(false)
    const filterOrdersByHostId = { host: user._id }
    const [pieChartData, setPieChartData] = useState({})
    const pieChartOptions = {
        responsive: true,
        aspectRatio: 1,
        layout: {

            padding: {
                top: 0,
                bottom: 0,
                left: -25, // Adjust the left padding as needed
                right: 0,
            },
        },
        plugins: {
            legend: {
                fullsize: true,
                position: 'left',
                labels: {
                    boxWidth: 20,
                    padding: 20,
                    font: {
                        family: 'roboto-regular',
                        size: 14,
                    },

                },

            },
        },
    }
    const userStaysNames = userStays.map(stay => {
        const [firstWord, secondWord] = stay.name.split(' ')
        return `${firstWord} ${secondWord}`
    })

    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const loadedOrders = await loadOrders(filterOrdersByHostId)

                const updatedOrders = loadedOrders.map((order) => {
                    const stay = userStays.find(stay => stay._id === order.stayId)
                    let updatedOrder = { ...order }

                    if (order.createdAt !== 0) {
                        updatedOrder.bookedAt = order.createdAt;
                    } else if (order.createrAt !== 0) {
                        updatedOrder.bookedAt = order.createrAt;
                    }

                    if (stay) {
                        updatedOrder = { ...updatedOrder, stayName: stay.name }
                    }
                    return updatedOrder
                })
                updatedOrders.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt))
                setOrders(updatedOrders)
                const bookings = updatedOrders.reduce((acc, order) => {
                    const stayId = order.stayId;
                    acc[stayId] = (acc[stayId] || 0) + 1;
                    return acc;
                }, {})

                // console.log('bookings', bookings)
                const chartData = {
                    labels: [...userStaysNames, 'Summer loft', 'Winter cabin'],
                    datasets: [
                        {
                            label: 'Listings reservations analysis',
                            data: [...Object.values(bookings), 5, 1],
                            backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
                            hoverOffset: 4,
                        },
                    ],
                }

                setPieChartData(chartData)
            } catch (error) {
                console.error('Error occurred while fetching data:', error)
            }
        }

        fetchData()

    }, [userStays, statusChanged])



    async function loadOrders(filterOrdersByHostId) {
        try {
            const orders = await orderService.query(filterOrdersByHostId)
            return orders
        }
        catch (err) {
            console.log('Cannot load orders', err)
            throw err
        }
    }


    function onAprove(order) {
        if (order.status !== 'Pending') return
        const updatedOrder = { ...order, isAproved: true, status: 'Approved' }
        delete updatedOrder.guest
        delete updatedOrder.stayName
        delete updatedOrder.bookedAt
        setStatusChanged(!statusChanged)
        orderService.update(updatedOrder)
    }

    function onReject(order) {
        if (order.status !== 'Pending') return
        const updatedOrder = { ...order, isAproved: false, status: 'Rejected' }
        delete updatedOrder.guest
        delete updatedOrder.stayName
        delete updatedOrder.bookedAt
        setStatusChanged(!statusChanged)
        orderService.update(updatedOrder)
    }

    function checkAndDisplayOrderStatus(order) {
        let status = order.status
        if (order.checkout < Date.now()) {
            const updatedOrder = { ...order, status: 'Completed' }
            delete updatedOrder.guest
            delete updatedOrder.stayName
            orderService.update(updatedOrder)
            return 'Completed'
        }
        if (!status) {
            const updatedOrder = { ...order, status: 'Pending' }
            delete updatedOrder.guest
            delete updatedOrder.stayName
            orderService.update(updatedOrder)
            return 'Pending'
        }
        return (status)
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

    function getGuestsDisplayStr(order) {
        const guestString = ((order.info.guests.adults + order.info.guests.children) > 1) ? 'guests' : 'guest'
        const petString = (order.info.guests.pets > 1) ? 'pets' : 'pet'
        const infantString = (order.info.guests.infants > 1) ? 'infants' : 'infant'
        const infantsDisplay = (order.info.guests.infants > 0) ? ` , ${order.info.guests.infants} ${infantString}` : ''
        const petDisplay = (order.info.guests.pets > 0) ? ` , ${order.info.guests.pets} ${petString}` : ''
        return ((order.info.guests.adults + order.info.guests.children) ? `${order.info.guests.adults + order.info.guests.children} ${guestString}${infantsDisplay}${petDisplay}` : 'No guests')

    }

    // const backgroundColor = randomColor({ count: userStays.length })

    if (!orders || !orders.length) return <img className="loader" src={loader} />


    if (orders.length > 0) return (

        <section className="user-rentals">
            <div className="charts">
                <div className="chart-container pie">
                    <h2 className="title">Listings reservations analysis</h2>
                    <div className="pie-wrapper">
                        <Pie data={pieChartData} options={pieChartOptions} style={{ maxWidth: "385px", maxHeight: "200px" }} className="chart pie" />
                    </div>
                </div>
                <div className="chart-container datacard">
                    <h2 className="title">Reservations status pad</h2>
                    <div className="item Bookings">
                        <h3 className="label">Reservations total</h3>
                        <h3 className="number">{orders.length}</h3>
                    </div>
                    <div className="item Approved">
                        <h3 className="label">Approved</h3>
                        <h3 className="number">{orders.filter(order => order.status === 'Approved').length}</h3>
                    </div>
                    <div className="item Rejected">
                        <h3 className="label">Rejected</h3>
                        <h3 className="number">{orders.filter(order => order.status === 'Rejected').length}</h3>
                    </div>
                    <div className="item Pending">
                        <h3 className="label">Pending</h3>
                        <h3 className="number">{orders.filter(order => order.status === 'Pending').length}</h3>
                    </div>
                    <div className="item Completed">
                        <h3 className="label">Completed</h3>
                        <h3 className="number">{orders.filter(order => order.status === 'Completed').length}</h3>
                    </div>

                </div>
            </div>
            <div className="rentals list normal">
                <h2 className="rentals-title">{`${orders.length} reservations`}</h2>
                <TableContainer component={Paper} className="rentals-table">
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Guest</TableCell>
                                <TableCell align="center">Stay</TableCell>
                                <TableCell align="center">Check in</TableCell>
                                <TableCell align="center">Check out</TableCell>
                                <TableCell align="center">Booked</TableCell>
                                <TableCell align="center">Guests</TableCell>
                                <TableCell align="center">Price</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow
                                    key={order._id}
                                // sx={{ '&:td, &:th': { border: 0 } }}
                                >
                                    <TableCell align="center">
                                        <img src={order.guest.imgUrl} alt="guest-img" />
                                        <span>{order.guest.fullname}</span>
                                    </TableCell>
                                    <TableCell align="center">{order.stayName}</TableCell>
                                    <TableCell align="center">{formatDate(order.info.checkin)}</TableCell>
                                    <TableCell align="center">{formatDate(order.info.checkout)}</TableCell>
                                    <TableCell align="center">{order.createrAt ? formatDate(order.createrAt) : formatDate(order.createdAt)}</TableCell>
                                    <TableCell align="center">{order.info.guests.adults + order.info.guests.children}</TableCell>
                                    <TableCell align="center">{order.info.price}</TableCell>
                                    <TableCell align="center" className={checkAndDisplayOrderStatus(order)}>{checkAndDisplayOrderStatus(order)}</TableCell>
                                    <TableCell align="center">
                                        <div className="actions-container">
                                            <button variant="contained" className={`actions btn-approve ${order.status !== 'Pending' ? 'hidden' : ''}`} onClick={() => onAprove(order)}>Approve</button>
                                            <button variant="contained" className={`actions btn-reject ${order.status !== 'Pending' ? 'hidden' : ''} `} onClick={() => onReject(order)}>Reject</button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className="rentals cards medium">
                <h2 className="rentals-title">{`Reservations`}</h2>
                <div className="cards-container">
                    {orders.map((order) => (
                        <div className="rental-card" key={order._id}>
                            <div className="card-header">
                                <span className="stay-name">{order.stayName}</span>
                            </div>
                            <div className="card-body">
                                <div className="guest">
                                    <img className="guest-img" src={order.guest.imgUrl} alt="guest-img" />
                                    <div className="guest-info">
                                        <span className="guest-name">{order.guest.fullname}</span>
                                        <span className="booked-at">{order.createrAt ? formatDate(order.createrAt) : formatDate(order.createdAt)}</span>
                                    </div>
                                </div>


                                <span className="guests">Guests: {getGuestsDisplayStr(order)}</span>

                                <div className="dates">
                                    <div className="checkin">
                                        <span className="title">Check in:</span>
                                        <span className="date">{formatDate(order.info.checkin)}</span>
                                    </div>
                                    <div className="checkout">
                                        <span className="title">Check out:</span>
                                        <span className="date">{formatDate(order.info.checkout)}</span>
                                    </div>
                                    {/* <div className="guests">
                                        <span>Guests:</span>
                                        <span>{order.info.guests.adults + order.info.guests.children}</span>
                                    </div> */}
                                </div>
                                <div className="price-status">

                                    <span className="price">${order.info.price}</span>
                                    <span className={`status ${checkAndDisplayOrderStatus(order)}`}>{checkAndDisplayOrderStatus(order)}</span>
                                </div>
                                <div className="actions-container">
                                    <button variant="contained" className={`actions btn-approve ${order.status !== 'Pending' ? 'inactive' : ''}`} onClick={() => onAprove(order)}>Approve</button>
                                    <button variant="contained" className={`actions btn-reject ${order.status !== 'Pending' ? 'inactive' : ''} `} onClick={() => onReject(order)}>Reject</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

    )
    else return <div>You have no rentals yet</div>


}


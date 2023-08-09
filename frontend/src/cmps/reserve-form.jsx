import { useSearchParams } from "react-router-dom"
import { useNavigate } from 'react-router-dom'
import { DateRangePicker } from 'react-date-range'
import React, { useEffect, useRef, useState } from "react"
import { useSelector } from 'react-redux'

import "react-datepicker/dist/react-datepicker.css"
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { set } from "date-fns"
import { orderService } from '../services/order.service'
import { utilService } from '../services/util.service'
import { addDays } from 'date-fns';
import { is } from "immutable"
// import {filterBy} from '../store/stay.reducer'

export function ReserveForm({ stay }) {
    const filterBy = useSelector(state => state.stayModule.filterBy)
    const [isDatesModalOpen, setIsDatesModalOpen] = useState(false)
    const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false)
    const [order, setOrder] = useState({})
    const [guests, setGuests] = useState(
      filterBy.guests 
    //   {
    //     adults: 0,
    //     children: 0,
    //     infants: 0,
    //     pets: 0

    // }
    )
    const [dates, setDate] = useState([
        {
            startDate:filterBy.checkIn|| addDays(new Date(), 30),
            endDate:filterBy.checkOut|| addDays(new Date(), 37),
            key: 'selection'
        }
    ])

    console.log('guests', guests)

    const user = useSelector(storeState => storeState.userModule.user)
    // const [orderInfo, setOrderInfo] = useState({})
    console.log(filterBy)

    // useEffect(() => {
    //     getOrder()
    // }, [dates])

    useEffect(() => {
        getOrder()
    }, [dates, guests])

    // useEffect(()=>{
    //     calcForNewDates()

    // },[dates])

    // function calcForNewDates(){
    //    const newOrder={...order,order.info.checkin}
    // }
    // console.log(filterBy)

    let [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate();

    async function getOrder() {
        const newOrder = orderService.getEmptyOrder()
        newOrder.hostId = stay.host._id
        newOrder.stayId = stay._id
        newOrder.info.checkin = dates[0].startDate
        newOrder.info.checkout = dates[0].endDate ? dates[0].endDate : addDays(dates[0].startDate, 1)
        newOrder._id = utilService.makeId()
        newOrder.info.price = getTotalPrice(newOrder.info.checkin, newOrder.info.checkout)
        // newOrder.buyerId = (user === null) ? '' : user._id
        newOrder.info.guests = guests
        console.log(newOrder)
        setOrder(newOrder)

    }
    async function onRequestBook(ev) {
        ev.preventDefault()
        console.log(ev.target)
        console.log(order)
        const params = new URLSearchParams({ order: JSON.stringify(order) })
        navigate(`/order?${params}`)
    }



    function getTotalPrice(checkIn, checkOut) {
        const numberOfNights = (order.info) ? calcInOut(checkIn, checkOut) : 7
        return (stay.price * numberOfNights + 555)
    }
    function calcInOut(checkIn, checkOut) {
        return (checkOut - checkIn) / (1000 * 60 * 60 * 24)
    }

    // function handleChange({ target }) {
    //     let { value, name: field } = target
    //     setOrder(prevInfo => (
    //         { ...prevInfo, info: { ...prevInfo.info, [field]: value } }))
    //     console.log(order)
    // }
    function getGuests() {
        let str = `${order.info.guests.adults+order.info.guests.children} guests`
        if(order.info.guests.adults+order.info.guests.children===1) str='1 guest'
        if (order.info.guests.infants===1) str+=`, 1 infant`
        if (order.info.guests.infants>1) str+=`, ${order.info.guests.infants} infants`
        if (order.info.guests.pets===1) str+=`, 1 pet `
        if (order.info.guests.pets>1) str+=`, ${order.info.guests.pets} pets `
        console.log(str)
        return str
    }
    function onGuestsChange(ev, diff) {
        const target = ev.target
        const name = target.getAttribute("name")
        const value = +order.guests[name] + diff
        if (value < 0) return
        // console.log('target', target, 'name', name, 'value', value)
        // handleGuestsChange({ target: { name: name, value: value } })
    }
    function onGuestsChange(ev, diff) {
        const target = ev.target
        console.log(target)
        const name = target.getAttribute("name")
        const value = +order.info.guests[name] + diff
        console.log(value)
        if (value < 0) return
        setGuests(prevInfo => (
            { ...prevInfo, [name]: value }))
        // console.log('target', target, 'name', name, 'value', value)
        //handleGuestsChange({ target: { name: name, value: value } })
    }
    console.log(guests)
    // console.log(order)
    if (!order.info) return 'loading'
    if (!order.info.guests) return 'loading'
    return (

        <form onSubmit={onRequestBook}>

            <div className="reserve-form">
                <div className="reserve-form-details">
                    <div ><span className="price">${stay.price}</span> night </div>
                    <div><h6> <i className="fa-sharp fa-solid fa-star"></i> <span>{stay.rating}</span>  · <span className="reviews"> {stay.reviews.length}  reviews </span>
                    </h6></div>
                </div>
                <div className="reserve-form-checkin">
                    {isDatesModalOpen && <section className="dates-picker-modal">
                        <DateRangePicker
                            onChange={item => setDate([item.selection])}
                            showSelectionPreview={false}
                            moveRangeOnFirstSelection={false}
                            months={2}
                            ranges={dates}
                            direction="horizontal"
                            className="date-range-picker"
                            weekdayDisplayFormat={'EEEEEE'}
                            // startDatePlaceholder="Check In"
                            // endDatePlaceholder="Check Out"
                            // direction="horizontal"
                            minDate={new Date()}
                            rangeColors={['#f5f5f5']}
                            // staticRanges={[]}
                            // inputRanges={[]}
                            editableDateInputs={true}
                        />
                        <button className="close-dates-modal" onClick={() => setIsDatesModalOpen(false)}>Close</button>
                    </section>}

                    {isGuestsModalOpen && <section className="guests-picker-modal-main">
                        {(
                            <section id="guests" name="guests" className="guests-picker-modal">
                                <section className="reserve-adults-container">

                                    <div className='who-container'>
                                        <h4>
                                            Adults
                                        </h4>
                                        <h5>Ages 13+</h5>
                                    </div>
                                    <section className="reserve-adults-count-container">
                                        {/* () => handleGuestsChange({ target: {  order.guests + 1 } }) */}

                                        <span className={`minus-adult ${+order.info.guests.adults === 0 ? 'inactive' : ''}`} name="adults" onClick={(ev) => onGuestsChange(ev, -1)}>-</span>

                                        <span className="adults">{order.info.guests.adults}</span>
                                        <span className="plus-adult" name="adults" onClick={(ev) => onGuestsChange(ev, 1)}>+</span>
                                    </section>
                                </section>

                                <section className="reserve-adults-container">

                                    <div className='who-container'>
                                        <h4>
                                            Children
                                        </h4>
                                        <h5>Ages 2-12</h5>
                                    </div>
                                    <section className="reserve-adults-count-container">
                                        {/* () => handleGuestsChange({ target: {  order.guests + 1 } }) */}

                                        <span className={`minus-adult ${+order.info.guests.children === 0 ? 'inactive' : ''}`} name="children" onClick={(ev) => onGuestsChange(ev, -1)}>-</span>

                                        <span className="adults">{order.info.guests.children}</span>
                                        <span className="plus-adult" name="children" onClick={(ev) => onGuestsChange(ev, 1)}>+</span>
                                    </section>
                                </section>



                                {/* <section className="children-container">
                                    <label htmlFor="children">Children</label>
                                    <section className="children-count-container">
                                        {+order.info.guests.children > 0 &&
                                            <span className="minus-children" name="children" onClick={(ev) => onGuestsChange(ev, -1)}>-</span>
                                        }
                                        <span className="children">{+order.info.guests.children}</span>
                                        <span className="plus-children" name="children" onClick={(ev) => onGuestsChange(ev, 1)}>+</span>
                                    </section>
                                </section> */}

                                {/* <section className="infants-container">
                                    <label htmlFor="infants">Infants</label>
                                    <section className="infants-count-container">
                                        {+order.info.guests.infants > 0 &&
                                            <span className="minus-infants" name="infants" onClick={(ev) => onGuestsChange(ev, -1)}>-</span>
                                        }
                                        <span className="infants">{+order.info.guests.infants}</span>
                                        <span className="plus-infants" name="infants" onClick={(ev) => onGuestsChange(ev, 1)}>+</span>
                                    </section>
                                </section> */}

                                <section className="reserve-adults-container">

                                    <div className='who-container'>
                                        <h4>
                                            Infants
                                        </h4>
                                        <h5>Under 2</h5>
                                    </div>
                                    <section className="reserve-adults-count-container">
                                        {/* () => handleGuestsChange({ target: {  order.guests + 1 } }) */}

                                        <span className={`minus-adult ${+order.info.guests.infants === 0 ? 'inactive' : ''}`} name="infants" onClick={(ev) => onGuestsChange(ev, -1)}>-</span>

                                        <span className="adults">{order.info.guests.infants}</span>
                                        <span className="plus-adult" name="infants" onClick={(ev) => onGuestsChange(ev, 1)}>+</span>
                                    </section>
                                </section>

                                {/* <section className="pets-container">
                                    <label htmlFor="pets">Pets</label>
                                    <section className="pets-count-container">
                                        {order.info.guests.pets > 0 &&
                                            <span className="minus-pets" name="pets" onClick={(ev) => onGuestsChange(ev, -1)}>-</span>
                                        }
                                        <span className="pets">{+order.info.guests.pets}</span>
                                        <span className="plus-pets" name="pets" onClick={(ev) => onGuestsChange(ev, 1)}>+</span>
                                    </section>
                                </section> */}

                                <section className="reserve-adults-container">

                                    <div className='who-container'>
                                        <h4>
                                            Pets
                                        </h4>
                                        <h5>With animal service</h5>
                                    </div>
                                    <section className="reserve-adults-count-container">
                                        {/* () => handleGuestsChange({ target: {  order.guests + 1 } }) */}

                                        <span className={`minus-adult ${+order.info.guests.pets === 0 ? 'inactive' : ''}`} name="pets" onClick={(ev) => onGuestsChange(ev, -1)}>-</span>

                                        <span className="adults">{order.info.guests.pets}</span>
                                        <span className="plus-adult" name="pets" onClick={(ev) => onGuestsChange(ev, 1)}>+</span>
                                    </section>
                                </section>

                                <button className="close-dates-modal" onClick={() => setIsGuestsModalOpen(false)}>Close</button>
                            </section>
                        )}
                    </section>}



                    <div className="checkin" onClick={() => setIsDatesModalOpen(true)}>
                        <span>CHECK-IN</span>
                        <span className="in-form">{utilService.getDate(order.info.checkin) || 'Add date'}</span>
                    </div>
                    <div className="checkout" onClick={() => setIsDatesModalOpen(true)}>
                        <span>CHECKOUT</span>
                        <span className="in-form">{utilService.getDate(order.info.checkout) || 'Add date'}</span>
                    </div>

                    <div className="guests-form" onClick={() => setIsGuestsModalOpen(true)}>
                        <label htmlFor="">GUESTS</label>
                        {/* <span>Guests</span> */}
                        <input className="in-form"
                            name="guests"
                            id="guests"
                            value={getGuests()}
                        />

                    </div>
                </div>
                <button className="reserve-btn" >Reserve</button>
                <p>You won't be charged yet</p>
                <div className="pay-for-nights"><span>${stay.price} x {orderService.getNights(order)} nights</span>${stay.price * orderService.getNights(order)}</div>
                <div className="fees"> <span>Airbnb service fee</span> $555</div>
                <hr className="h-line" />
                <div className="total"><span>Total</span> ${order.info.price}</div>
            </div>

        </form>

    )
}




{/*<label htmlFor="">CHECK-IN</label>
                        {/* {console.log(order)} 
                        <input
                            type="date"
                            placeholder="Add date"
                            name="date"
                            id="date"
                            // value={utilService.getDate(order.info.checkin)}
                            value={dates.startDate}
                            // onChange={handleChange}
                        />
                    
                    <div className="checkout">
                        <label htmlFor="">CHECKOUT</label>
                        <input
                            type="date"
                            placeholder="Add date"
                            name="dateout"
                            id="dateout"
                            // value={utilService.getDate(order.info.checkout)}
                            value={dates.endDate}
                            // onChange={handleChange}
                        />
                    </div> */}
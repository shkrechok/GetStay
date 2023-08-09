import React, { useEffect, useRef, useState } from "react"
import { useSelector } from 'react-redux'
import HeaderFilterModal from "./header-filter-modal"
import { utilService } from "../services/util.service"
import { setIsFilterShown } from "../store/header.actions"
import { loadPlaces } from "../store/stay.actions"


export function HeaderFilter({ onSetFilter, filterBy, headerScales, onSetHeaderScales, isFilterModalOpen, setIsFilterModalOpen }) {
    const { isFilterShown } = useSelector(state => state.headerModule)
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const [selectedMenu, setSelectedMenu] = useState('where')
    const { guests } = utilService.countGuests(filterByToEdit.guests)
    const { infants } = utilService.countGuests(filterByToEdit.guests)
    const { pets } = utilService.countGuests(filterByToEdit.guests)
    const { places } = useSelector(state => state.stayModule)
    let formatedDateRange = ''
    // const elInputRef = useRef(null)

    useEffect(() => {
        setFilterByToEdit({ ...filterBy })
        if (isFilterShown) {
            onSetHeaderScales({ ...headerScales, height: 'high' })
        } else {
            onSetHeaderScales({ ...headerScales, height: 'low' })
        }
        loadPlaces('')
        // console.log('filterby places', places)
    }, [isFilterShown, filterBy])

    function handleMenuChange(menuSelection, ev) {
        ev.preventDefault()
        ev.stopPropagation()
        if (!isFilterShown) setIsFilterShown(true)
        setIsFilterModalOpen(true)
        setSelectedMenu(menuSelection)
    }

    function handleIsFilterShown(isShown) {
        setIsFilterShown(isShown)
    }

    function handleChange({ target }) {
        let { value, name: field, type } = target
        value = (type === 'number') ? +value : value
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
        loadPlaces(value)

    }

    function handleDateChange(checkIn = null, checkOut = null) {
        // const field = (isCheckIn) ? 'checkIn' : 'checkOut'
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, checkIn, checkOut }))
    }


    function handleGuestsChange({ target }) {
        let { value, name: field } = target
        value = +value || 0
        if ((field === 'infants' || field === 'pets') && value > 0 && !filterByToEdit.guests.adults) {
            setFilterByToEdit((prevFilter) => ({ ...prevFilter, guests: { ...prevFilter.guests, adults: 1 } }))
        }
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, guests: { ...prevFilter.guests, [field]: value } }))

    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        const filter = filterByToEdit
        onSetFilter(filter)
        setIsFilterShown(false)
        // console.log('filterByToEdit, filterBy', filterByToEdit, filterBy)
    }

    function onClearField(field, ev) {
        ev.preventDefault()
        ev.stopPropagation()
        if (typeof filterByToEdit[field] === 'object' && !(filterByToEdit[field] instanceof Date)) {
            setFilterByToEdit((prevFilter) => {
                const updatedField = { ...prevFilter[field] }
                for (const key in updatedField) {
                    updatedField[key] = ''
                }
                return { ...prevFilter, [field]: updatedField }
            })
        } else {
            setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: null }))
        }
    }

    const guestString = (guests > 1) ? 'guests' : 'guest'
    const petString = (pets > 1) ? 'pets' : 'pet'
    const infantString = (infants > 1) ? 'infants' : 'infant'
    const infantsDisplay = (infants > 0) ? ` , ${infants} ${infantString}` : ''
    const petDisplay = (pets > 0) ? ` , ${pets} ${petString}` : ''
    const btnWhereStr = headerScales.width === 'wide' ? 'Anywhere' : 'Start your search'

    if (filterByToEdit.checkIn && filterByToEdit.checkOut) {
        formatedDateRange = utilService.formatDateRange(filterByToEdit.checkIn, filterByToEdit.checkOut)
    }
    // console.log(filterByToEdit.checkIn? filterByToEdit.checkIn.toString().substring(4,9) : '')

    // const searchIconName = 'search'
    return <section className="header-filter" >
        <section className={`filter-selection-btns ${isFilterShown ? 'hidden' : ''}`}>
            <button className="btn-where" onClick={(ev) => handleMenuChange('where', ev)}>{filterBy.where || btnWhereStr}</button>
            <span className={btnWhereStr === 'Anywhere' ? 'splitter' : ''}></span>
            <button className="btn-when" onClick={(ev) => handleMenuChange('checkIn', ev)}>{formatedDateRange ? formatedDateRange : 'Any week'}</button>
            <span className={btnWhereStr === 'Anywhere' ? 'splitter' : ''}></span>
            <button className="btn-guests" onClick={(ev) => handleMenuChange('guests', ev)}>{guests > 0 ? `${guests} ${guestString}` : 'Add guests'}</button>
            <button className="btn-search" onClick={(ev) => onSubmitFilter(ev)}>
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" >
                    <path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9" />
                </svg>
                {/* <img src={require(`../assets/img/svg/${searchIconName}.svg`)} alt="search" /> */}
            </button>
        </section>
        <section className={`filter-menu ${isFilterShown ? '' : 'hidden'} `}>
            <form onSubmit={(ev) => onSubmitFilter(ev)} >
                <section className={`filter-menu-selection-btns ${isFilterModalOpen ? 'gray' : 'white'}`}>
                    <div className={`btn-where ${(selectedMenu === 'where' && isFilterModalOpen) ? 'active' : ''}`} onClick={(ev) => handleMenuChange('where', ev)}>
                        <span>Where</span>
                        <input
                            type="text"
                            id="where"
                            name="where"
                            placeholder="Search..."
                            value={filterByToEdit.where || ''}
                            onChange={handleChange}
                        />
                        <button className={`btn-clear ${(filterByToEdit.where && isFilterModalOpen) ? 'shown' : 'hidden'}`} onClick={(ev) => onClearField('where', ev)}>
                            <img src={require('../assets/img/svg/x-symbol.svg').default} alt="" />
                        </button>
                    </div>
                    <span className={selectedMenu === 'checkIn' ? '' : 'splitter'}></span>
                    <div className={`btn-check-in ${(selectedMenu === 'checkIn' && isFilterModalOpen) ? 'active' : ''}`} onClick={(ev) => handleMenuChange('checkIn', ev)}>
                        <span>Check in</span>
                        <input type="text" id="checkIn" placeholder="Add dates" value={filterByToEdit.checkIn ? filterByToEdit.checkIn.toString().substring(4, 10) : '' || ''} readOnly />
                        <button className={`btn-clear ${(filterByToEdit.checkIn && isFilterModalOpen) ? 'shown' : 'hidden'}`} onClick={(ev) => onClearField('checkIn', ev)}>
                            <img src={require('../assets/img/svg/x-symbol.svg').default} alt="" />
                        </button>
                    </div>
                    <span className={selectedMenu === 'checkOut' ? '' : 'splitter'}></span>
                    <div className={`btn-check-out ${(selectedMenu === 'checkOut' && isFilterModalOpen) ? 'active' : ''}`} onClick={(ev) => handleMenuChange('checkOut', ev)}>
                        <span>Check out</span>
                        <input type="text" id="checkOut" placeholder="Add dates" value={filterByToEdit.checkOut ? filterByToEdit.checkOut.toString().substring(4, 10) : '' || ''} readOnly />
                        <button className={`btn-clear ${(filterByToEdit.checkOut && isFilterModalOpen) ? 'shown' : 'hidden'}`} onClick={(ev) => onClearField('checkOut', ev)}>
                            <img src={require('../assets/img/svg/x-symbol.svg').default} alt="" />
                        </button>
                    </div>
                    <span className={selectedMenu === 'guests' ? '' : 'splitter'}></span>
                    <div className={`guests ${(selectedMenu === 'guests' && isFilterModalOpen) ? 'active' : ''}`} onClick={(ev) => handleMenuChange('guests', ev)}>
                        <span>Who</span>
                        <input type="text" id="guests" placeholder="Add guests" value={guests > 0 ? `${guests} ${guestString} ${",", infantsDisplay} ${",", petDisplay}` : ''} readOnly />
                        <button className={`btn-clear ${(guests && isFilterModalOpen) ? 'shown' : 'hidden'}`} onClick={(ev) => onClearField('guests', ev)}>
                            <img src={require('../assets/img/svg/x-symbol.svg').default} alt="" />
                        </button>
                    </div>
                    <button className="btn-search" onClick={(ev) => onSubmitFilter(ev)}>
                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" >
                            <path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9" />
                        </svg>
                        <span>Search</span>

                    </button>
                </section>
                {isFilterModalOpen && (<HeaderFilterModal
                    filterByToEdit={filterByToEdit}
                    handleMenuChange={handleMenuChange}
                    handleDateChange={handleDateChange}
                    handleChange={handleChange}
                    handleGuestsChange={handleGuestsChange}
                    selectedMenu={selectedMenu}
                    setSelectedMenu={setSelectedMenu}
                    places={places}
                />)}
            </form>
        </section>
    </section>

}


{/* <h2>Stays Filter</h2>
        <form onSubmit={onSubmitFilter}>
        <label htmlFor="txt">Search by name</label>
            <input type="text"
                id="txt"
                name="txt"
                placeholder="Search..."
                value={filterByToEdit.txt}
                onChange={handleChange}
                ref={elInputRef}
            />

            <label htmlFor="maxPrice">Max price:</label>
            <input type="number"
                id="maxPrice"
                name="maxPrice"
                placeholder="By max price"
                value={filterByToEdit.maxPrice}
                onChange={handleChange}
            />

            <button>Search</button>
        </form> */}

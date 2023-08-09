
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { StayPreview } from "../cmps/stay-preview.jsx"
import { useEffect } from 'react'

import { loadStays } from '../store/stay.actions.js'



export function Wishlist() {
    const { stays, filterBy } = useSelector(storeState => storeState.stayModule)
    const user = useSelector((storeState) => storeState.userModule.user)
    const navigate = useNavigate();

    useEffect(() => {
        loadStays(filterBy)
    }, [filterBy])

    function onStayClick(stay) {
        navigate(`/stay/${stay._id}`)
    }

    console.log(stays)

    return (
        <main>
            <ul className="stay-list">
                {stays.slice(0,350).map(stay =>

                    stay.likedByUsers.find(likedbyid => likedbyid === user._id) &&

                    <li className="stay-preview" key={stay._id}>
                        <StayPreview stay={stay} onStayClick={() => onStayClick(stay)} />
                    </li>)
                }

            </ul>
        </main>
    )
}


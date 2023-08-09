import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { stayService } from "../services/stay.service.js"
import { Reviews } from "../cmps/reviews.jsx"
import { StayAmenities } from "../cmps/stay-amenities.jsx"
import { StayMap } from "../cmps/stay-map.jsx"
import { ReserveForm } from "../cmps/reserve-form.jsx"
import { useSelector } from "react-redux"
import { setHeaderScales } from '../store/header.actions'
import { set } from "date-fns"
import loader from '../assets/img/loader.gif'


export function StayDetails() {
    const { stayId } = useParams()
    const [stay, setStay] = useState(null)
    const headerScales = useSelector(storeState => storeState.headerModule.scales)


    useEffect(() => {
        setHeaderScales({ ...headerScales, width: 'narrow' })
        loadStay()
    }, [stayId])


    async function loadStay() {
        try {
            const stay = await stayService.getById(stayId)

            setStay(stay)
        }
        catch (err) {
            console.log('Had issues in stay details', err)
            // showErrorMsg('Cannot load stay')
            // navigate('/stay')
        }
    }
    //     setStay(stay)
    // })
    // .catch((err) => {
    //     console.log('Had issues in stay details', err)
    //     showErrorMsg('Cannot load stay')
    //     navigate('/stay')
    // })

    function underConstruction() {
        alert('This button is under construction. We are sorry for the inconvenience. Please try again later')
    }
    // console.log(stay)
    if (!stay) return <img className="loader" src={loader} />
    return (
        <section className="main-layout-stayDetails">

            <section className="stay-details">
                <header className="details-header">
                    <h4>{stay.name}</h4>
                    <div className="flex space-between">
                        <h6> <i className="fa-sharp fa-solid fa-star"></i>{stay.rating} · <span>{stay.reviews.length} reviews </span> · Superhost · <span>{stay.loc.country},{stay.loc.city}</span>
                        </h6>
                        <div className="details-buttons">
                            <button onClick={underConstruction}><i className="fa-solid fa-arrow-up-from-bracket"> </i> <span>share </span></button>
                            <button onClick={underConstruction}><i className="fa-regular fa-heart"></i> <span>save</span> </button>
                        </div>
                    </div>
                </header>

                <div className="details-photo-gallery">
                    {stay.imgUrls.map(imgUrl => {
                        return <img src={imgUrl}></img>
                    })}

                </div>
                < div className="container">
                    <div className="host-details">
                        <h2>  {stay.roomType} hosted by {stay.host.fullname} </h2> <br />
                        <img className="host-details-img" src='https://a0.muscache.com/im/users/25700238/profile_pic/1420574174/original.jpg?aki_policy=profile_x_medium' />
                        <h6> {stay.capacity} Guests  · {stay.bedrooms} Bedrooms  · {stay.bathrooms} Bathrooms </h6>
                        <hr />
                        <br />
                        <div className="stay-important">

                            <div className="important-info">

                                {/* <img src='../../door-44-svgrepo-com.svg' alt="" /> */}

                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
                                    <path d="M 24.962891 1.0546875 A 1.0001 1.0001 0 0 0 24.384766 1.2636719 L 1.3847656 19.210938 A 1.0005659 1.0005659 0 0 0 2.6152344 20.789062 L 4 19.708984 L 4 46 A 1.0001 1.0001 0 0 0 5 47 L 18.832031 47 A 1.0001 1.0001 0 0 0 19.158203 47 L 30.832031 47 A 1.0001 1.0001 0 0 0 31.158203 47 L 45 47 A 1.0001 1.0001 0 0 0 46 46 L 46 19.708984 L 47.384766 20.789062 A 1.0005657 1.0005657 0 1 0 48.615234 19.210938 L 41 13.269531 L 41 6 L 35 6 L 35 8.5859375 L 25.615234 1.2636719 A 1.0001 1.0001 0 0 0 24.962891 1.0546875 z M 25 3.3222656 L 44 18.148438 L 44 45 L 32 45 L 32 26 L 18 26 L 18 45 L 6 45 L 6 18.148438 L 25 3.3222656 z M 37 8 L 39 8 L 39 11.708984 L 37 10.146484 L 37 8 z M 20 28 L 30 28 L 30 45 L 20 45 L 20 28 z"></path>
                                </svg>
                                {/* <svg className="first-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.326 18.266l-4.326-2.314-4.326 2.313.863-4.829-3.537-3.399 4.86-.671 2.14-4.415 2.14 4.415 4.86.671-3.537 3.4.863 4.829z" /></svg> */}
                                <div className="important-info-text">
                                    <h3>{stay.host.fullname} is SuperHost</h3>
                                    <p className="light">Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
                                </div>
                            </div>
                            <br />
                            <div className="important-info">

                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 50 50">
                                    <path d="M 34 0 C 25.179688 0 18 7.175781 18 16 C 18 17.960938 18.382813 19.824219 19.03125 21.5625 L 0.28125 40.28125 L 0 40.59375 L 0 47.40625 L 0.28125 47.71875 L 2.28125 49.71875 L 2.59375 50 L 9.40625 50 L 9.71875 49.71875 L 12.71875 46.71875 L 13 46.40625 L 13 44 L 15.40625 44 L 15.71875 43.71875 L 18.71875 40.71875 L 19 40.40625 L 19 39 L 20.40625 39 L 20.71875 38.71875 L 22.71875 36.71875 L 23 36.40625 L 23 35 L 24.40625 35 L 24.71875 34.71875 L 28.4375 30.96875 C 30.175781 31.617188 32.039063 32 34 32 C 42.820313 32 50 24.820313 50 16 C 50 7.175781 42.820313 0 34 0 Z M 34 2 C 41.738281 2 48 8.257813 48 16 C 48 23.738281 41.738281 30 34 30 C 32.078125 30 30.257813 29.636719 28.59375 28.9375 C 28.582031 28.925781 28.574219 28.917969 28.5625 28.90625 C 23.535156 26.78125 20 21.804688 20 16 C 20 8.257813 26.261719 2 34 2 Z M 34 5 C 31.183594 5 28.363281 6.074219 26.21875 8.21875 L 25.5 8.9375 L 26.21875 9.625 L 40.375 23.78125 L 41.0625 24.5 L 41.78125 23.78125 C 46.070313 19.496094 46.070313 12.503906 41.78125 8.21875 C 39.636719 6.074219 36.816406 5 34 5 Z M 34 7 C 36.300781 7 38.613281 7.863281 40.375 9.625 C 43.648438 12.898438 43.75 17.996094 40.9375 21.53125 L 28.46875 9.0625 C 30.101563 7.765625 32.023438 7 34 7 Z M 19.875 23.53125 C 21.371094 26.328125 23.671875 28.628906 26.46875 30.125 L 23.5625 33 L 21 33 L 21 35.5625 L 19.5625 37 L 17 37 L 17 39.5625 L 14.5625 42 L 11 42 L 11 45.5625 L 8.5625 48 L 3.4375 48 L 2.4375 47 L 19 30.4375 C 19.359375 30.128906 19.457031 29.613281 19.230469 29.199219 C 19.003906 28.78125 18.515625 28.582031 18.0625 28.71875 C 17.871094 28.761719 17.699219 28.859375 17.5625 29 L 2 44.59375 L 2 41.4375 Z"></path>
                                </svg>
                                <div className="important-info-text">
                                    <h3>Great check-in experience</h3>
                                    <p className="light" >100% of recent guests gave the check-in process a 5-star rating.</p>
                                </div>
                            </div>
                            <br />
                            <div className="important-info">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 50 50">
                                    <path d="M 0 4 L 0 46 L 50 46 L 50 4 Z M 2 6 L 48 6 L 48 44 L 2 44 Z M 4 8 L 4 30.78125 C 3.972656 30.914063 3.972656 31.054688 4 31.1875 L 4 42 L 46 42 L 46 37.15625 C 46.027344 37.023438 46.027344 36.882813 46 36.75 L 46 8 Z M 6 10 L 44 10 L 44 34.5625 L 34.71875 25.28125 C 34.496094 25.0625 34.183594 24.957031 33.875 25 C 33.652344 25.023438 33.441406 25.125 33.28125 25.28125 L 29.03125 29.53125 L 18.75 18.3125 C 18.519531 18.0625 18.179688 17.941406 17.84375 18 C 17.644531 18.027344 17.460938 18.117188 17.3125 18.25 L 6 28.6875 Z M 35 15 C 33.34375 15 32 16.34375 32 18 C 32 19.65625 33.34375 21 35 21 C 36.65625 21 38 19.65625 38 18 C 38 16.34375 36.65625 15 35 15 Z M 17.9375 20.4375 L 27.59375 30.96875 L 25.28125 33.28125 C 24.882813 33.679688 24.882813 34.320313 25.28125 34.71875 C 25.679688 35.117188 26.320313 35.117188 26.71875 34.71875 L 29.5625 31.84375 C 29.703125 31.757813 29.820313 31.640625 29.90625 31.5 L 34 27.4375 L 44 37.4375 L 44 40 L 6 40 L 6 31.46875 Z"></path>
                                </svg>
                                {/* <svg className="second-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" /></svg> */}
                                <div className="important-info-text">
                                    <h3>Great Location</h3>
                                    <p className="light">100% of recent guests gave the location a 5-star rating.</p>
                                </div>
                            </div>
                        </div>
                        <br />
                        <hr />
                        <br />
                        <p>
                            Unwind at this stunning beautifull stay. The house was lovingly built with stone floors, high-beamed ceilings, and antique details for a luxurious yet charming feel. Enjoy the sea and mountain views from the pool and lush garden. The house is located in the enclave of Llandudno Beach, a locals-only spot with unspoilt, fine white sand and curling surfing waves. Although shops and restaurants are only a five-minute drive away, the area feels peaceful and secluded.
                        </p>
                        <hr />
                        <br />
                        <StayAmenities stay={stay} />
                        {/* <hr /> */}
                        {/* <br /> */}
                    </div>
                    <ReserveForm stay={stay} />
                </div>
                <br />
                <hr />
                <br />
                <div className="reviews-rating">
                    <i className="fa-sharp fa-solid fa-star"></i>{stay.rating} · {stay.reviews.length} reviews
                </div>
                <br />
                <div className="details-reviews">
                    <Reviews stay={stay} />
                </div>
                <StayMap stay={stay} />
            </section >
        </section>
    )
}
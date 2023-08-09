import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { utilService } from "../services/util.service.js"
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { stayService } from "../services/stay.service.js";
import { useNavigate } from 'react-router-dom'

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
        // slidesToSlide: 7 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
        // slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        // slidesToSlide: 1 // optional, default to 1.
    }
};

const dates = ['Jul 1-8', 'Aug 3-10', 'Jul 28  - Aug 3', 'Jul 13-18', 'Jul 7-9', 'Jul 13-16']

export function StayPreview({ stay, onStayClick }) {

    const user = useSelector((storeState) => storeState.userModule.user)
    const [isLiked, setIsLiked] = useState(false)
    const navigate = useNavigate();


    async function onLikeClick(stay) {
        if (!user) navigate('/login')

        if (stay.likedByUsers.find(likedbyid => likedbyid === user._id)) {

            const index = stay.likedByUsers.indexOf(user._id);
            // console.log(index)
            stay.likedByUsers.splice(index, 1);
            // console.log('Not like!')
            console.log(stay)
            await stayService.save(stay)
            setIsLiked(!isLiked)
        } else {


            stay.likedByUsers.push(user._id)

            await stayService.save(stay)

            setIsLiked(!isLiked)
        }
        console.log(stay)
        console.log('liked by users:', stay.likedByUsers)
        console.log('hello')
    }
    return (

        <div className="stay-preview">
            <div className="stay-preview-like">
                {!user &&
                    <img src={require('../assets/img/svg/heart.svg').default} alt="" onClick={() => onLikeClick(stay)} />
                }
                {user &&
                    <img src={require('../assets/img/svg/heart.svg').default} alt="" onClick={() => onLikeClick(stay)} />

                }
                {user && stay.likedByUsers.find(likedbyid => likedbyid === user._id) &&
                    <img src={require('../assets/img/svg/heart filled.svg').default} alt="" onClick={() => onLikeClick(stay)} />

                }
            </div>
            <Carousel
                responsive={responsive}
                swipeable={true}
                draggable={false}
                showDots={true}
                infinite={false}
                minimumTouchDrag={10}
            >
                {/* {labels.map(label => (
                    <div className='label-container' key={label.title} onClick={() => onLabelChange(label.title)}>
                        <img src={label.url} alt={label.title} />
                        <p>{label.title}</p>
                    </div>
                ))} */}

                {stay.imgUrls.map(img => (
                    <div className="img-carousel-container" key={img}>
                        <img className="img-preview" src={img} alt="" onClick={onStayClick} />
                    </div>
                ))}
                {/* { <img className="img-preview" src={stay.imgUrls[0]} alt="" />} */}
            </Carousel>
            <div className="preview-info" onClick={onStayClick}>
                <div className="preview-info-first">
                    <p className="preview-address">{stay.loc.city}, {stay.loc.country}</p>
                    <p className="preview-name">{stay.type}</p>
                    <p className="preview-date">{stay.dates}</p>
                </div>
                <div className="preview-rating">
                    <i className="fa-sharp fa-solid fa-star"></i>
                    <div className="preview-rating-rating">{stay.rating}</div>
                </div>
                <p className="preview-price">${stay.price.toLocaleString()}<span> night</span></p>
            </div>
        </div >
    )
}

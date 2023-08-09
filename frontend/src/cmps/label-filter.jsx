import { useEffect, useState } from 'react'
// import { labelService } from '../services/label.service.js'
import { stayService } from '../services/stay.service.local.js'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
// import { is } from 'immutable';


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper";

// Import Swiper styles
import 'swiper/css';
import "swiper/css/navigation";

// const responsive = {
//     desktop: {
//         breakpoint: { max: 3000, min: 1024 },
//         items: 14,
//         slidesToSlide: 7 // optional, default to 1.
//     },
//     tablet: {
//         breakpoint: { max: 1024, min: 464 },
//         items: 6,
//         slidesToSlide: 2 // optional, default to 1.
//     },
//     mobile: {
//         breakpoint: { max: 464, min: 0 },
//         items: 1,
//         slidesToSlide: 1 // optional, default to 1.
//     }
// };


const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 10,
    slidesToScroll: 5
};



export function LabelFilter({ onLabelChange, isFilterShown }) {

    const [labels, setLabels] = useState([])


    useEffect(() => {
        const labels = stayService.getLabels()
        setLabels(labels)
        console.log(labels)

    }, [])


    return (
        // <div>Hello</div>
        // <Slider {...settings}>
        //     {labels.map(label => (
        //         <div className='label-container' key={label.title} >
        //             <img src={label.url} alt={label.title} onClick={() => onLabelChange(label.title)} />
        //             <p>{label.title}</p>
        //         </div>
        //     ))
        //     }
        // </Slider >
        <Swiper
            navigation={true}
            // navigation={true}
            // loop={true}
            modules={[Navigation]}
            spaceBetween={0}
            slidesPerView={15}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
        >
            {labels.map(label => (
                <SwiperSlide>
                    <div className='label-container' key={label.title} >
                        <img src={label.url} alt={label.title} onClick={() => onLabelChange(label.title)} />
                        <p>{label.title}</p>
                    </div>
                </SwiperSlide>
            ))}


        </Swiper >

    )
}


{/* <Swiper
    navigation={true}
    modules={[Navigation]}
    spaceBetween={50}
    slidesPerView={10}
    onSlideChange={() => console.log('slide change')}
    onSwiper={(swiper) => console.log(swiper)}
>
    {labels.map(label => (
        <SwiperSlide>
            <div className='label-container' key={label.title} >
                <img src={label.url} alt={label.title} onClick={() => onLabelChange(label.title)} />
                <p>{label.title}</p>
            </div>
        </SwiperSlide>
    ))}


</Swiper > */}


// <Carousel
//     swipeable={true}
//     draggable={true}
//     // showDots={true}
//     responsive={responsive}
//     ssr={true} // means to render carousel on server-side.
//     // infinite={true}
//     // autoPlay={this.props.deviceType !== "mobile" ? true : false}
//     autoPlaySpeed={1000}
//     keyBoardControl={true}
//     // customTransition="all .5"
//     transitionDuration={1000}
//     containerClass="carousel-container"
//     // removeArrowOnDeviceType={["tablet", "mobile"]}
//     // deviceType={this.props.deviceType}
//     dotListClass="custom-dot-list-style"
//     itemClass="carousel-item"
// >
//     <div className="label-filter">
//         {labels.map(label => (
//             <div className='label-container' key={label.title} >
//                 <img src={label.url} alt={label.title} onClick={() => onLabelChange(label.title)} />
//                 <p>{label.title}</p>
//             </div>
//         ))}
//     </div>
// </Carousel>
// </div>

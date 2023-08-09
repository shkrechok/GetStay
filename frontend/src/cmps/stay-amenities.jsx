import { utilService } from "../services/util.service.js"
import React, { useState } from 'react';

export function StayAmenities({ stay }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    function showAmenities() {
        alert('under construction')
    }
    // console.log('hello',utilService.getIcon(stay.amenities[0]))

    return (
        <section>
            <h2>What this place offers</h2>
            <br />
            <ul className="amenities-list">
                {stay.amenities.slice(0, 10).map(amenity =>
                    <div>
                        <li className="amenity-preview" key={amenity}>
                            <img src={utilService.getIcon(amenity)} alt="smth" />
                            <p>
                                {amenity}
                            </p>

                        </li>
                    </div>
                )}
            </ul>
            
            <button className="open-modal" onClick={() => setIsModalOpen(true)}>Show all {stay.amenities.length} amenities</button>
            
            {isModalOpen&&<div className="modal-background" onClick={() => setIsModalOpen(false)}></div>}


            {isModalOpen&&<div className="modal-container">
                <div className='close-button'>  <button onClick={() => setIsModalOpen(false)}> <i class="fa-solid fa-x"></i> </button></div>
                <div className="scroller">

                    <div className="modal-amenities">
                        <h2>What this place offers</h2>
                        <ul>
                            {stay.amenities.map(amenity =>
                                <div className="li-container">
                                <li key={amenity}>
                                        <img src={utilService.getIcon(amenity)} alt="smth" />
                                        <p>
                                            {amenity}
                                        </p>
                                    </li>
                                    <hr className="hLine" />
                                </div>
                                )}
                        </ul>
                    </div>
                </div>
            </div>
            }
        </section >
    )
}
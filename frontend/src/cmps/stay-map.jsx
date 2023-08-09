import React from "react";
import GoogleMapReact from 'google-map-react';

// const MyMarker = ({ image }) => <div>{image}</div>;

export function StayMap({ stay }) {

    const locProps = {
        center: {
            // lat: stay.loc.lat,
            // lng: stay.loc.lng,
            lat: stay.loc.lan,
            lng: stay.loc.lat
        },
        zoom: 11
    }
    console.log(locProps)

    return (
        <section>
            <hr />
            <br />
            <h2>Where you'll be</h2>
            <br />
            <p>{stay.loc.city}, {stay.loc.country}</p>
            <br />
            <div className="details-map" style={{ height: '500px', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyCc8JY5MR4sn9w7GJN2r9Vo63ShUYCqEyo" }}
                    defaultCenter={locProps.center}
                    defaultZoom={locProps.zoom}
                >
                    {/* <MyMarker
                        lat={stay.loc.lan}
                        lng={stay.loc.lat}
                        image={<img src={require('../assets/img/jpeg/marker.png')} alt="" />}
                    /> */}
                </GoogleMapReact>
            </div>
        </section >
    )
}
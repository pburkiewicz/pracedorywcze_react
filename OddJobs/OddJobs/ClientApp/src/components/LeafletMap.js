import React from "react";

import { MapContainer,
    TileLayer,
    Marker,
    Popup
} from 'react-leaflet'

require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            position: [51.505, -0.09],
            zoom: 13
        };
    }
    
    
    render() {
        return (<MapContainer  placeholder center={this.state.position} zoom={this.state.zoom} >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={this.state.position}>
                <Popup>
                    A pretty CSS3 popup. <br/> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>)
    }
}

export default Map;
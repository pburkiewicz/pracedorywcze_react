import React from "react";

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            position: [51.505, -0.09],
            zoom: 13
        };
    }
    
    
    componentDidMount() {
        this.map();
    }
    
    map() {
        const map = L.map('map').setView(this.state.position, this.state.zoom);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
    }
    
    

    render() {
        return <div id="map" style={{width:'100%', height: '100%'}}>xx</div>
    }
}

export default Map;
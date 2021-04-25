import React from "react";

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            position: [51.981497, 20.143433],
            zoom: 7,
            markers: [],
            bounds: null
        };

        this.OnUpdateMarkers = this.OnUpdateMarkers.bind(this);
    }
    //moveend, zoomend
    
    componentDidMount() {
        this.map();
    }
    
    map() {
        this.mapBox = L.map('map').setView(this.state.position, this.state.zoom);
        this.mapBox.locate({setView : true});
        this.mapBox.on('moveend',this.OnUpdateMarkers);
        
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.mapBox);
        this.OnUpdateMarkers();
    }
    
    OnUpdateMarkers()
    {
        const bounds = this.mapBox.getBounds();
        const zoom = this.mapBox.getZoom()
        const position = this.mapBox.getCenter();
        console.log('bounds '+ bounds.toBBoxString() + "\nzoom "+ zoom + "\nposition " + position);
        this.setState({
            bounds: bounds,
            zoom: zoom,
            position: position
        });
    }
    

    render() {
        return <div id="map" style={{width:'100%', height: '100%'}}>xx</div>
    }
}

export default Map;
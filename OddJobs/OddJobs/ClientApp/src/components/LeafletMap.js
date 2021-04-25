import React from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {greenIcon, redIcon, goldIcon} from './Icons'

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            position: [51.981497, 20.143433],
            zoom: 7,
            bounds: null
        };
        this.OnUpdateMarkers = this.OnUpdateMarkers.bind(this);
    }

    
    componentDidMount() {
        this.map();
    }
    
    map() {
        this.mapBox = L.map('map').setView(this.state.position, this.state.zoom);
        this.mapBox.locate({setView : true});
        this.mapBox.on('moveend',this.OnUpdateMarkers);
        this.markerLayer = L.layerGroup().addTo(this.mapBox);
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
        if (zoom<=10) return;
        this.setState({
            bounds: bounds,
            zoom: zoom,
            position: position
        });
        //database comunication
        // jobs = fetch()
        this.markerLayer.clearLayers();
        //addIcons(jobs)
        L.marker([50.203059, 18.989359],{icon: greenIcon}).addTo( this.markerLayer);
    }
    

    render() {
        return <div id="map" style={{width:'100%', height: '100%'}}>xx</div>
    }
}

export default Map;
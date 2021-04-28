import React from "react";

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

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
        L.control.locate({icon: "TO I TAK NIE DZIAŁA..."}).addTo(this.mapBox);
        this.mapBox.on('moveend',this.OnUpdateMarkers);
        this.markerLayer = L.layerGroup().addTo(this.mapBox);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.mapBox);
        this.OnUpdateMarkers();
    }
    
    async OnUpdateMarkers() {
        const bounds = this.mapBox.getBounds();
        const zoom = this.mapBox.getZoom()
        const position = this.mapBox.getCenter();
        console.log('bounds ' + bounds.toBBoxString() + "\nzoom " + zoom + "\nposition " + position);
        if (zoom < 10) {
            this.markerLayer.clearLayers();
            return;
        }
        this.setState({
            bounds: bounds,
            zoom: zoom,
            position: position
        });
        const response = await fetch("jobOrder/fetchData/" + bounds.getWest() + "/" + bounds.getEast() + "/" + bounds.getNorth() + "/" + bounds.getSouth());
        const jobs =await response.json();
        this.markerLayer.clearLayers();
        console.log(jobs);
        this.addIcons(jobs);
    }
    
    addIcons(icons)
    {
        icons.forEach((item, index) =>
        {
            L.marker([item['latitude'], item['longitude']], {icon: greenIcon}).addTo(this.markerLayer);
        })
    }

    render() {
        return <div id="map" style={{width:'100%', height: '100%'}}>xx</div>
    }
}



export default Map;
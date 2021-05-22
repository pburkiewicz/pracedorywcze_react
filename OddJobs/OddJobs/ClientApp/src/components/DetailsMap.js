import React, {useEffect, useState} from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {greenIcon} from "./Icons"
import 'leaflet.locatecontrol';
import 'leaflet-geosearch/dist/geosearch.css';

const DetailsMap = (props) => {
    const [position, setPosition] = useState([props.latitude, props.longitude])
    const [zoom, setZoom] = useState(13);
    let mapBox = null
    let markerLayer = null 
        
    useEffect( () =>{
        map();
    }, []);

    const map = () => {
        mapBox = L.map('map').setView(position, zoom);
        mapBox.addLayer(L.marker(position, {icon: greenIcon}));
        L.control.locate().addTo(mapBox);
        markerLayer = L.layerGroup().addTo(mapBox);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapBox);
    }
    
    return <div id="map" style={{width:'100%', height: '100%'}}>Generowanie mapy</div>
}
export default DetailsMap;
import React from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {greenIcon} from "./Icons"
import 'leaflet.locatecontrol';
import 'leaflet-geosearch/dist/geosearch.css';

class DetailsMap extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            position: [51.981497, 20.143433],
            zoom: 7,
            bounds: null

        };
        this.props = props;
        this.OnUpdateMarkers = this.OnUpdateMarkers.bind(this);
    }

    componentDidMount() {
            this.map();
    }
    
    componentDidUpdate(prevProps, prevState, snapshot){
        console.log(prevProps)
        console.log(this.props)
        if(prevProps.latitude !== this.props.latitude) {
            if (this.props.latitude && this.props.longitude) {
                // this.Marker = new L.marker([this.props.latitude, this.props.longitude], {icon: greenIcon});
                this.mapBox.addLayer(L.marker([this.props.latitude, this.props.longitude], {icon: greenIcon}));
                this.mapBox.setView([this.props.latitude, this.props.longitude], 13);
            }
        }
    }
    
    map() {
        this.mapBox = L.map('map').setView(this.state.position, this.state.zoom);
        this.mapBox.locate({setView : true});
        L.control.locate().addTo(this.mapBox);
        this.mapBox.setView(this.state.position, this.state.zoom);
        this.markerLayer = L.layerGroup().addTo(this.mapBox);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.mapBox);
        this.mapBox.on('moveend',this.OnUpdateMarkers);
        
    }

    async OnUpdateMarkers() {
        const bounds = this.mapBox.getBounds();
        const zoom = this.mapBox.getZoom()
        const position = this.mapBox.getCenter();
        this.setState({
            bounds: bounds,
            zoom: zoom,
            position: position
        });
    }

    render() {
        return <div id="map" style={{width:'100%', height: '100%'}}>Generowanie mapy</div>
    }
}
export default DetailsMap;
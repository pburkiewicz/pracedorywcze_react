import React from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {greenIcon} from "./Icons"
import 'leaflet.locatecontrol';
import 'leaflet-geosearch/dist/geosearch.css';
import * as GeoSearch from "leaflet-geosearch";
import GeocoderControl from "leaflet-control-geocoder";

class FormMap extends React.Component {
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

    async map() {
        this.mapBox = L.map('map').setView(this.state.position, this.state.zoom);
        
        // this.mapBox.locate({setView : true});
        
        const geocoder = GeocoderControl.nominatim();
        
        L.control.locate().addTo(this.mapBox);
        const provider = new GeoSearch.OpenStreetMapProvider()
        let search = new GeoSearch.GeoSearchControl({
            provider: provider,
            style: 'bar',
            searchLabel: 'Wpisz adres lub wybierz na mapie',
            showPopup: false,
            showMarker: false
        });
        
        this.mapBox.addControl(search);
        let marker = undefined;
        if(this.props.address){
            this.mapBox.setView(this.props.coordinates, 13);
            marker = new L.marker(this.props.coordinates, {icon: greenIcon});
            this.mapBox.addLayer(marker);
            search.container.firstChild[0].value = this.props.address;
        }
        
        this.mapBox.on('geosearch/showlocation', function(e){
            if (marker !== undefined) {
                this.removeLayer(marker);
            };
            marker = new L.marker(L.latLng(e.location.y, e.location.x), {icon: greenIcon});
            this.addLayer(marker);
        });
        this.markerLayer = L.layerGroup().addTo(this.mapBox);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.mapBox);
        this.mapBox.on('moveend',this.OnUpdateMarkers);
        let main = this;
        this.mapBox.on('click', function(e){
            if (marker !== undefined) {
                this.removeLayer(marker);
            }
            marker = new L.marker(e.latlng, {icon: greenIcon});
            this.addLayer(marker);
            geocoder.reverse(L.latLng(e.latlng), this.options.crs.scale(this.getZoom()), async result=>{
                if( result.length !== 0 ) {
                    console.log(main.props);
                    main.props.setAddress(result[0].name);
                    main.props.setCoordinates(e.latlng);
                    search.container.firstChild[0].value = result[0].name
                }
            })
        });
    }

    async OnUpdateMarkers() {
        const bounds = this.mapBox.getBounds();
        const zoom = this.mapBox.getZoom()
        const position = this.mapBox.getCenter();
        if (zoom < 10) {
            this.markerLayer.clearLayers();
            return;
        }
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
export default FormMap;
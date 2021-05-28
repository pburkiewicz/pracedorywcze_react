import React from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {greenIcon} from "./Icons"
import 'leaflet.locatecontrol';
import 'leaflet.markercluster';
import Popup from "./Popup"
import './css/popup.css';
import ReactDOMServer from 'react-dom/server';
import {BrowserRouter} from "react-router-dom";
import {MarkerClusterGroup} from "leaflet.markercluster/src";


class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            position: [51.981497, 20.143433],
            zoom: 7,
            bounds: null,
            bigBounds: [51, 26, 50, 13]
        };
        this.OnUpdateMarkers = this.OnUpdateMarkers.bind(this);
    }
    
    componentDidMount() {
        this.isMountedVal = 1
        this.map();
    }
    
    componentWillUnmount() {
        this.isMountedVal = 0
    }

    map() {
        this.mapBox = L.map('map', {maxZoom: 18}).setView(this.state.position, this.state.zoom);
        this.mapBox.locate({setView : true, maxZoom: 13});
        L.control.locate().addTo(this.mapBox);
        this.mapBox.on('moveend',this.OnUpdateMarkers);
        this.markerLayer = new MarkerClusterGroup()
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
        this.setState({
            bounds: bounds,
            zoom: zoom,
            position: position,
        });
        if (this.ControlSetBigBounds(bounds)) return;
        if (this.isMountedVal === 0) return;
        const response = await fetch("jobOrder/fetchData/" +
            this.state.bigBounds[3] +
            "/" + this.state.bigBounds[2] +
            "/" + this.state.bigBounds[0] +
            "/" + this.state.bigBounds[1]);
        const jobs = await response.json();
        this.markerLayer.clearLayers();
        this.addIcons(jobs);
    }
    
    addIcons(icons)
    {
        icons.forEach((item, index) =>
        {
            const marker = L.marker([item['latitude'], item['longitude']], {icon: greenIcon})
                .bindPopup(ReactDOMServer.renderToString(<BrowserRouter><Popup id={index} item={item} style={{background: 'gray', backgroundColor: 'gray'}}/></BrowserRouter>))
            this.markerLayer.addLayer(marker)
        })
        this.mapBox.addLayer(this.markerLayer);
    }

    render() {
        return <div id="map" style={{width:'100%', height: '100%'}}>xx</div>
    }

    ControlSetBigBounds(bounds) {
        console.log("aaa")
        console.log(this.state.bigBounds)
        if (this.state.bigBounds==null) {
            this.SetBigBounds(bounds)
            console.log("7")
            return false;
        }
        if (this.state.bigBounds[0]<= bounds.getNorth()
            || this.state.bigBounds[1]>= bounds.getSouth()
            || this.state.bigBounds[2]<= bounds.getEast()
            ||this.state.bigBounds[3]>= bounds.getWest())
        {
            const verticalHole = bounds.getNorth() - bounds.getSouth();
            const horizontalHole = bounds.getEast() - bounds.getWest();
            this.setState({
                bigBounds: [bounds.getNorth() + verticalHole * this.props.resolution,
                    bounds.getSouth() - verticalHole * this.props.resolution,
                    bounds.getEast() + horizontalHole * this.props.resolution,
                    bounds.getWest() - horizontalHole * this.props.resolution]
            })
            return false;
        }
        return true;
    }


    SetBigBounds(bounds) {
        const verticalHole = bounds.getNorth() - bounds.getSouth();
        const horizontalHole = bounds.getEast() - bounds.getWest();
        this.setState({
            bigBounds: [bounds.getNorth()+verticalHole*this.props.resolution,
                bounds.getSouth()-verticalHole*this.props.resolution,
                bounds.getEast() + horizontalHole*this.props.resolution,
                bounds.getWest() - horizontalHole*this.props.resolution ]
        })
    }
}

Map.defaultProps = {
    resolution: 5
}

export default Map;
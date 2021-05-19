import React from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {greenIcon} from "./Icons"
import 'leaflet.locatecontrol';
import Popup from "./Popup"
import './popup.css';
import ReactDOMServer from 'react-dom/server';



class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            position: [51.981497, 20.143433],
            zoom: 7,
            bounds: null,
            bigBounds: null
        };
        this.OnUpdateMarkers = this.OnUpdateMarkers.bind(this);
    }
    
    
    componentDidMount() {
        this.map();
    }
    
    map() {
        this.mapBox = L.map('map').setView(this.state.position, this.state.zoom);
        this.mapBox.locate({setView : true});
        L.control.locate().addTo(this.mapBox);
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
        //console.log('bounds ' + bounds.toBBoxString() + "\nzoom " + zoom + "\nposition " + position);
        if (zoom < 11) {
            this.markerLayer.clearLayers();
            this.setState({
                bigBounds: null
            })
            return;
        }
        this.setState({
            bounds: bounds,
            zoom: zoom,
            position: position
        });
        console.log(this.state.bigBounds);
        if (this.ControlSetBigBounds(bounds)) return;
        const response = await fetch("jobOrder/fetchData/" +
            this.state.bigBounds[3] +
            "/" + this.state.bigBounds[2] +
            "/" + this.state.bigBounds[0] +
            "/" + this.state.bigBounds[1]);
        const jobs =await response.json();
        this.markerLayer.clearLayers();
        console.log("after fetch\n");
        console.log(jobs);
        this.addIcons(jobs);
    }
    
    addIcons(icons)
    {
        icons.forEach((item, index) =>
        {
            const marker = L.marker([item['latitude'], item['longitude']], {icon: greenIcon}).addTo(this.markerLayer)
                .bindPopup(ReactDOMServer.renderToString(<Popup id={index} item={item} style={{background: 'gray', backgroundColor: 'gray'}}/>))
        })
    }

    render() {
        return <div id="map" style={{width:'100%', height: '100%'}}>xx</div>
    }

    ControlSetBigBounds(bounds) {
        if (this.state.bigBounds==null) {
            this.SetBigBounds(bounds)
            return false;
        }
        if (this.state.bigBounds[0]< bounds.getNorth()
            || this.state.bigBounds[1]> bounds.getSouth()
            || this.state.bigBounds[2]< bounds.getEast()
            ||this.state.bigBounds[3]> bounds.getWest())
        {
            this.SetBigBounds(bounds)
            return false;
        }
        return true;
    }

    SetBigBounds(bounds) {
        const verticalHole = bounds.getNorth() - bounds.getSouth();
        const horizontalHole = bounds.getEast() - bounds.getWest();
        console.log(bounds)
        console.log(verticalHole, "\t" ,horizontalHole);
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
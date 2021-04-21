import React from "react";


class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            position: [51.505, -0.09],
            zoom: 13
        };
    }
    
    
    render() {
        <MapContainer center={this.state.position} zoom={this.state.zoom} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={this.state.position}>
                <Popup>
                    A pretty CSS3 popup. <br/> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    }
}

export default Map;
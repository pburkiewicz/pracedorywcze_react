import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMoneyBill
} from "@fortawesome/free-solid-svg-icons";

class Popup extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        const Id = 'Popup' + this.props.id;
        
        return (
            <div className="container" >
                <div id={Id} className="row"  >
                        <ul className="list-group" color="dark" style={{width: '100%'}}>
                            <li className="list-group-item ">
                                <h6 className="text-muted centered">{this.props.item['title']}</h6>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                <FontAwesomeIcon icon={faMoneyBill}  size="3x"/>
                                <p style={{fontSize: "13px"}}>{this.props.item['proposedPayment']} zł</p>
                            </li>
                        </ul>
                </div>
            </div>);
    }
}

export default Popup
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMoneyBill,
    faClock,
    faCalendar,
    faInfoCircle,
    faPhone
} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import authService from "./api-authorization/AuthorizeService";

class Popup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {path: ''};
    }
    
    pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    async componentDidMount() {
        this.user = await authService.getUser();
        await this.findThread();
    }
    
    render() {
        const Id = 'Popup' + this.props.id;
        const date = new Date(this.props.item['expirationTime']);
        let component = []
        // if (this.props.user.sub !== this.props.item.principalId) {
        //     component = [<Link  style={{color: "rgb(213,213,213); !important"}}
        //                        className={"btn btn-success"}><FontAwesomeIcon icon={faInfoCircle} size="3x"/></Link>
        //     ]
        // }

        return (
            <div className="container" color="dark">
                <div id={Id} className="row">
                    <ul className="list-group bg-dark col " style={{width: '100%'}}>
                        <li className="list-group-item dark-grey-coll border-0">
                            <h4 className="centered">{this.props.item['title']}</h4>
                        </li>
                        <li className="dark-grey-coll list-group-item d-flex justify-content-between align-items-center border-0">
                            <FontAwesomeIcon icon={faMoneyBill} size="3x"/>
                            <p style={{fontSize: "16px"}}>{this.props.item['proposedPayment']} zł</p>
                        </li>
                        <li className="dark-grey-coll list-group-item d-flex justify-content-between align-items-center border-0">
                            <FontAwesomeIcon icon={faCalendar} size="3x"/>
                            <p style={{fontSize: "16px"}}>{this.pad(date.getDate(), 2)}.{this.pad(date.getMonth(), 2)}</p>
                        </li>
                        <li className="dark-grey-coll list-group-item d-flex justify-content-between align-items-center border-0">
                            <FontAwesomeIcon icon={faClock} size="3x"/>
                            <p style={{fontSize: "16px"}}>{this.pad(date.getHours(), 2)} : {this.pad(date.getMinutes(), 2)}</p>
                        </li>
                        <li className="dark-grey-coll list-group-item d-flex justify-content-between align-items-center border-0">
                            <Link to={`/jobOrder/${this.props.item.id}`} style={{color: "rgb(213,213,213); !important"}}
                                  className={"btn btn-success"}><FontAwesomeIcon icon={faInfoCircle} size="3x"/></Link>
                            {component}
                        </li>
                    </ul>
                </div>
            </div>);
    }
}

export default Popup
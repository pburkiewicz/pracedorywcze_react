import React, {useState} from 'react'
import {Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import authService from "../api-authorization/AuthorizeService";
import '../css/formStyle.css'
import {useHistory} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faHandHoldingUsd, faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";

const MessageForm = (props) => {
    const history = useHistory();
    const [textMessage, setTextMessage] = useState("")
    
    const sendMessage = async (event) =>{
        event.preventDefault();
        console.log("Ślę wiadomość")

        const user = await authService.getUser();
        
        const message = {
            MessageText: textMessage,
            User: user.sub
        }
        
        const token = await authService.getAccessToken();
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify(message)
        };
        console.log(message)
        fetch(`/jobOrder/api/${props.match.params.id}/send`, requestOptions).then(async (response)=>{
            if(response.ok){
                let thread = await response.json();
                console.log(thread);
                history.push( `/thread/${thread.id}`);
            }
        });
        
    } 
    
    let status = [<p className={"w-100 p-2 mb-0 text-center custom-button-green text-light "}>Zlecenie aktualne</p>];
    let job = {}

    return (
    <Row className="d-flex justify-content-center w-100 mt-3 text-light job-details">
        <Col md={7} className={" p-3 job-card"}>
            <small><b>Dodane: </b>{job.registeredTime}</small>
            <h3 className={"pt-2"}>{job.title}</h3>
            <hr className={"bg-secondary mb-1 mt-1"}/>
            <Row className={"pt-2 pb-1"}>
                <Col md={5}>
                    <FontAwesomeIcon icon={faClock} size={"1x"} color={"#4aba70"}/>
                    <span className={"ml-2"}>{job.startDate}</span>
                </Col>
                <Col md={5}>
                    <FontAwesomeIcon icon={faHandHoldingUsd} size={"1x"} color={"#4aba70"}/>
                    <span className={"ml-2"}>{job.proposedPayment} zł</span>
                </Col>
            </Row>
            <Row className={"pt-1 pb-2"}>
                <Col md={12}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} size={"1x"} color={"#4aba70"}/>
                    <span className={"ml-2"}>{job.address}</span>
                </Col>
            </Row>
            <hr className={"bg-secondary mb-1 mt-1"}/>
            <Row>
                <Col sm={10} className={""}>
                    <Input type="textarea" style={{resize: "none"}} onChange={(e) => setTextMessage(e.target.value)}
                       name="message" id="message" placeholder="Wiadomość..." rows={3} />
                </Col>
                <Col sm={2} className={"pl-0"}>
                    <Input type={"submit"} value={"Wyślij"} onClick={sendMessage}/>
                </Col>
            </Row>
        </Col>
        <Col md={3} className={"ml-3"}>
            <Row className={"bg-dark mb-3"}>
                {status}
            </Row>
            
        </Col>
    </Row>
    )

}
export default MessageForm
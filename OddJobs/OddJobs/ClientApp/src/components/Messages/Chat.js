import React, {useEffect, useState} from 'react'
import {Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import authService from "../api-authorization/AuthorizeService";
import '../css/formStyle.css'
import {useHistory} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faHandHoldingUsd, faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";

const Chat = (props) => {
    const [textMessage, setTextMessage] = useState("");
    const [updateMessages, setUpdateMessages] = useState(true)
    const [messages, setMessages] = useState([]);
    
    const fetchMessages = async () => {
        const token = await authService.getAccessToken();
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        };
        await fetch(`message/api/${props.match.params.id}`, requestOptions)
            .then(async response => {
                let result = await response.json();
                setMessages(result);
                setUpdateMessages(false)
            })
    }

   

    useEffect( async () => {
        await fetchMessages()
        // messages.length ? messages.map(el => <li>{el.MessageText}</li>) : null
    }, [updateMessages])
    
    const sendMessage = async (event) => {
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
    
        await fetch(`message/api/${props.match.params.id}`, requestOptions).then(async (response)=>{
            if(response.ok){
                setUpdateMessages(true);
                // await response.json();
                // console.log(thread);
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
                <Row className={"pt-2 pb-1 overflow-auto"}>
                    <ul>
                    {
                        messages && messages.length && messages.map((item, index) => {
                            return <li key={index}>{item.sender.firstName}: {item.messageText}</li>
                        })
                    }
                    </ul>
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
export default Chat;
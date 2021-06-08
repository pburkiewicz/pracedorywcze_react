import React, {useEffect, useState} from 'react'
import {Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import authService from "../api-authorization/AuthorizeService";
import '../css/formStyle.css'
import {Link, useHistory} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBriefcase, faUserCircle,faAt} from "@fortawesome/free-solid-svg-icons";

import '../css/messagesStyle.css';
import '../css/formStyle.css';

const Chat = (props) => {
    const [textMessage, setTextMessage] = useState("");
    const [updateMessages, setUpdateMessages] = useState(true)
    const [messages, setMessages] = useState([]);
    const [thread, setThread] = useState({});
    const [user, setUser] = useState({});
    const [friend, setFriend] = useState({})

    const fetchMessages = async () => {
        const token = await authService.getAccessToken();
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        };
        await fetch(`message/api/${props.match.params.id}/messages`, requestOptions)
            .then(async response => {
                let result = await response.json();
                setMessages(result);
                setUpdateMessages(false)
            })
        
        await fetch(`message/api/${props.match.params.id}`, requestOptions)
            .then(async response => {
                let result = await response.json();
                if(user.sub == result.jobOrder.principalId){
                    setFriend(result.interestedUser);
                }else{
                    setFriend(result.jobOrder.principal);
                }
                setThread(result);
            })
    }

    useEffect( async () => {
        setUser(await authService.getUser());
        await fetchMessages();
    }, [updateMessages])
    
    const sendMessage = async (event) => {
        event.preventDefault();
        console.log("Ślę wiadomość")

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
                setTextMessage("")
                setUpdateMessages(true);
            }
        });
    }
    
    let status = [];
    if(Object.keys(thread).length !== 0){
        status = [ <Link to={`/jobOrder/${thread.jobOrder.id}`} className={"w-100 btn text-light"} style={{borderTopColor: "#6c757d", paddingBottom: "9px"}}>
                                    <FontAwesomeIcon className={"mr-1"} icon={faBriefcase}/>Zlecenie</Link>];      
    }
    
    let oldDate ={};
    if(messages && messages.length){
        oldDate = new Date(messages[0].sendTime).toLocaleDateString();    
    }

    
    return (
        <Row className="d-flex justify-content-center w-100 mt-3 text-light job-details">
            <Col md={7} className={" p-3 job-card"}>
                <Row className={"pt-0 pb-1"}>
                    <div className={"ml-3 mr-3 w-100 pl-0 pr-0 rounded overflow-auto message-box"} style={{backgroundColor: "#222831", minHeight: "300px", maxHeight: "500px"}}>
                        {
                            messages && messages.length && messages.map((item, index) => {
                                let messageClass = "receive";
                                let flex = "flex-row"
                                let float = "float-left"
                                if(user.sub === item.sender.id){
                                    messageClass = "send";
                                    flex = "flex-row-reverse"
                                    float = "float-right"
                                }
                                let time = new Date(item.sendTime).toLocaleTimeString().slice(0, 5);
                                let date = new Date(item.sendTime).toLocaleDateString();
                                if(oldDate === date) {
                                    return <div className={"d-flex pl-3 pr-3 mt-2 mb-2 " + flex}>
                                        <div><small className={"text-secondary"}>{time}</small>
                                            <div className={"d-flex  " + flex}>
                                                <div>
                                                    <Row className={"m-0 p-0"}>
                                                        <p className={messageClass + " pr-3 pl-3 pt-2 pb-2 mb-0"}>{item.messageText}</p>
                                                    </Row>
                                                    <Row className={"m-0 p-0 " + float }>
                                                        <span className={messageClass +"  triangle"}></span>
                                                    </Row>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }else{
                                    oldDate = date
                                    return <><div className={"d-flex pl-3 pr-3 mt-2 mb-2 justify-content-center"}><small className={"mx-auto text-secondary"}>{date}</small></div><div className={"d-flex pl-3 pr-3 mt-2 mb-2 " + flex}>
                                        <div><small className={"text-secondary"}>{time}</small>
                                            <div className={"d-flex  " + flex}>
                                                <div>
                                                    <Row className={"m-0 p-0"}>
                                                        <p className={messageClass + " pr-3 pl-3 pt-2 pb-2 mb-0"}>{item.messageText}</p>
                                                    </Row>
                                                    <Row className={"m-0 p-0 " + float }>
                                                        <span className={messageClass +"  triangle"}></span>
                                                    </Row>
                                                </div>
                                            </div>
                                        </div>
                                    </div></>
                                }
                            })
                        }
                    </div>
                </Row>
                <hr className={"bg-secondary mb-2 mt-1"}/>
                <Row>
                    <Col sm={10} className={""}>
                        <Input value={textMessage} type="textarea" style={{resize: "none"}} onChange={(e) => setTextMessage(e.target.value)}
                               name="message" id="message" placeholder="Wiadomość..." rows={3} />
                    </Col>
                    <Col sm={2} className={"pl-0"}>
                        <Input type={"submit"} className={"btn custom-button-green"}  value={"Wyślij"} onClick={sendMessage}/>
                    </Col>
                </Row>
            </Col>
            <Col md={3} className={"ml-3"}>
                <Row className={"bg-dark mb-3 "}>
                    <Col xs={12} className={"d-flex justify-content-center"}>
                        <FontAwesomeIcon icon={faUserCircle} size={"6x"} className={"mx-auto mt-3"} color={"#4aba70"}/>    
                    </Col>
                    <Col xs={12} className={"d-flex justify-content-center"}>
                        <p className={"mx-auto mb-2 mt-2"}>{friend.firstName} {friend.lastName}</p>
                    </Col>
                    <Col xs={12} className={"d-flex justify-content-center"}>
                        <span className={"mx-auto mb-3 mt-1"}><FontAwesomeIcon icon={faAt} color={"#4aba70"} className={"mr-2"}/>{friend.email}</span>
                    </Col>
                    {status}
                </Row>
            </Col>
        </Row>
    )
}
export default Chat;
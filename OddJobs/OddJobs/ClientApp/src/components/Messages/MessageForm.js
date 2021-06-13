import React, {useEffect, useState} from 'react'
import {Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import authService from "../api-authorization/AuthorizeService";
import '../css/formStyle.css'
import {Link, useHistory} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAt,
    faBriefcase, 
    faSmileBeam,
    faUserCircle
} from "@fortawesome/free-solid-svg-icons";

const MessageForm = (props) => {
    const history = useHistory();
    const [textMessage, setTextMessage] = useState("")
    const [job, setJob] = useState({});
    
    useEffect(async () => {
        fetch(`/jobOrder/api/${props.match.params.id}`).then(async (response)=>{
            if(response.ok){
                let jobOrder = await response.json();
                console.log(jobOrder);
                setJob(jobOrder)
            }
        });
    },[])
    
    const sendMessage = async (event) =>{
        event.preventDefault();
        console.log("Ślę wiadomość")

        const user = await authService.getUser();
        if(textMessage.length >= 200) return;
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

        fetch(`/jobOrder/api/${props.match.params.id}/send`, requestOptions).then(async (response)=>{
            if(response.ok){
                let thread = await response.json();
                console.log(thread);
                history.push( `/thread/${thread.id}`);
            }
        });
    } 
    
    return (
        <Row className="d-flex justify-content-center w-100 mt-3 text-light job-details">
            <Col md={7} className={"p-3 job-card"}>
                <Row className={"pt-0 pb-1"}>
                    <div className={"ml-3 mr-3 w-100 pl-0 pr-0 rounded overflow-auto message-box"} style={{backgroundColor: "#222831", minHeight: "300px", maxHeight: "500px"}}>
                        <div className="w-100 mt-3 d-flex align-items-center ">
                            <div className="alert alert-success w-75 mx-auto bg-dark pt-3 pb-2" role="alert">
                                <Row>
                                    <Col sm={2}>
                                        <FontAwesomeIcon icon={faSmileBeam} size={"4x"} className="mx-auto" color={"#4aba70"}/>
                                    </Col>
                                    <Col sm={10}>
                                        <h4 className="alert-heading text-light">Napisz wiadomość</h4>
                                        <p className={"text-light"}>Pokaż, że jesteś zainteresowany zleceniem</p>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Row>
                <hr className={"bg-secondary mb-2 mt-1"}/>
                <Row>
                    <Col sm={10} className={""}>
                        <Input value={textMessage} type="textarea" style={{resize: "none"}} onChange={(e) => setTextMessage(e.target.value)}
                               name="message" id="message" placeholder="Wiadomość..." rows={3} />
                    </Col>
                    <Col sm={2} className={"pl-0"}>
                        <Input type={"submit"} disabled={!textMessage.length} className={"btn custom-button-green"} value={"Wyślij"} onClick={sendMessage}/>
                        {textMessage.length >= 200 ? <small className={"text-danger"}>max. 200 znaków ({textMessage ? textMessage.length : 0}/200)</small> :[]}
                    </Col>
                </Row>
            </Col>
            <Col md={3} className={"ml-3"}>
                <Row className={"bg-dark mb-3 "}>
                    <Col xs={12} className={"d-flex justify-content-center"}>
                        <FontAwesomeIcon icon={faUserCircle} size={"6x"} className={"mx-auto mt-3"} color={"#4aba70"}/>
                    </Col>
                    <Col xs={12} className={"d-flex justify-content-center"}>
                        <p className={"mx-auto mb-2 mt-2"}>{job.principal ? `${job.principal.firstName} ${job.principal.lastName}` : []}</p>
                    </Col>
                    <Col xs={12} className={"d-flex justify-content-center"}>
                        <span className={"mx-auto mb-3 mt-1"}>
                            <FontAwesomeIcon icon={faAt} color={"#4aba70"} className={"mr-2"}/>
                            { job && job.principal ? job.principal.email : [] }
                        </span>
                    </Col>
                    <Link to={`/jobOrder/${job.id}`} className={"w-100 btn text-light"} style={{borderTopColor: "#6c757d", paddingBottom: "9px"}}>
                        <FontAwesomeIcon className={"mr-1"} icon={faBriefcase}/>Zlecenie
                    </Link>
                </Row>
            </Col>
        </Row>
    )
}
export default MessageForm
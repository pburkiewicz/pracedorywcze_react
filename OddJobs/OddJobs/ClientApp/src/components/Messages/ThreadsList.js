import React, {useState, useEffect} from "react";
import DataTable, { createTheme }  from 'react-data-table-component';
import authService from "../api-authorization/AuthorizeService";
import {Col, Row} from "reactstrap";
import {Link, useHistory} from "react-router-dom";
import Loading from "../Loading";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faTimesCircle, faEnvelopeSquare, faHeartBroken} from "@fortawesome/free-solid-svg-icons";

const ThreadsList = () => {
    const history = useHistory()
    const [threads, setThreads] = useState(null);
    const [user, setUser] = useState({})

    createTheme('solarized', {
        text: {
            primary: '#e8e8e8',
            secondary: '#9c9c9c',
        },
        background: {
            default: '#393e46',
        },
        context: {
            text: '#FFFFFF',
        },
        divider: {
            default: 'rgba(0, 0, 0, 0.3)',
        },
        highlightOnHover: {
            default: 'rgb(69,76,85)',
            text: 'rgba(255,255,255,0.87)',
        },
        sortFocus: {
            default: 'rgba(255, 255, 255, .54)',
        },
    });

    const customStyles = {
        rows: {
            style: {
                minHeight: '72px', 
                '&:hover':{
                    cursor: 'pointer',
                }
            }
        },
        headCells: {
            style: {
                paddingLeft: '8px', 
                paddingRight: '8px',
                fontSize: '1em',
                '&:hover': {
                    color: "rgb(163,161,161)"
                }
            },
        },
        cells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
            },
        },
    
    };


    const fetchThreads = async () =>{
        setUser( await authService.getUser());
        
        const token = await authService.getAccessToken();
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        };
        
        await fetch('message/api/getThreads', requestOptions)
            .then(async response => {
                let result = await response.json();
                setThreads(result);
        })
        let header = document.getElementsByClassName("sc-fnVZcZ fjcLNf rdt_TableHeader")
        if( header.length !== 0) header.item(0).remove()

    }
    
    useEffect(async () => await fetchThreads(), []);
    
    const columns = [ {
            name: 'Wiadomość',
            selector: 'message.messageText',
            sortable: true,
            width: "50%",
            cell: (e) =>{
                let messageText = e.message.messageText;
                if(messageText.length > 60) messageText = messageText.slice(0,60) + "...";
                return (
                     <Link to={`/thread/${e.message.thread.id}`} className={"pt-1 pb-1"} style={{textDecoration: "none", color: "white"}}>
                        <strong>{e.message.thread.jobOrder.title.length > 60 ? e.message.thread.jobOrder.title.slice(0,60)+"..." : e.message.thread.jobOrder.title}</strong>
                        <br/>
                        {messageText}
                     </Link>
                )
            }, 
        },
        {
            name: 'Użytkownik',
            selector: 'correspondent.email',
            sortable: true,
            cell: (e) => {
                return `${e.correspondent.firstName} ${e.correspondent.lastName}`
            }
        },
        {
            name: 'Rodzaj',
            selector: (e) => {return user.sub == e.message.thread.jobOrder.principalId},
            sortable: true,
            cell: (e) => {
                if(user.sub == e.message.thread.jobOrder.principalId) {
                    return "Twoja oferta"
                }else{
                    return "Zlecone"
                }
            }
        },
        {
            name: 'Status',
            selector: 'message.thread.jobOrder.active',
            sortable: true,
            center: true,
            cell: (e) => {
                if(e.message.thread.jobOrder.active) {
                    return <FontAwesomeIcon icon={faCheckCircle} size={"2x"} color={"#4aba70"}/>
                }else{
                    return <FontAwesomeIcon icon={faTimesCircle} size={"2x"} color={"#d9534f"}/>
                }
            }
        },
        {
            name: '',
            selector: 'message.sendTime',
            right: true,
            sortable: true,
            cell: (e) => {
                let lastMessageTime = new Date(e.message.sendTime);
                let now = new Date();
                if(lastMessageTime.getDate() != now.getDate()){
                    return lastMessageTime.toLocaleTimeString().slice(0,5);
                }else{
                    return `${lastMessageTime.getDay()} ${lastMessageTime.toLocaleString("pl",{month: "long"}).slice(0,3)}`
                }
            }
        },
    ]
    
    if(threads == null ) return <Loading text={"wiadomości"}/>
    if( threads.length){
        return (
            <Row style={{marginLeft: "0px"}} className={"w-100 mt-3  d-flex align-items-center"}>
                <Col xs={11} className={"mx-auto"} style={{backgroundColor: "#393e46"}}>
                    <span className={"text-light h2 mt-3 ml-2 d-flex align-items-center"}>
                        <FontAwesomeIcon icon={faEnvelopeSquare} size={"2x"} color={"#4aba70"} className={"mr-2"}/>
                        Wiadomości
                    </span>
                    
                    <DataTable columns={columns} data={threads}
                                                       highlightOnHover
                                                       pagination
                                                       theme="solarized"
                                                       progressComponent={<Loading/>}
                                                       progressPending={false}
                                                       customStyles={customStyles}
                                                       onRowClicked={(e) => history.push(`/thread/${e.message.thread.id}`)}/>
                </Col>
            </Row>
        )
    }
    return (
        <div className="w-100 mt-3 d-flex align-items-center">
            <div className="alert alert-danger w-50 mx-auto bg-dark" role="alert">  
                <Row>
                    <Col sm={2} className={"d-flex align-items-center"}>
                        <FontAwesomeIcon icon={faHeartBroken} size={"5x"} className="mx-auto"
                                         style={{verticalAlign: "middle"}} color={"#d9534f"}/>
                    </Col>
                    <Col sm={10}>
                        <h4 className="alert-heading text-light">Bardzo nam przykro</h4>
                        <p className={"text-light mb-0"}>Nie znaleźliśmy żadnych wiadomości. </p>
                    </Col>
                </Row>
            </div>
        </div>
    )
  
    
}
export default ThreadsList;
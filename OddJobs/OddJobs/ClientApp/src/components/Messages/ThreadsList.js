import React, {useState, useEffect} from "react";
import DataTable from 'react-data-table-component';
import authService from "../api-authorization/AuthorizeService";
import {Col, Row} from "reactstrap";
import {Link, useHistory} from "react-router-dom";

const ThreadsList = () => {
    const history = useHistory()
    const [threads, setThreads] = useState([]);
    const [user, setUser] = useState({})
    
    const fetchThreads = async () =>{
        setUser( authService.getUser());
        
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
    }
    
    useEffect(async () => await fetchThreads(), []);
    
    const columns = [ {
            name: 'Wiadomość',
            selector: 'messageText',
            sortable: true,
            cell: (e) =>{
                let messageText = e.messageText;
                if(messageText.length > 60) messageText = messageText.substring(0,60) + "...";
                return (
                    <div>
                        <strong>{e.thread.jobOrder.title}</strong>
                        <br/>
                        {messageText}
                    </div>
                )
            }, 
        },
        {
            name: 'Użytkownik',
            selector: 'interestedUser',
            sortable: true,
            cell: (e) => {
                if(e.thread.interestedUser.id !== user.sub) {
                    return <>{e.thread.interestedUser.email} ({e.thread.interestedUser.firstName} {e.thread.interestedUser.lastName})</>
                }
                return <>{e.thread.jobOrder.principal.email} ({e.thread.jobOrder.principal.firstName} {e.thread.jobOrder.principal.lastName})</>
            }
        },
        {
            name: 'Data ostatniej wiadomości',
            selector: 'sendTime',
            sortable: true,
            cell: (e) => {
                let lastMessageTime = new Date(e.sendTime);
                return <> {lastMessageTime.toLocaleTimeString()} {lastMessageTime.toLocaleDateString()}</>
            }
        },
    ]
    
    return (
        <Row style={{marginLeft: "0px"}} className={"w-100 mt-3  d-flex align-items-center"}>
            <Col md={11} className={"mx-auto"}>
            <DataTable columns={columns} data={threads} 
                       highlightOnHover
                       pagination
                       onRowClicked={(e) => history.push(`/thread/${e.thread.id}`)}
                       theme = "dark"/>
            </Col>
        </Row>
    )
    
}
export default ThreadsList;
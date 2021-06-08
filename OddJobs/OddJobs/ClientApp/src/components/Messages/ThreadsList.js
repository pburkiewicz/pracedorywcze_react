import React, {useState, useEffect} from "react";
import DataTable, { createTheme }  from 'react-data-table-component';
import authService from "../api-authorization/AuthorizeService";
import {Col, Row} from "reactstrap";
import {Link, useHistory} from "react-router-dom";
import Loading from "../Loading";

const ThreadsList = () => {
    const history = useHistory()
    const [threads, setThreads] = useState([]);
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
      
    });

    const customStyles = {
        rows: {
            style: {
                minHeight: '72px', 
            }
        },
        headCells: {
            style: {
                paddingLeft: '8px', 
                paddingRight: '8px',
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
        console.log(document.getElementsByClassName("sc-fnVZcZ fjcLNf rdt_TableHeader"));
        document.getElementsByClassName("sc-fnVZcZ fjcLNf rdt_TableHeader").item(0).remove();
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
                     <Link to={`/thread/${e.thread.id}`} className={"pt-1 pb-1"} style={{textDecoration: "none", color: "white"}}>
                        <strong>{e.thread.jobOrder.title}</strong>
                        <br/>
                        {messageText}
                     </Link>
                )
            }, 
        },
        {
            name: 'Użytkownik',
            selector: 'interestedUser',
            sortable: true,
            cell: (e) => {
                if(user) {
                    if (e.thread.interestedUser.id !== user.sub) {
                        return `${e.thread.interestedUser.email} (${e.thread.interestedUser.firstName} ${e.thread.interestedUser.lastName})`
                    }
                    return `${e.thread.jobOrder.principal.email} (${e.thread.jobOrder.principal.firstName} ${e.thread.jobOrder.principal.lastName})`
                }
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
    
    
    if( threads.length){
        return (
            <Row style={{marginLeft: "0px"}} className={"w-100 mt-3  d-flex align-items-center"}>
                <Col xs={11} className={"mx-auto"} style={{backgroundColor: "#393e46"}}>
                    <h4 className={"text-light mt-3 ml-2"}>Wiadomości</h4>
                    
                    <DataTable columns={columns} data={threads}
                                                       highlightOnHover
                                                       pagination
                                                       theme="solarized"
                                                       progressComponent={<Loading/>}
                                                       progressPending={false}
                                                       customStyles={customStyles}
                                                       onRowClicked={(e) => history.push(`/thread/${e.thread.id}`)}/>
                </Col>
            </Row>
        )
    }
    return <Loading text={"wiadomości"}/>
  
    
}
export default ThreadsList;
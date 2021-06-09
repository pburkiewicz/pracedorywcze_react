import React, {useState, useEffect} from 'react'
import {Link, useHistory} from "react-router-dom";
import {Button, Col, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faHandHoldingUsd,
    faClock,
    faExclamationTriangle,
    faMapMarkerAlt,
    faTrash,
    faEdit,
    faStarHalfAlt,
    faEnvelope,
    faCheckCircle,
    faBan,
    faUserCheck,
    faUserTie
} from "@fortawesome/free-solid-svg-icons";
import DetailsMap from "./DetailsMap";
import authService from "./api-authorization/AuthorizeService";

import './css/detailsStyle.css'
import LoadingCard from "./Loading";
import ReportJobPopup from "./Modals/ReportJobPopup";
import AssignWorkerPopup from "./Modals/AssignWorkerPopup";

const JobDetails = (props) => {
    const history = useHistory();
    const [job, setJob] = useState({});
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null);
    const [reportModal, setReportModal] = useState(false);
    const [assignWorkerModal, setAssignWorkerModal] = useState(false);
    
    const [modal, setModal] = useState(false);
    const [roles, setRoles] = useState(0);
    const [rerender,setRerender] = useState(true);
   
    useEffect( () => {
        (async () => {
            setUser(await authService.getUser());
        })();
        setUser( authService.getUser());
        fetch(`/joborder/api/${props.match.params.id}`)
            .then(async response => {
                if (!response.ok) {
                   setError(response.status);
                } else {
                    let order = await response.json();
                    order.startDate = new Date(order.startDate).toLocaleDateString();
                    order.registeredTime = new Date(order.registeredTime).toLocaleString();
                    setJob(order);
                    setRerender(false);
                }
            });
        identity();
    }, [rerender])
    
    

    const identity = async() =>
    {
        const token = await authService.getAccessToken()
        setRoles( await ((await fetch("jobOrder/fetchHighStatus/", {headers: !token ? {} : {'Authorization': `Bearer ${token}`}})).json()));
    }

    const findThread = async () => {
        const token = await authService.getAccessToken();
        
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        };
        
        fetch(`/message/api/${props.match.params.id}/getThread`, requestOptions)
            .then(async response => {
                let result = await response.json();
                if( result !== false){
                    history.push(`/thread/${result}`)
                    return;    
                }
                history.push(`./${job.id}/send`)
            })
        
    }
    
    const deleteJob = async() =>{
        const token = await authService.getAccessToken();
        fetch(`/joborder/api/${props.match.params.id}`,{method: "DELETE", headers: !token ? {} : { 'Authorization': `Bearer ${token}`}})
            .then(async response => {
                if (!response.ok) {
                    setError(response.status);
                } else {
                    history.push("/map")
                }
            });
    }
    
    const ReportReaction = async(status) =>{
        const token = await authService.getAccessToken();
        await fetch(`/joborder/ReportReaction/${job.id}/${status}`, {
            method: "PUT",
            headers: !token ? {} : {'Authorization': `Bearer ${token}`}
        });
        if (status === 0 )history.push("/list")
        else setRerender(true);
    }
    
    const makeDecisionButton = ()=>{
        return <div className="w-100 btn-group btn-group-toggle" data-toggle="buttons">
            <Link className={"btn text-light"}  onClick={() => ReportReaction(1)}>
                <FontAwesomeIcon className={"mr-1"} icon={faCheckCircle}/>Autoryzuj
            </Link>
            <Link className={"btn text-light"}  onClick={() => ReportReaction(0)}>
                <FontAwesomeIcon className={"mr-1"} icon={faBan}/>Zablokuj
            </Link>
        </div>;
    }
    
    const openReportModal = () => setReportModal(!reportModal);

    const openAssignWorkerModal = () => setAssignWorkerModal(!assignWorkerModal);

    const changeStatus = async () => {
        const token = await authService.getAccessToken();
        
        fetch(`/joborder/status/${props.match.params.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        }).then(response => {
            if(response.ok){
                setRerender(true);
            }
        })
    }
    
    let status = [<p className={"w-100 p-2 mb-0 text-center custom-button-green text-light "}>Zlecenie aktualne</p>];
    if (Object.keys(job).length !== 0) {
        if (user !== null && user.sub === job.principalId) {
            if (job.active) {
                status = [<p className={"w-100 p-2 mb-0 text-center custom-button-green text-light"}>Zlecenie aktualne</p>]
            } else {
                status = [<p className={"w-100 p-2 mb-0 text-center custom-button-red text-light"}>Zlecenie nieaktywne</p>]
            }
            status.push( <Link to={`./${job.id}/edit`} className={"w-100 btn text-light"} style={{borderBottomColor: "#6c757d", paddingBottom: "9px"}}>
                        <FontAwesomeIcon className={"mr-1"} icon={faEdit}/>Edytuj zlecenie
                       </Link>)
            status.push( <Link onClick={changeStatus} className={"w-100 btn text-light"} style={{borderBottomColor: "#6c757d", paddingBottom: "9px" }}>
                        <FontAwesomeIcon className={"mr-1"} icon={faStarHalfAlt}/>Zmień status
                       </Link>)
            status.push(<Link className={"w-100 btn text-light"}  onClick={openAssignWorkerModal} style={{borderBottomColor: "#6c757d", paddingBottom: "9px" }}>
                <FontAwesomeIcon className={"mr-1"} icon={faUserCheck}/>Zleć użytkownikowi</Link>)
            status.push(<Link className={"w-100 btn text-light"}  onClick={deleteJob}>
                        <FontAwesomeIcon className={"mr-1"} icon={faTrash}/>Usuń zlecenie
                       </Link>)
            status.push(<AssignWorkerPopup modal={assignWorkerModal} setModal={setAssignWorkerModal} setRefresh={setRerender} jobId={job.id} user={user}/>)

        }else{
            if (!job.active) {
                status = [<Button active={false} size="lg" block style={{backgroundColor: "#d9534f"}}>Zlecenie jest już
                    nieaktualne</Button>]
            }
            if(user !== null){
                status[1] = <Link onClick={findThread} className={"w-100 btn text-light"} style={{borderBottomColor: "#6c757d", paddingBottom: "9px" }}>
                            <FontAwesomeIcon className={"mr-1"} icon={faEnvelope}/>Skontaktuj się ze zleceniodawcą
                            </Link>
                switch (job.reported) {
                    case 0 :status[2] = <button className={"w-100 btn text-light"} onClick={openReportModal}>
                            <FontAwesomeIcon className={"mr-1"} icon={faBan}/>Zgłoś</button>
                        break;
                    case 1 : status[2] = <p className={"w-100 p-2 mb-0 text-center  custom-button-red text-light"}>
                        <FontAwesomeIcon className={"mr-1"} icon={faExclamationTriangle}/>Oferta została zgłoszona</p>
                        if (roles) status[3] = makeDecisionButton();
                        break;
                    case 2 : status[2] = <p className={"w-100 p-2 mb-0 text-center custom-button-green text-light"}>
                        <FontAwesomeIcon className={"mr-1"} icon={faCheckCircle}/>Oferta autoryzowana przez administrację</p>
                }
                status[3] = <ReportJobPopup modal={reportModal} setModal={setReportModal} id={job.id} user={user} setRerender={setRerender}/>
            }
        }
    }

    if(error == null) {
        if (Object.keys(job).length === 0) {
            return <LoadingCard text={"zlecenie"}/>
        }
    }
    
    if (error != null) {
        if (error === 404) {
            return <div className="w-100 mt-3 d-flex align-items-center ">
                <div className="alert alert-danger w-50 mx-auto bg-dark" role="alert">
                    <Row>
                        <Col sm={2}>
                            <FontAwesomeIcon icon={faExclamationTriangle} size={"5x"} className="mx-auto"
                                             color={"#d9534f"}/>
                        </Col>
                        <Col sm={10}>
                            <h4 className="alert-heading text-light">Nie znaleziono zlecenia</h4>
                            <p className={"text-light"}>Poszukaj nowych zleceń na mapie</p>
                        </Col>
                    </Row>
                </div>
            </div>
        }
        return <div className="w-100 mt-3 d-flex align-items-center">
            <div className="alert alert-danger w-50 mx-auto bg-dark" role="alert">
                <Row>
                    <Col sm={2}>
                        <FontAwesomeIcon icon={faExclamationTriangle} size={"5x"} className="mx-auto"
                                         color={"#d9534f"}/>
                    </Col>
                    <Col sm={10}>
                        <h4 className="alert-heading text-light">Wystąpił błąd</h4>
                        <p className={"text-light"}>Kod błędu: {error}</p>
                    </Col>
                </Row>
            </div>
        </div>
    }
    
    return (
        <Row className="d-flex justify-content-center w-100 mt-3 text-light job-details">
            <Col md={6} className={" p-3 job-card"}>
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
                {job.workerId != null ?
                    <Row className={"pt-1 pb-2"}>
                        <Col md={12}>
                            <FontAwesomeIcon icon={faUserTie} size={"1x"} color={"#4aba70"}/>
                            <span className={"ml-2"}>Zlecono: {job.worker.firstName} {job.worker.lastName} ({job.worker.email})</span>
                        </Col>
                    </Row>
                    :
                    []
                }
                <hr className={"bg-secondary mb-1 mt-1"}/>
                <h6 className={"mt-2 mb-1"}><b>Opis: </b></h6>
                <p style={{whiteSpace: "pre-line"}}>{job.description}</p>
            </Col>
            <Col md={4} className={"ml-3"}>
                <Row className={"bg-dark mb-3"}>
                    {status}
                </Row>
                <Row className={"bg-dark"} style={{height: "300px"}}>
                    <DetailsMap latitude={job.latitude} longitude={job.longitude}/>
                </Row>
            </Col>

        </Row>
    )
}
export default JobDetails;
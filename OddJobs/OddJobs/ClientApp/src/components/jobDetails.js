import React, {useState, useEffect} from 'react'
import {Link, useHistory} from "react-router-dom";
import {Button, Col, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faSpinner,
    faHandHoldingUsd,
    faClock,
    faExclamationTriangle,
    faMapMarkerAlt,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import DetailsMap from "./DetailsMap";
import authService from "./api-authorization/AuthorizeService";

import './css/detailsStyle.css'

const JobDetails = (props) => {
    const history = useHistory();
    const [job, setJob] = useState({});
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null);
    
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
                }
            });
    }, [])
    
    const deleteJob = () =>{
        fetch(`/joborder/api/${props.match.params.id}`,{method: "DELETE"})
            .then(async response => {
                if (!response.ok) {
                    setError(response.status);
                } else {
                    history.push("/map")
                }
            });
    }
    
    let status = <Button type={"link"} size="lg" block>Skontaktuj się ze zleceniodawcą</Button>;
    if (Object.keys(job).length !== 0) {
        if (!job.active) {
            status = <Button active={false} size="lg" block style={{backgroundColor: "#d9534f"}}>Zlecenie jest już
                nieaktualne</Button>
        }
        if (user !== null && user.sub === job.principalId) {
            if (job.active) {
                status = [<Link to={"#"} className={"w-100 btn custom-button-green text-light"}>Zlecenie aktywne - zmień status</Link>]
            } else {
                status = [<Link to={"#"} className={"w-100 btn custom-button-red "}>Zlecenie nieaktywne - zmień status -
                    zmień</Link>]
            }
            status[1]= <Link className={"w-100 btn custom-button-red text-light"}  onClick={deleteJob}><FontAwesomeIcon icon={faTrash}/>Usuń zlecenie</Link>
        }
    }

    if(error == null) {
        if (Object.keys(job).length === 0) {
            return (<div className="w-100 mt-3 d-flex align-items-center">
                <div className="alert alert-success w-50 mx-auto bg-dark" role="alert">
                    <Row>
                        <Col sm={2}>
                            <FontAwesomeIcon icon={faSpinner} size={"5x"} className="mx-auto" color={"#4aba70"}/>
                        </Col>
                        <Col sm={10}>
                            <h4 className="alert-heading text-light">Ładujemy zlecenie</h4>
                            <p className={"text-light"}>Daj nam jeszcze chwileczkę :)</p>
                        </Col>
                    </Row>
                </div>
            </div>)
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
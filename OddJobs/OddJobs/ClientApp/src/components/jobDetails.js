import React, {useState, useEffect} from 'react'
import {Button, Col, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoneyBill, faHandHoldingUsd, faDollarSign, faClock, faCalendarDay, faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";
import FormMap from "./FormMap";

import './css/detailsStyle.css'
const JobDetails = (props) => {
    const [job, setJob] = useState({});
    useEffect(  () => {
         fetch(`/joborder/get/${props.match.params.id}`)
            .then(async response =>{
                if(!response.ok){
                    // return (<div className="w-100 h-100 d-flex align-items-center">
                    //     <div className="alert alert-error w-50 mx-auto bg-dark" role="alert">
                    //         <Row>
                    //             <Col sm={2}>
                    //                 <FontAwesomeIcon icon={faExclamationTriangle} size={"5x"} className="mx-auto" color={"#d9534f"}/>
                    //             </Col>
                    //             <Col sm={10}>
                    //                 <h4 className="alert-heading text-light">Nie znaleziono zlecenia</h4>
                    //                 <p className={"text-light"}>Poszukaj nowych zleceń na mapie</p>
                    //             </Col>
                    //         </Row>
                    //     </div>
                    // </div> )
                }else{
                    let order = await response.json();
                    order.startDate = new Date(order.startDate).toLocaleDateString();
                    order.registeredTime = new Date(order.registeredTime).toLocaleString();
                    setJob(order);
                }
            });
    },[])
    
    return (
        // <div className="d-flex justify-content-center w-100 h-100" >
            <Row className="d-flex justify-content-center w-100 mt-3 text-light job-details" >
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
                    <p>{job.description}</p>
                </Col>
                <Col md={4} className={"ml-3"}>
                    <Row className={"bg-dark mb-3"}>
                        <Button type={"link"} className={"w-100"}>Skontaktuj się ze zleceniodawcą</Button>
                    </Row>
                    <Row className={"bg-dark"} style={{height: "300px"}}>
                        <FormMap />
                    </Row>
                </Col>
                
            </Row>
        // </div>
        // <div className="container">
        //     <Row style={{marginLeft: "0px", marginTop:"100px"}} className={"w-100 h-100"}>
        //         <div className="col-md-5">
        //             <div className="bg-dark mt-0">
        //                 <h5>{job.title}</h5>
        //                 <p className="mb-0">{job.description}</p>
        //             </div>
        //             <div className="bg-dark mt-2">
        //                 <p><b>Date:</b> 14.02.2020</p>
        //                 <p><b>Designer:</b> James Doe</p>
        //                 <p><b>Tools:</b> Illustrator</p>
        //                 <p className="mb-0"><b>Budget:</b> $500</p>
        //                 <p onClick={(e) => console.log(job)}><b>Client:</b> {job.address}</p>
        //             </div>
        //             <div className=" mt-2 mb-0">
        //                 <p className="bg-dark mb-0">
        //                     <span className="fw-bold mr-10 va-middle hide-mobile">Share:</span>
        //                     <a href="#x" className="btn btn-xs btn-facebook btn-circle btn-icon mr-5 mb-0"><i
        //                         className="fab fa-facebook-f"></i></a>
        //                     <a href="#x" className="btn btn-xs btn-twitter btn-circle btn-icon mr-5 mb-0"><i
        //                         className="fab fa-twitter"></i></a>
        //                     <a href="#x" className="btn btn-xs btn-pinterest btn-circle btn-icon mr-5 mb-0"><i
        //                         className="fab fa-pinterest"></i></a>
        //                     <a href="#x" className="btn btn-xs btn-linkedin btn-circle btn-icon mr-5 mb-0"><i
        //                         className="fab fa-linkedin-in"></i></a>
        //                 </p>
        //             </div>
        //         </div>
        //         <div className="col-md-7">
        //             <img src="https://via.placeholder.com/400x300/FFB6C1/000000" alt="project-image"
        //                  className="rounded"/>
        //                 <div className=" bg-dark project-info-box mt-2">
        //                     <p><b>Categories:</b> Design, Illustration</p>
        //                     <p><b>Skills:</b> Illustrator</p>
        //                 </div>
        //         </div>
        //     </Row>
        // </div>
    )
}
export default JobDetails;
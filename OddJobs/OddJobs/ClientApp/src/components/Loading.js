import {Col, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import React from "react";

const LoadingCard = () => {
    return (
    <div className="w-100 mt-3 d-flex align-items-center">
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
    </div>
    )
}
export default LoadingCard;
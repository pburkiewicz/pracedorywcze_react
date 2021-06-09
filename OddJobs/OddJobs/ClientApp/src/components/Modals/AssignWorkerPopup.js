import React, {useState, useEffect} from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Row,
    Col,
} from 'reactstrap';
import authService from "../api-authorization/AuthorizeService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle, faHeartBroken} from "@fortawesome/free-solid-svg-icons";

const AssignWorkerPopup = ({setModal, modal, setRefresh, jobId}) => {
    const [users, setUsers] = useState([]);
    const [worker, setWorker] = useState({});
    const toggle = () => setModal(!modal);
    
    const findInterestedUsers = async () => {
        const token = await authService.getAccessToken();
        fetch(`/message/api/${jobId}/getInterestedUsers`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        }).then(async response => {
            if(response.ok){
                let res = await response.json();
                setUsers(res);
            }
        })
    }

    useEffect( async () => {console.log("AAA"); await findInterestedUsers()},[]);
    
    const assignWorker = async () => {
        if(worker == 0 || Object.keys(worker).length === 0) {
            setWorker(0);
            return ;
        }
        
        console.log(worker)
        
        const token = await authService.getAccessToken();
        fetch(`/joborder/api/${jobId}/assignWorker`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify(worker)
        }).then(async response => {
            if(response.ok) {
                setModal(false);
                setRefresh(true);
            }
        });
    }
    
    const options = users.map(user => <option value={user.id}>{user.firstName} {user.lastName} ({user.email})</option>)
    
    const body = users.length ? <> Zleć pracę użytkownikowi z listy zainteresowanych Twoim zleceniem.
    <Input className={"mt-2"} type="select" id="exampleCustomSelect" name="customSelect"
           onChange={(e) => setWorker(e.target.value)} invalid={ worker == 0 ? true: false}>
        <option value="0" className={"text-secondary"}>Wybierz użytkownika</option>
        {options}
    </Input>
    {worker == 0 ? <small className={"text-danger"}>Musisz wybrać użytkownika</small> : console.log(worker)}
    <div className="alert alert-danger w-100 mx-auto bg-dark mt-4 " role="alert">
        <Row>
            <Col sm={2} className={"d-flex align-items-center"}>
                <FontAwesomeIcon icon={faExclamationTriangle} size={"3x"} className="mx-auto"
                                 style={{verticalAlign: "middle"}} color={"#d9534f"}/>
            </Col>
            <Col sm={10}>
                <h5 className="alert-heading text-light">Pamiętaj</h5>
                <p className={"text-light mb-0"}>Twoje zlecenie stanie się nieaktualne. W każdej chwili możesz zmienić zleceniobiorcę.</p>
            </Col>
        </Row>
    </div>
    </> : <div className="alert alert-danger w-100 mx-auto bg-dark mt-4 " role="alert">
        <Row>
            <Col sm={2} className={"d-flex align-items-center"}>
                <FontAwesomeIcon icon={faHeartBroken} size={"3x"} className="mx-auto"
                                 style={{verticalAlign: "middle"}} color={"#d9534f"}/>
            </Col>
            <Col sm={10}>
                <h5 className="alert-heading text-light">Bardzo nam przykro</h5>
                <p className={"text-light mb-0"}>Niestety żaden użytkownik nie jest jezcze zainteresowany Twoją ofertą. Spróbuj później.</p>
            </Col>
        </Row>
    </div>
    
    return (
        <Modal isOpen={modal} toggle={toggle} className={"text-light"} rounded>
            <ModalHeader className={"bg-dark border-bottom border-secondary"} toggle={toggle}>Zleć użytkownikowi</ModalHeader>
            <ModalBody className={"bg-dark"}>
                {body}
            </ModalBody>
            <ModalFooter  className={"bg-dark border-top border-secondary"}>
                {users.length ? <Button color="secondary" onClick={assignWorker}>Zleć użytkownikowi</Button> : []}
                <Button style={{backgroundColor: "#212529", borderColor: "#212529"}} onClick={toggle}>Anuluj</Button>
            </ModalFooter>
        </Modal>
    );
}
export default AssignWorkerPopup;
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import authService from "./api-authorization/AuthorizeService";

const ReportJobPopup = ({setModal, modal, id, user}) => {
  
    // const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);
    
    const reportJob = async () => {
        console.log(user.sub)
        const token = await authService.getAccessToken();
        fetch(`/joborder/report/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify(user.sub)
        }).then(response => {
            if(response.ok){
                console.log("zgłoszono");
            }
            setModal(false);
        })
    }
    
    return (
            <Modal isOpen={modal} toggle={toggle} className={"text-light"} rounded>
                <ModalHeader className={"bg-dark border-bottom border-secondary"} toggle={toggle}>Zgłoś zlecenie</ModalHeader>
                <ModalBody className={"bg-dark"}>
                    Jeżeli uważasz, że zlecenie jest niezgodne z obowiązującym prawem oraz regulaminem serwisu możesz je zgłosić.
                    Pamiętaj, że zgłaszając zlecenie administrator będzie miał możliwość skontaktowania się z Tobą w celu weryfikacji zgłoszenia.
                </ModalBody>
                <ModalFooter  className={"bg-dark border-top border-secondary"}>
                    <Button color="danger"  onClick={reportJob}>Zgłoś</Button>
                    <Button style={{backgroundColor: "#212529", borderColor: "#212529"}} onClick={toggle}>Anuluj</Button>
                </ModalFooter>
            </Modal>
    );
}
export default ReportJobPopup;
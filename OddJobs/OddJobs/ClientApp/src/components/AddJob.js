import React, {useState} from 'react'
import {Col, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import FormMap from "./FormMap";
import authService from "./api-authorization/AuthorizeService";
import './css/formStyle.css'
import {useHistory} from "react-router-dom";

const AddJobForm = () => {
    const history = useHistory();
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [proposedPayment, setProposedPayment] = useState("")
    const [date, setDate] = useState()
    const [address, setAddress] = useState("");
    const [coordinates, setCoordinates] = useState({lat: null, lng: null});
    const handleSubmit = async (event) => {
        event.preventDefault();
        const user =await authService.getUser();
        
        if(description.length > 2000 || title.length > 200 ) return ;
        let jobOrder = {
                Title: title,
                Description: description,
                Date: date,
                ProposedPayment: proposedPayment,
                Lat: coordinates.lat,
                Lng: coordinates.lng,
                Address: address,
                User: user.sub
        }
        const token = await authService.getAccessToken();
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify(jobOrder)
        };
        fetch('/joborder/add', requestOptions).then(async (response)=>{
            if(response.ok){
                
                let job = await response.json();
                history.push( `/jobOrder/${job.id}`);
            }
        });
        
    }
    
    return (
        <Row style={{marginLeft: "0px"}} className={"w-100 mt-3  d-flex align-items-center"}>
            <Form style={{width: '80%'}} className={"mx-auto"} onSubmit={handleSubmit} >
                <Row>
                    <h4  className={" mx-auto text-light pb-4"}>Dodaj zlecenie</h4>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            {/*<Label for="Title">Tytuł</Label>*/}
                            <Input name="Tytuł" onChange={(e) => setTitle(e.target.value)} id="title" placeholder="Tytuł" invalid={title.length >= 200}/>
                            {title.length >= 200 ? <FormText className={"text-danger"}>max. 200 znaków ({title ? title.length : 0}/200)</FormText> :[]}
                        </FormGroup>
                        <FormGroup>
                            {/*<Label for="Description">Opis zlecenia</Label>*/}
                            <Input type="textarea" style={{resize: "none"}} onChange={(e) => setDescription(e.target.value)}
                                   name="Description" id="description" placeholder="Opis Zlecenia" rows={10} invalid={ description.length >= 2000}/>
                            {description.length >= 2000 ? <FormText className={"text-danger"}>max. 2000 znaków ({description ? description.length : 0}/2000)</FormText> :[]}
                        </FormGroup>
                        <FormGroup>
                            <div className="input-icon input-icon-right">
                                <Input type="number" onChange={(e) => setProposedPayment(e.target.value)}
                                       name="salary" id="salary" placeholder="Wynagrodzenie" step="0.01" min="0" />
                                <i className={"text-light"}>zł</i>
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <Input onChange={(e) => setDate(e.target.value)} placeholder="Data rozpoczęcia zlecenia" name="date" id="date" 
                                   onFocus={(e) => {e.target.type='date'}} 
                                   onBlur={(e) => { if(!e.target.value) e.target.type='text'}}/>
                        </FormGroup>
                    </Col>
                <Col>
                    <FormGroup>
                        {/*<Label for="address">Adres</Label>*/}
                        <Input type="text" value={address} className={"disabled"} name="address" id="address" placeholder={"Wybierz adres na mapie"} disabled />
                    </FormGroup>
                    <div className={"w-100"} style={{height: "84%"}}>
                        <FormMap setAddress={setAddress} setCoordinates={setCoordinates}/>
                    </div>
                </Col>
                </Row>
                <Row mt={3}>
                    <Col>
                        <FormGroup className={"w-100 mb-0"} style={{paddingBottom: "0 !important"}}>
                            <Input type="submit" className={"btn btn-block custom-button-green btn-lg w-100"} value="Dodaj"/>
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
        </Row>
    )
};
export default AddJobForm;


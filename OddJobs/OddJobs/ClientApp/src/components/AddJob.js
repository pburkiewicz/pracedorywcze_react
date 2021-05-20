import React, {useState} from 'react'
import {Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import SmallMap from "./SmallMap";
import {OpenStreetMapProvider} from "leaflet-geosearch";
import authService from "./api-authorization/AuthorizeService";
import './css/formStyle.css'

const AddJobForm = () => {
    const [title, setTitle] = useState()
    const [description, setDescription] = useState()
    const [salary, setSalary] = useState()
    const [date, setDate] = useState()
    const [address, setAddress] = useState();
    const [coordinates, setCoordinates] = useState({lat: null, lng: null});

    const handleSubmit = async (event) => {
        event.preventDefault();
        const user =await authService.getUser();
        let jobOrder = {
                Title: title,
                Description: description,
                Date: date,
                Salary: salary,
                Lat: coordinates.lat,
                Lng: coordinates.lng,
                Address: address,
                User: user.sub
        }
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(jobOrder)
        };
        const response = await fetch('https://localhost:5001/joborder/add', requestOptions);
        console.log(response);
    }
    
    return (
        <Row style={{marginLeft: "0px"}} className={"w-100 h-100  d-flex align-items-center"}>
            <Form style={{width: '80%'}} className={"mx-auto "} onSubmit={handleSubmit} >
                <Row>
                    <h4  className={" mx-auto text-light pb-4"}> Dodaj zlecenie</h4>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            {/*<Label for="Title">Tytuł</Label>*/}
                            <Input name="Tytuł" onChange={(e) => setTitle(e.target.value)} id="title" placeholder="Tytuł"/>
                        </FormGroup>
                        <FormGroup>
                            {/*<Label for="Description">Opis zlecenia</Label>*/}
                            <Input type="textarea" onChange={(e) => setDescription(e.target.value)} name="Description" id="description" placeholder="Opis Zlecenia" rows={10} />
                        </FormGroup>
                        <FormGroup>
                            {/*<Label for="salary">Wynagrodzenia</Label>*/}
                            <Input type="number" onChange={(e) => setSalary(e.target.value)} name="salary" id="salary" placeholder="Wynagrodzenie" step="0.01" min="0"/>
                        </FormGroup>
                        <FormGroup>
                            {/*<Label for="date">Data</Label>*/}
                            <Input onChange={(e) => setDate(e.target.value)} placeholder="Data rozpoczęcia zlecenia" name="date" id="date" onFocus={(e) => { console.log(e); e.target.type='date'}} onBlur={(e) => { if(!e.target.value) e.target.type='text'}}/>
                        </FormGroup>
                    </Col>
                <Col>
                    <FormGroup>
                        {/*<Label for="address">Adres</Label>*/}
                        <Input type="text" value={address} className={"disabled"} name="address" id="address" placeholder={"Wybierz adres na mapie"} disabled />
                    </FormGroup>
                    <div className={"w-100"} style={{height: "84%"}}>
                        <SmallMap setAddress={setAddress} setCoordinates={setCoordinates}/>
                    </div>
                </Col>
                </Row>
                <Row mt={3}>
                    <Col>
                        <FormGroup className={"w-100 mb-0"} style={{paddingBottom: "0 !important"}}>
                            <Input type="submit" className={"btn btn-block btn-lg w-100"} value="Dodaj"/>
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
        </Row>
    )
};
export default AddJobForm;


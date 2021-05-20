import React, {useState} from 'react'
import {Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import SmallMap from "./SmallMap";
import {OpenStreetMapProvider} from "leaflet-geosearch";
import authService from "./api-authorization/AuthorizeService";


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
        console.log(user);
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
        console.log("bbbb")
        const response = await fetch('https://localhost:5001/joborder/add', requestOptions);
        console.log(response)
        // const data = await response.json();

    }
    
    return (
        <Row style={{width: '100%', height: '100%'}} className={"w-100 h-100 d-flex align-items-center"}>
            <Form style={{width: '80%', height: '100%'}} className={"alert alert-success mx-auto bg-dark"} onSubmit={handleSubmit} >
                <Row>
                <Col>
                <FormGroup>
                    <Label for="Title">Tytuł</Label>
                    <Input name="Tytuł" onChange={(e) => setTitle(e.target.value)} id="title" placeholder="Tytuł"/>
                </FormGroup>
                <FormGroup>
                    <Label for="Description">Opis zlecenia</Label>
                    <Input type="textarea" onChange={(e) => setDescription(e.target.value)} name="Description" id="description" placeholder="Opis Zlecenia"/>
                </FormGroup>
                <FormGroup>
                    <Label for="salary">Wynagrodzenia</Label>
                    <Input type="number" onChange={(e) => setSalary(e.target.value)} name="salary" id="salary" placeholder="Wynagrodzenie" step="0.01"/>
                </FormGroup>
                <FormGroup>
                    <Label for="date">Data</Label>
                    <Input type="date" onChange={(e) => setDate(e.target.value)} name="date" id="date"/>
                </FormGroup>
                <FormGroup>
                    <Label for="address">Adres</Label>
                    <Input type="text" value={address} name="address" id="address" placeholder={"Wybierz adres na mapie"} disabled/>
                </FormGroup>
                </Col>
                <Col>
                <FormGroup style={{height: "400px", width: "600px"}}>
                    <SmallMap setAddress={setAddress} setCoordinates={setCoordinates}/>
                </FormGroup>
                </Col>
                </Row>
                <Row>
                    <FormGroup>
                        <Input type="submit" value="Dodaj"/>
                    </FormGroup>
                </Row>
            </Form>
        </Row>
    )
};
export default AddJobForm;


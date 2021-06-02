import React, {useState, useEffect} from 'react'
import {Col, Form, FormGroup, FormText, Input, Label, Row, Tooltip} from "reactstrap";
import FormMap from "./FormMap";
import authService from "./api-authorization/AuthorizeService";
import './css/formStyle.css'
import {useHistory} from "react-router-dom";
import LoadingCard from "./Loading";

const EditJobForm = (props) => {
    const history = useHistory();
    const [title, setTitle] = useState()
    const [description, setDescription] = useState()
    const [proposedPayment, setProposedPayment] = useState()
    const [date, setDate] = useState()
    const [address, setAddress] = useState();
    const [coordinates, setCoordinates] = useState({lat: null, lng: null});
    const [error, setError] = useState(null);
    const [job, setJob] = useState(null);

    const [tooltipOpen, setTooltipOpen] = useState({
        title: false,
        descriptions: false,
        payment: false,
        date: false,
        address: false
    })
    
    useEffect(() => {
        fetch(`/joborder/api/${props.match.params.id}`)
            .then(async response => {
                if (!response.ok) {
                    setError(response.status);
                } else {
                    let order = await response.json();
                    order.startDate = new Date(order.startDate).toLocaleDateString();
                    order.registeredTime = new Date(order.registeredTime).toLocaleString();
                    console.log(order);
                    setTitle(order.title);
                    setDescription(order.description);
                    setProposedPayment(order.proposedPayment);
                    setDate(order.startDate);
                    setAddress(order.address);
                    setCoordinates({lat: order.latitude, lng: order.longitude})
                    setJob(order);
                }
            });
    }, [])
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const user =await authService.getUser();
        let correctDate = date;
        let parts = date.toString().split('.');
        if(parts.length > 1) correctDate =new Date(parts[2],parts[1], parts[0] ).toISOString();
        let jobOrder = {
            Title: title,
            Description: description,
            Date: correctDate, 
            ProposedPayment: proposedPayment,
            Lat: coordinates.lat,
            Lng: coordinates.lng,
            Address: address,
            User: user.sub
        }
        const token = await authService.getAccessToken();
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify(jobOrder)
        };
        fetch(`/joborder/api/${props.match.params.id}`, requestOptions).then(async (response)=>{
            if(response.ok){
                history.push( `/jobOrder/${props.match.params.id}`);
            }
        });

    }
    if(job != null) {
        return (
            <Row style={{marginLeft: "0px"}} className={"w-100 mt-3  d-flex align-items-center"}>
                <Form style={{width: '80%'}} className={"mx-auto "} onSubmit={handleSubmit}>
                    <Row>
                        <h4 className={" mx-auto text-light pb-4"}>Edytuj zlecenie</h4>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup >
                                {/*<Label for="Title" className={"text-light mb-1"}>Tytuł</Label>*/}
                                <Input name="Tytuł" value={title} onChange={(e) => setTitle(e.target.value)}
                                       id="TitleId" placeholder="Tytuł"/>
                                
                                {/*<p>Somewhere in here is a <span style={{textDecoration: "underline", color:"blue"}} href="#" id="TooltipExample">tooltip</span>.</p>*/}
                                <Tooltip placement="left" isOpen={tooltipOpen.title} target="TitleId" 
                                         toggle={() => setTooltipOpen({title: !tooltipOpen.title})}>
                                    Tytuł
                                </Tooltip>
                            </FormGroup>
                            <FormGroup>
                                {/*<Label for="Description" className={"text-light  mb-1"}>Opis zlecenia</Label>*/}
                                <Input type="textarea" value={description} style={{resize: "none"}}
                                       onChange={(e) => setDescription(e.target.value)} name="Description"
                                       id="DescriptionId" placeholder="Opis Zlecenia" rows={10}/>
                                <Tooltip placement="left" isOpen={tooltipOpen.description} target="DescriptionId" 
                                         toggle={() => setTooltipOpen({description: !tooltipOpen.descriptions})}>
                                    Opis Zlecenia
                                </Tooltip>
                            </FormGroup>
                            <FormGroup>
                                {/*<Label for="salary" className={"text-light mb-1"}>Wynagrodzenia</Label>*/}
                                <div className="input-icon input-icon-right">
                                    <Input type="number" value={proposedPayment}
                                           onChange={(e) => setProposedPayment(e.target.value)} name="payment" id="PaymentId"
                                           placeholder="Wynagrodzenie" step="0.01" min="0"/>
                                    <i className={"text-light"}>zł</i>
                                </div>

                                <Tooltip placement="left" isOpen={tooltipOpen.payment} target="PaymentId"
                                         toggle={() => setTooltipOpen({payment: !tooltipOpen.payment})}>
                                    Wynagrodzenie
                                </Tooltip>
                            </FormGroup>
                            <FormGroup>
                                {/*<Label for="date" className={"text-light mb-1"}>Data rozpoczecia zlecenia</Label>*/}
                                <Input value={date} onChange={(e) => setDate(e.target.value)}
                                       placeholder="Data rozpoczęcia zlecenia" name="date" id="DateId" 
                                       onFocus={(e) => {e.target.type = 'date'}} 
                                       onBlur={(e) => {if(!e.target.value) e.target.type = 'text'}}/>
                                <Tooltip placement="left" isOpen={tooltipOpen.date} target="DateId"
                                         toggle={() => setTooltipOpen({date: !tooltipOpen.date})}>
                                    Data rozpoczęcia zlecenia
                                </Tooltip>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                {/*<Label for="address" className={"text-light mb-1"}>Adres</Label>*/}
                                <Input type="text" value={address} className={"disabled"} name="address" id="AddressId"
                                       placeholder={"Wybierz adres na mapie"} disabled/>
                                <Tooltip placement="left" isOpen={tooltipOpen.address} target="AddressId"
                                         toggle={() => setTooltipOpen({address: !tooltipOpen.address})}>
                                    Wybierz adres na mapie
                                </Tooltip>
                            </FormGroup>
                            <div className={"w-100"} style={{height: "84%"}}>
                                <FormMap setAddress={setAddress} address={job.address} 
                                         setCoordinates={setCoordinates} coordinates={[job.latitude,job.longitude]}/>
                            </div>
                        </Col>
                    </Row>
                    <Row mt={3}>
                        <Col>
                            <FormGroup className={"w-100 mb-0"} style={{paddingBottom: "0 !important"}}>
                                <Input type="submit" className={"btn btn-block custom-button-green btn-lg w-100"}
                                       value="Edytuj"/>
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
            </Row>
        )
    }
    return <LoadingCard />
};
export default EditJobForm;


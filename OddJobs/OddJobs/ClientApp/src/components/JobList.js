import React, {useState, useEffect} from "react";
import DataTable from 'react-data-table-component';
import {
    faLink, faPhone
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const columns = [
    {
        name: 'Tytuł',
        selector: 'title',
        sortable: true,
        center: true
        
    },
    {
        name: 'Opis',
        selector: 'description',
        center: true
    },
    {
        name: 'Wynagrodzenie',
        selector: 'payment',
        sortable: true,
        center: true
    },
    {
        name: 'Aktywne Do',
        selector: 'activeData',
        sortable: true,
        center: true
    },
    {
        name: 'Odległość',
        selector: 'distance',
        sortable: true,
        center: true
    },
    {
        name: 'Szczegóły',
        selector: 'link',
        center: true,
        cell: row => 
            <a href={row.link}>
                <FontAwesomeIcon icon={faLink}  size="3x"/>
            </a>
    }
];

function JobList (props) {

    const [position,setPosition] = useState(null);
    const [jobs,setJobs] = useState(null);
    const [loading, setLoading] = useState( true);
    const [buff,setBuff] = useState( 5);
    const [clicked, setClicked] = useState(["active","",""]);
    const [content,setContent] = useState(null);
    const [address,setAddress] = useState("");
    
    useEffect(()=>{
        localize();
    },[])
    useEffect(()=>{
        setLoading(true);
        fetchData();
    },[position])


    const renderJobTable = (jobs) => {
        if (!jobs.length)
        {
            return <h3 style={{color: props.color}}>Niestety w tej okolicy nie ma żadnych dostępnych zleceń...</h3>
        }
        return <DataTable
            highlightOnHover
            pagination
            theme = "dark"
            title="Zlecenia w twojej okolicy"
            columns={columns}
            data={jobs}
        />;
    }

    const localize = () => {
        navigator.geolocation.getCurrentPosition(getPosition);
    }

    const getPosition =(pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude] );
    }

    const fetchData = async() => {
        if (position==null) return;
        const response = await fetch("jobOrder/fetchData/" +
            position[0] +
            "/" + position[1] +
            "/" + buff);
        const jobs =await response.json();
        const data = connectWithDistance(jobs);;
        setJobs( data);
        setLoading(false);
    }

    const connectWithDistance = (jobs) => {
        const data = [];
        jobs.map( construct =>
        {
            const job = construct['item1'];
            data.push({
                title: job['title'] ,
                description: job['description'],
                payment: job['proposedPayment'],
                activeData: job['expirationTime'],
                distance:construct['item2'],
                link:'/list/' + job['id'],
            })
        })
        return data;
    }

    

    useEffect(() => {
        setContent( loading
            ?
            <h2 style={{color: props.color}}><em>Proszę czekać, trwa pobieranie dostępnych ofert z serwera...</em></h2>
            : renderJobTable(jobs));
    },[loading]);
            


   const changeBuff = (num) =>
   {
       let x = 5;
       if (num === 1)
       {
           x = 10;
           setClicked(["","active",""])
       }
       else if (num === 2)
       {
           x = 20;
           setClicked(["","","active"])
       }
       else
       {
           setClicked(["active","",""])
       }
       if (x!==buff)
       {
           setBuff(x);
           setLoading(true);
           fetchData();
       }
   }

    return (
        <div className="w-90 p-3">
            <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Address" value={address}/>
                    <div className="input-group-append">
                        <button className="btn btn-success" type="submit">Search</button>
                    </div>
            </div>
            <div className="row">
                <h1 className="col-md-6" style={{color: props.color}} id="tableLabel" >Dostępne prace</h1>
                <div className="col-md-6 btn-group btn-group-toggle" data-toggle="buttons">
                        <button className={"btn btn-primary btn-sm " + clicked[0]} onClick={() => changeBuff(0)}> 5 km</button>
                        <button className={"btn btn-primary btn-sm " + clicked[1]} onClick={() => changeBuff(1)}> 10 km</button>
                        <button className={"btn btn-primary btn-sm " + clicked[2]} onClick={() => changeBuff(2)}> 20 km</button>
                </div>
            </div>
        {content}
        </div>
    );
    
}

JobList.defaultProps = {
    color: "#d5d5d5"
}

export default JobList;

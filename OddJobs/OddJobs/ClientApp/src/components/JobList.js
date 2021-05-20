import React, {useState, useEffect} from "react";
import DataTable from 'react-data-table-component';

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
        center: true
    }
];

function JobList (props) {

    const [position,setPosition] = useState(null);
    const [jobs,setJobs] = useState(null);
    const [loading, setLoading] = useState( true);
    const [buff,setBuff] = useState( 20);
    const [content,setContent] = useState(null);
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
        console.log("start fetch\n");
        console.log("jobOrder/fetchData/" +
            position[0] +
            "/" + position[1] +
            "/" + buff);
        const response = await fetch("jobOrder/fetchData/" +
            position[0] +
            "/" + position[1] +
            "/" + buff);
        const jobs =await response.json();
        console.log(jobs);
        const data = connectWithDistance(jobs);
        console.log(data);
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
            
    console.log(position);        
    return (
        <div>
        <h1 style={{color: props.color}} id="tableLabel" >Dostępne prace</h1>
        {content}
        </div>
    );
    
}

JobList.defaultProps = {
    color: "#d5d5d5"
}

export default JobList;

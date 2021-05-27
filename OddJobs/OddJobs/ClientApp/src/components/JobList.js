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
    },[position, buff])


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
    
    const adrStr = (adr) =>
    {
        let adr_str = adr['city']+', ' +adr['road']
        if (adr['house_number']) adr_str+=', ' + adr['house_number'];
        adr_str+=', ' + adr['postcode'];
        return adr_str;
    }
    
    const getLocation= async() =>
    {
        
        const response =  await fetch("https://nominatim.openstreetmap.org/search?q="+address+ "&format=json&country=pl&limit=1&addressdetails=1");
        const info =await response.json();
        setPosition([info[0]['lat'],info[0]['lon']]);
        setAddress(adrStr(info[0]['address']));
    }    

    const getPosition =async(pos) => {
        const response =  await fetch("https://nominatim.openstreetmap.org/reverse?lat="+pos.coords.latitude+"&lon="+pos.coords.longitude + "&format=json&country=pl");
        const info =await response.json();
        setAddress(adrStr(info['address']));
        setPosition([pos.coords.latitude, pos.coords.longitude] );
    }

    const fetchData = async() => {
        if (position==null) return;
        const response = await fetch("jobOrder/fetchData/" +
            position[0] +
            "/" + position[1] +
            "/" + buff);
        const jobs =await response.json();
        const data = connectWithDistance(jobs);
        setJobs( data);
        setLoading(false);
    }

    const connectWithDistance = (jobs) => {
        const data = [];
        jobs.map( construct =>
        {
            const job = construct['item1'];
            const date = new Date(job['expirationTime']);
            data.push({
                title: job['title'] ,
                description: job['description'],
                payment: job['proposedPayment'],
                activeData: pad(date.getDate(),2) + '.' + pad(date.getMonth(),2) + ' '+ pad(date.getHours(),2) + ':' + pad(date.getMinutes(),2),
                distance:construct['item2'].toFixed(2) + ' km',
                link: '/jobOrder/' + job['id'],
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
       }
   }

    const  pad =(n, width, z) =>{
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    
    const handleInput = event =>
    {
        setAddress(event.target.value)
    }

    return (
        <div className="w-90 p-3">
            <div className="input-group mb-3">
                <input type="text" className="form-control" onChange={handleInput} placeholder="Address" value={address}/>
                    <div className="input-group-append">
                        <button className="btn btn-success" onClick={getLocation} type="submit">Search</button>
                    </div>
            </div>
            <div className="row">
                <h1 className="col-md-6" style={{color: props.color}} id="tableLabel" >Dostępne prace</h1>
                <div className="col-md-6 btn-group btn-group-toggle" data-toggle="buttons">
                        <button className={"btn btn-success btn-sm " + clicked[0]} onClick={() => changeBuff(0)}> 5 km</button>
                        <button className={"btn btn-success btn-sm " + clicked[1]} onClick={() => changeBuff(1)}> 10 km</button>
                        <button className={"btn btn-success btn-sm " + clicked[2]} onClick={() => changeBuff(2)}> 20 km</button>
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

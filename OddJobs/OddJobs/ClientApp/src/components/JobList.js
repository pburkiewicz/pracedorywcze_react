import React, {useEffect, useState} from "react";
import DataTable from 'react-data-table-component';
import {faLink} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import authService from "./api-authorization/AuthorizeService";


function JobList (props) {

    const [position,setPosition] = useState(null);
    const [jobs,setJobs] = useState(null);
    const [loading, setLoading] = useState( true);
    const [buff,setBuff] = useState( 5);
    const [clicked, setClicked] = useState(["active","",""]);
    const [content,setContent] = useState(null);
    const [address,setAddress] = useState("");
    const [myOrders,setMyOrders] = useState(false);
    const [user, setUser] = useState(null);
    const [columns, setColumns] = useState(null);
    const [reported, setReported] = useState(false);
    const [roles, setRoles] = useState(0);

    const conditionalRowStyles = [
        {
            when: row => row.status === false,
            style: {
                backgroundColor: 'darkred'
            }
        }];
    
    let col = [
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
        { name: 'Odległość',
            selector: 'distance',
            sortable: true,
            center: true,
            omit: false
        },
        {
            name: 'Status',
            selector: 'status',
            sortable: true,
            center: true,
            omit: true
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
    
    useEffect(()=>{
        setColumns(col);
        (async () => {
            setUser(await authService.getUser());
        })();
        setUser( authService.getUser());
        identity();
        localize();
    },[])

    useEffect(()=>{
        const len = col.length;
        if (myOrders===true) {
            col[len-3].omit = true;
            col[len-2].omit = false;
        }
        else {
            col[len-3].omit = false;
            col[len-2].omit = true;
        }
    setColumns(col);
    },[myOrders])
    
    useEffect(()=>{
        setLoading(true);
        fetchData();
    },[position, buff, myOrders, reported])


    const renderJobTable = (jobs) => {
        if (!jobs.length)
        {
            return <h3 style={{color: props.color}}>Brak dostępnych zleceń...</h3>
        }
        return <DataTable
            highlightOnHover
            pagination
            theme = "dark"
            conditionalRowStyles = {conditionalRowStyles}
            title="Zlecenia w twojej okolicy"
            columns={columns}
            data={jobs}
        />;
    }

    const localize = () => {
        navigator.geolocation.getCurrentPosition(getPosition);
    }
    
    const identity = async() =>
    {
        const token = await authService.getAccessToken()
        setRoles( await ((await fetch("jobOrder/fetchHighStatus/", {headers: !token ? {} : {'Authorization': `Bearer ${token}`}})).json()));
    }
    
    const adrStr = (adr) =>
    {
        return (adr['city']!==undefined ? adr['city'] + ', ': "") + (adr['road']!==undefined ? adr['road'] + ', ' : "")
            + (adr['house_number']!==undefined ? adr['house_number'] + ', ': "") + (adr['postcode']!==undefined ? adr['postcode'] : "");
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
        let response;
        if (myOrders===true)
        {
            if (user===null) window.location.replace('/authentication/login');
            response = await fetch("jobOrder/fetchData/" + user.name);
        }
        else {
            if (position == null) return;
            if (reported===true) {
                const token = await authService.getAccessToken()
                response = await fetch("jobOrder/fetchReported/" + position[0] + "/" + position[1], {method: "GET",  credentials: 'include',headers: !token ? {} : { 'Authorization': `Bearer ${token}`}});
            }
            else
            response = await fetch("jobOrder/fetchData/" +
                position[0] +
                "/" + position[1] +
                "/" + buff)
        }
        const jobs =await response.json();
        const data = connectWithDistance(jobs);
        setJobs( data);
        setLoading(false);
    }

    const connectWithDistance = (jobs) => {
        const data = [];
        if (myOrders)jobs.map( job =>
        {
            const date = new Date(job['expirationTime']);
            data.push({
                title: job['title'] ,
                description: job['description'],
                payment: job['proposedPayment'],
                activeData: pad(date.getDate(),2) + '.' + pad(date.getMonth(),2) + ' '+ pad(date.getHours(),2) + ':' + pad(date.getMinutes(),2),
                status: job['active']? 'aktywne' : 'wygasłe',
                link: '/jobOrder/' + job['id'],
            })
        })
        else jobs.map( construct =>
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
                        <button className="btn btn-success" onClick={getLocation} type="submit">Szukaj</button>
                    </div>
            </div>
            <div className="row">
                <h1 className="col-md-6" style={{color: props.color}} id="tableLabel" >{(myOrders === false) ? ((reported===false) ? 'Dostępne prace':"Zgłoszone zlecenia") : 'Twoje zlecenia'}</h1>
                
                
                    {
                        (myOrders === false && reported===false) ?
                            <div className="col-md-6 btn-group btn-group-toggle" data-toggle="buttons">
                                {(roles)?
                                <button className="btn btn-danger btn-sm "  onClick={() => setReported(true)}> Zgłoszone zlecenia</button> : null}
                                {(user) ?
                                <button className="btn btn-primary btn-sm "  onClick={() => setMyOrders(true)}> Moje zlecenia</button> : null}
                                <button className={"btn btn-success btn-sm " + clicked[0]} onClick={() => changeBuff(0)}> 5 km</button>
                                <button className={"btn btn-success btn-sm " + clicked[1]} onClick={() => changeBuff(1)}> 10 km</button>
                                <button className={"btn btn-success btn-sm " + clicked[2]} onClick={() => changeBuff(2)}> 20 km</button>
                            </div>
                        
                            : <div className="col-md-6 btn-group btn-group-toggle" data-toggle="buttons">
                                <button className="btn btn-primary btn-sm "  onClick={() => {setMyOrders(false); setReported(false)}}> Zlecenia </button>
                            </div>
                    }
                
            </div>
        {content}
        </div>
    );
    
}

JobList.defaultProps = {
    color: "#d5d5d5"
}

export default JobList;

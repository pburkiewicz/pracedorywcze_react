import React from "react";


class JobList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            position: [51.981497, 20.143433],
            jobs: null,
            loading: true,
            buff: 20
        };
 
        this.getPosition = this.getPosition.bind(this);        
    }
    componentDidMount() {
        this.localize();
    }

    render() {
        let contents = this.state.loading
            ? <h2 style={{color: this.props.color}}><em>Proszę czekać, trwa pobieranie dostępnych ofert z serwera...</em></h2>
            : this.renderJobTable(this.state.jobs);

        return (
            <div>
                <h1 style={{color: this.props.color}} id="tableLabel" >Dostępne prace</h1>
                {contents}
            </div>
        );
    }

    renderJobTable(jobs) {
        if (!jobs.length)
        {
            return <h3 style={{color: this.props.color}}>Niestety w tej okolicy nie ma żadnych dostępnych zleceń...</h3>
        }
        return <h1 style={{color: this.props.color}}>Succes</h1>;
    }

    localize() {
        navigator.geolocation.getCurrentPosition(this.getPosition);
    }

    getPosition(pos) {
        this.setState({
          position: [pos.coords.latitude, pos.coords.longitude]  
        })
        this.fetchData();
    }

    async fetchData() {
        console.log("start fetch\n");
        console.log("jobOrder/fetchData/" +
            this.state.position[0] +
            "/" + this.state.position[1] +
            "/" + this.state.buff);
        const response = await fetch("jobOrder/fetchData/" +
            this.state.position[0] +
            "/" + this.state.position[1] +
            "/" + this.state.buff);
        const jobs =await response.json();
        console.log(jobs);
        this.connectWithDistance(jobs);
        this.setState({
            jobs: jobs,
            loading: false
        })
    }

    connectWithDistance(jobs) {
        
    }
}

JobList.defaultProps = {
    color: "#d5d5d5"
}

export default JobList;

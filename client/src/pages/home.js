import React, { Component } from 'react'
import Grid from "@material-ui/core/Grid";
import axios from "axios";

// ======= Components =======
import Scribble from "../components/Scribble"

class home extends Component {
    state = {
        scribbles: null
    }

    componentDidMount() {
        axios.get("/scribbles")
            .then(res => {
                this.setState({
                    scribbles: res.data
                })
                console.log(res.data)
            })
            .catch(err => console.log(err));
    }

    render() {
        let recentScribblesMarkup = this.state.scribbles ? (
            this.state.scribbles.map(scribble => <Scribble key={scribble.scribbleId} scribble={scribble} />
            )) : <p>Loading...</p>
        return (
            <Grid container spacing={2}>
                <Grid item sm={4} xs={12}>
                    <p>Profile Goes Here</p>
                </Grid>
                <Grid item sm={8} xs={12}>
                    {recentScribblesMarkup}
                </Grid>
            </Grid>
        )
    }
}

export default home

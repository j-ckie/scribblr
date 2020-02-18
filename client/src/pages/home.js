import React, { Component } from 'react'

import Grid from "@material-ui/core/Grid";

import axios from "axios";

import Scribble from "../components/Scribble"

class home extends Component {
    state = {
        scribbles: null
    }

    componentDidMount() {
        axios.get("/scribbles")
            .then(res => {
                console.log(res.data)
                console.log("getting scribbles...")
                this.setState({
                    scribbles: res.data
                })
            })
            .catch(err => console.log(err));
    }

    render() {
        let recentScribblesMarkup = this.state.scribbles ? (
            this.state.scribbles.map(scribble => <Scribble scribble={scribble} />
            )) : <p>Loading...</p>
        return (
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                    {recentScribblesMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <p>Profile...</p>
                </Grid>
            </Grid>
        )
    }
}

export default home

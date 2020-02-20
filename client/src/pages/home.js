import React, { Component } from 'react'
import axios from "axios";

// ======= Material UI =======
// import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";

// ======= Components =======
import Scribble from "../components/Scribble"
import Profile from "../components/Profile"

// const styles = {
//     profileContainer: {
//         sticky: "top"
//     }
// }

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
                // console.log(res.data)
            })
            .catch(err => console.log(err));
    }

    render() {
        // const { classes } = this.props;

        let recentScribblesMarkup = this.state.scribbles ? (
            this.state.scribbles.map(scribble => <Scribble key={scribble.scribbleId} scribble={scribble} />
            )) : <p>Loading...</p>

        return (
            <Grid container spacing={2}>
                <Grid item sm={4} xs={12}>
                    <Profile />
                </Grid>
                <Grid item sm={8} xs={12}>
                    {recentScribblesMarkup}
                </Grid>
            </Grid>
        )
    }
}

// export default withStyles(styles)(home);

export default home;

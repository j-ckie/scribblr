import React, { Component } from 'react';
import PropTypes from "prop-types";

// ======= Material UI =======

import Grid from "@material-ui/core/Grid";

// ======= Components =======
import Scribble from "../components/Scribble"
import Profile from "../components/Profile"


// ======= redux =======
import { connect } from "react-redux";
import { getScribbles } from "../redux/actions/dataActions";

// const styles = {
//     profileContainer: {
//         sticky: "top"
//     }
// }

class home extends Component {


    componentDidMount() {
        this.props.getScribbles();
    }

    render() {
        const { scribbles, loading } = this.props.data

        let recentScribblesMarkup = !loading ? (
            scribbles.map(scribble => <Scribble key={scribble.scribbleId} scribble={scribble} />
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

home.propTypes = {
    getScribbles: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    data: state.data
})

export default connect(mapStateToProps, { getScribbles })(home)

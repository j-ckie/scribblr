import React, { Component } from 'react'
import PropTypes from "prop-types";
import axios from "axios";
import Scribble from "../components/scribble/Scribble";
import StaticProfile from "../components/profile/StaticProfile";

// material ui
import Grid from "@material-ui/core/Grid";

// redux
import { connect } from "react-redux";
import { getUserProfileData } from "../redux/actions/dataActions";


class user extends Component {

    state = {
        profile: null
    }

    componentDidMount() {
        const handle = this.props.match.params.handle;

        this.props.getUserProfileData(handle);

        axios.get(`/user/${handle}`)
            .then(res => {
                this.setState({
                    profile: res.data.user
                })
            })
            .catch(err => console.log(err));
    }

    render() {
        const { scribbles, loading } = this.props.data;

        const scribblesMarkup = loading ? (
            <p>Loading...</p>
        ) : scribbles === null ? (
            <p>Nothing here yet!</p>
        ) : (
                    scribbles.map(scribble => <Scribble key={scribble.scribbleId} scribble={scribble} />)
                )

        return (
            <Grid container spacing={2}>
                <Grid item sm={4} xs={12}>
                    {this.state.profile === null ? (
                        <p>Loading...</p>
                    ) : (
                            <StaticProfile profile={this.state.profile} />
                        )}
                </Grid>
                <Grid item sm={8} xs={12}>
                    {scribblesMarkup}
                </Grid>
            </Grid>
        )
    }
}

user.propTypes = {
    getUserProfileData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    data: state.data
});

export default connect(mapStateToProps, { getUserProfileData })(user);

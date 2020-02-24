import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MyButton from "../../util/MyButton";
import PostScribble from "../scribble/PostScribble";

// ======= Material UI =======
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar"; // importing one at a time avoids importing ALL of mui/core every time
import Button from "@material-ui/core/Button";
import HomeIcon from '@material-ui/icons/Home';
import Notifications from "@material-ui/icons/Notifications";

// import { connect } from 'react-redux'
import { connect } from "react-redux";

export class Navbar extends Component {
    render() {
        const { authenticated } = this.props
        return (
            <AppBar>
                <Toolbar className="nav-container">
                    {authenticated ? (
                        <Fragment>
                            <PostScribble />
                            <Link to="/">
                                <MyButton tip="Home">
                                    <HomeIcon />
                                </MyButton>
                            </Link>
                            <MyButton tip="Notifications - Under Construction">
                                <Notifications />
                            </MyButton>
                        </Fragment>
                    ) : (
                            <Fragment>
                                <Button color="inherit" component={Link} to="/">Home</Button>
                                <Button color="inherit" component={Link} to="/login">Login</Button>
                                <Button color="inherit" component={Link} to="/signup">Signup</Button>
                            </Fragment>

                        )}
                </Toolbar>
            </AppBar >
        )
    }
}

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
})

export default connect(mapStateToProps)(Navbar)

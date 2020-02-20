import React, { Component, Fragment } from 'react'
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";

// material ui
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DeleteOutline from "@material-ui/icons/DeleteOutline";

// redux
import { connect } from "react-redux";
import { deleteScribble } from "../redux/actions/dataActions"

const styles = {
    deleteButton: {
        position: "absolute",
        left: "90%",
        top: "10%"
    }

}

class DeleteScribble extends Component {
    state = {
        open: false
    }

    handleOpen = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    deleteScribble = () => {
        this.props.deleteScribble(this.props.scribbleId)
        this.setState({ open: false })
    }
    render() {

        const { classes } = this.props;
        return (
            <Fragment>
                <MyButton tip="Delete scribble" onClick={this.handleOpen} btnClassName={classes.deleteButton}>
                    <DeleteOutline color="secondary" />
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm">
                    <DialogTitle>
                        Are you positive you want to delete this scribble?
                        </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                            </Button>
                        <Button onClick={this.deleteScribble} color="secondary">
                            Delete
                            </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

DeleteScribble.propTypes = {
    deleteScribble: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    scribbleId: PropTypes.string.isRequired
}

export default connect(null, { deleteScribble })(withStyles(styles)(DeleteScribble))

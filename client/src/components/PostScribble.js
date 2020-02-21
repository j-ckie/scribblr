import React, { Component, Fragment } from 'react'
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";

// ======= Material UI =======
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

// ======= Redux =======
import { connect } from "react-redux";
import { postScribble } from "../redux/actions/dataActions";

const styles = (theme) => ({
    ...theme.spreadThis,
    submitButton: {
        position: "relative",
        marginTop: 15,
        marginBottom: 15
    },
    progressSpinner: {
        position: "absolute"
    }

})

class PostScribble extends Component {
    state = {
        open: false,
        scribble: "",
        errors: {}
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            })
        }
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({ scribble: "", });
            this.handleClose()

        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.postScribble({ body: this.state.scribble })
    }

    handleOpen = () => {
        this.setState({
            open: true
        })
    }

    handleClose = () => {
        this.setState({
            open: false,
            errors: {}
        })
    }

    render() {
        const { errors } = this.state;
        const { classes, UI: { loading } } = this.props;
        // console.log(this)
        // console.log(this.props)

        return (
            <Fragment>
                <MyButton
                    onClick={this.handleOpen}
                    tip="Post a scribble">
                    <AddIcon />
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth maxWidth="sm">

                    <DialogTitle>
                        Post a new scribble
                        <MyButton tip="Close"
                            onClick={this.handleClose}
                            className={classes.closeButton}>
                            <CloseIcon />
                        </MyButton>
                    </DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField
                                name="scribble"
                                type="text"
                                label="Scribble something down"
                                multiline
                                rows="3"
                                placeholder="..."
                                errors={errors.body}
                                helperText={errors.body}
                                className={classes.textField}
                                value={this.state.scribble}
                                onChange={this.handleChange}
                                // userHandle={handle}
                                fullWidth />
                            <Button type="submit" variant="contained" color="primary" className={classes.submitButton} disabled={loading}>
                                Submit {loading && (
                                    <CircularProgress size={20} className={classes.progressSpinner} />
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

PostScribble.propTypes = {
    postScribble: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    UI: state.UI
})

export default connect(mapStateToProps, { postScribble })(withStyles(styles)(PostScribble));


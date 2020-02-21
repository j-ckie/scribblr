import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import Typography from "@material-ui/core/Typography";

//redux
import { connect } from "react-redux";
import { getScribble } from "../redux/actions/dataActions";

const styles = (theme) => ({
    ...theme.spreadThis,
    invisibleSeparator: {
        border: "none",
        margin: 4
    },
    profileImage: {
        borderRadius: "50%",
        maxWidth: 200,
        height: 200,
        objectFit: "cover"
    },
    dialogContent: {
        padding: 20
    },
    expandButton: {
        paddingTop: 12,
        paddingBottom: 20,
        paddingLeft: 0
    },
    spinnerDiv: {
        textAlign: "center",
        marginTop: 50,
        marginBottom: 50
    }
})

class ScribbleDialog extends Component {
    state = {
        open: false
    }

    handleOpen = () => {
        this.setState({ open: true });
        this.props.getScribble(this.props.scribbleId);
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    render() {
        const { classes, scribble: { scribbleId, body, createdAt, likeCount, commentCount, userImage, userHandle }, UI: { loading } } = this.props;

        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={200} thickness={2} />
            </div>

        ) : (
                <Grid container spacing={10}>
                    <Grid item sm={5}>
                        <img src={userImage} alt="Profile Pic" className={classes.profileImage} />
                    </Grid>
                    <Grid item sm={7}>
                        <Typography component={Link} color="primary" variant="h5" to={`/users/${userHandle}`}>
                            @{userHandle}
                        </Typography>
                        <hr className={classes.invisibleSeparator} />
                        <Typography variant="body2" color="textSecondary">
                            {dayjs(createdAt).format("h:mm a, MMMM DD, YYYY")}
                        </Typography>
                        <hr className={classes.invisibleSeparator} />
                        <Typography variant="body1">
                            {body}
                        </Typography>
                        <div className="likesContainer">
                            <span className="count">
                                {likeCount}
                            </span>
                            <LikeButton scribbleId={scribbleId} />
                        </div>
                    </Grid>
                </Grid>
            )

        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip="Expand scribble" tipClassName={classes.expandButton}>
                    <UnfoldMore color="primary" />
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth maxWidth="sm" className="">
                    <div className="dialog-container-scribble">
                        <MyButton tip="Close"
                            onClick={this.handleClose}
                            className={classes.closeButton}>
                            <CloseIcon />
                        </MyButton>
                        <DialogContent className={classes.dialogContent}>
                            {dialogMarkup}
                        </DialogContent>
                    </div>
                </Dialog>
            </Fragment>
        )
    }
}

ScribbleDialog.propTypes = {
    getScribble: PropTypes.func.isRequired,
    scribbleId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    scribble: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    scribble: state.data.scribble,
    UI: state.UI
})

const mapActionToProps = {
    getScribble
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(ScribbleDialog));
import React, { Component } from 'react';
import MyButton from "../../util/MyButton";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from '@material-ui/icons/Favorite';
import withStyles from "@material-ui/core/styles/withStyles";

import { connect } from "react-redux";
import { likeScribble } from "../../redux/actions/dataActions";

const styles = (theme) => ({
    ...theme.spreadThis,
    likeIcon: {
        padding: "12 0 12 0"
    }
})

export class LikeButton extends Component {
    likedScribble = () => {
        if (this.props.user.likes && this.props.user.likes.find(like => like.scribbleId === this.props.scribbleId)) {
            return true;
        } else return false;
    }

    likeScribble = () => {
        console.log("testing...")
        this.props.likeScribble(this.props.scribbleId);
    }

    // unlikeScribble = () => {
    //     this.props.unlikeScribble(this.props.scribble.scribbleId);
    // }

    render() {
        // console.log(this.props)
        const { classes, user: { authenticated }, scribbleId } = this.props;
        const likeButton = !authenticated ? (
            <Link to="/login">
                <MyButton tip="Like">
                    <FavoriteBorder color="primary" />
                </MyButton>
            </Link >
        ) : (
                this.likedScribble() ? (
                    <MyButton className={classes.likeButton} tip="Liked">
                        <FavoriteIcon color="primary" />
                    </MyButton>
                ) : (
                        <MyButton className={classes.likeIcon} tip="Like" onClick={this.likeScribble}>
                            <FavoriteBorder color="primary" />
                        </MyButton>
                    )
            )
        return likeButton
    }
}

LikeButton.propTypes = {
    user: PropTypes.object.isRequired,
    // scribbleId: PropTypes.string.isRequired,
    likeScribble: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    likeScribble
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(LikeButton))

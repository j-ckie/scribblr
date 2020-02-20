import React, { Component } from 'react';
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import DeleteScribble from "./DeleteScribble";

// ======= Material UI =======
import Card from "@material-ui/core/Card";
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from '@material-ui/core/Typography';
import ChatBubble from "@material-ui/icons/ChatBubble";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from '@material-ui/icons/Favorite';

// ======= redux =======
import { connect } from "react-redux";
import { likeScribble, unlikeScribble } from "../redux/actions/dataActions";
import MyButton from "../util/MyButton";

const styles = {
    card: {
        position: "relative",
        display: "flex",
        marginBottom: 20,
    },
    content: {
        padding: 25,
        objectFit: "cover"
    },
    large: {
        width: 100,
        height: 100
    }
}

class Scribble extends Component {
    likedScribble = () => {
        if (this.props.user.likes && this.props.user.likes.find(like => like.scribbleId === this.props.scribble.scribbleId)) {
            return true;
        } else return false;
    }

    likeScribble = () => {
        this.props.likeScribble(this.props.scribble.scribbleId);
    }
    unlikeScribble = () => {
        this.props.unlikeScribble(this.props.scribble.scribbleId);
    }

    render() {

        dayjs.extend(relativeTime);
        const {
            classes,
            scribble: {
                body,
                createdAt,
                userImage,
                userHandle,
                scribbleId,
                likeCount,
                commentCount, },
            user: {
                authenticated, credentials: { handle }
            }
        } = this.props // destructuring

        const likeButton = !authenticated ? (
            <MyButton tip="Like">
                <Link to="/login">
                    <FavoriteBorder color="primary" />
                </Link>
            </MyButton>
        ) : (
                this.likedScribble() ? (
                    <MyButton tip="Unlike" onClick={this.unlikeScribble}>
                        <FavoriteIcon color="primary" />
                    </MyButton>
                ) : (
                        <MyButton tip="Like" onClick={this.likeScribble}>
                            <FavoriteBorder color="primary" />
                        </MyButton>
                    )
            )

        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteScribble scribbleId={scribbleId} />
        ) : null
        return (
            <Card className={classes.card}>
                <CardHeader avatar={<Avatar src={userImage} className={classes.large} />} />
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/users/${userHandle}`} color="primary">{userHandle}</Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant="body1">{body}</Typography>
                    {likeButton}
                    <span>{likeCount} Likes</span>
                    <MyButton tip="comments">
                        <ChatBubble color="primary" />
                    </MyButton>
                    <span>{commentCount} Comments</span>
                </CardContent>
            </Card >
        )
    }
}

Scribble.propTypes = {
    likeScribble: PropTypes.func.isRequired,
    unlikeScribble: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    scribble: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionToProps = {
    likeScribble,
    unlikeScribble
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Scribble))

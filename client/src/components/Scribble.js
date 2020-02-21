import React, { Component } from 'react';
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import DeleteScribble from "./DeleteScribble";
import ScribbleDialog from "./ScribbleDialog";
import LikeButton from "./LikeButton";

// ======= Material UI =======
import Card from "@material-ui/core/Card";
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from '@material-ui/core/Typography';
import ChatBubble from "@material-ui/icons/ChatBubble";


// ======= redux =======
import { connect } from "react-redux";

// import { likeScribble, unlikeScribble } from "../redux/actions/dataActions";
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



        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteScribble scribbleId={scribbleId} className="delete-scribble-btn" />
        ) : null
        return (
            <Card className={classes.card}>

                <CardHeader avatar={<Avatar src={userImage} className={classes.large} />} />
                <div className="main-scribble-content">
                    <CardContent className={classes.content}>
                        <Typography variant="h5" component={Link} to={`/users/${userHandle}`} color="primary">{userHandle}</Typography>

                        <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                        <Typography variant="body1">{body}</Typography>
                        <div className="likes-and-comments-container">
                            <div className="likes-container">
                                <span className="count">{likeCount}</span>
                                <LikeButton scribbleId={scribbleId} />
                            </div>
                            <div className="comments-container">
                                <span className="count">{commentCount}</span>
                                <MyButton className={classes.commentIcon} tip="comments">
                                    <ChatBubble color="primary" />
                                </MyButton>

                            </div>
                        </div>
                    </CardContent>
                    <div className="scribble-edit-buttons">
                        <ScribbleDialog scribbleId={scribbleId} userHandle={userHandle} />
                        {deleteButton}
                    </div>
                </div>
            </Card >
        )
    }
}

Scribble.propTypes = {
    // likeScribble: PropTypes.func.isRequired,
    // unlikeScribble: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    scribble: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user
})

// const mapActionToProps = {
//     likeScribble
//     // unlikeScribble
// }

export default connect(mapStateToProps)(withStyles(styles)(Scribble))

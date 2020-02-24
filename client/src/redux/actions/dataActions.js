// import { SET_SCRIBBLES, LOADING_DATA, LIKE_SCRIBBLE, UNLIKE_SCRIBBLE, DELETE_SCRIBBLE } from "../types";
import { SET_SCRIBBLES, LOADING_DATA, LIKE_SCRIBBLE, DELETE_SCRIBBLE, LOADING_UI, CLEAR_ERRORS, POST_SCRIBBLE, SET_SCRIBBLE, STOP_LOADING_UI, SUBMIT_COMMENT, SET_ERRORS } from "../types"; //SET_ERRORS
import axios from "axios";

export const getScribbles = () => (dispatch) => {
    // console.log('getscribbles function')
    dispatch({ type: LOADING_DATA })
    axios.get("/scribbles")
        .then(res => {
            dispatch({
                type: SET_SCRIBBLES,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({
                type: SET_SCRIBBLES,
                payload: []
            })
        })
}

export const getScribble = (scribbleId) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.get(`/scribble/${scribbleId}`)
        .then(res => {
            dispatch({
                type: SET_SCRIBBLE,
                payload: res.data
            });
            dispatch({
                type: STOP_LOADING_UI
            })
        })
        .catch(err => {
            console.log(err)
        })
}

export const postScribble = (newScribble) => (dispatch) => {
    // console.log("Button has been pressed...")
    // console.log(newScribble);
    dispatch({ type: LOADING_UI })
    axios.post("/scribble", newScribble)
        .then(res => {
            // console.log("trying to post the scribble")
            dispatch({ type: POST_SCRIBBLE, payload: res.data });
            dispatch({ type: CLEAR_ERRORS });

            axios.get("/scribbles")
                .then(res => {
                    dispatch({
                        type: SET_SCRIBBLES,
                        payload: res.data
                    })
                })
                .catch(err => {
                    dispatch({
                        type: SET_SCRIBBLES,
                        payload: []
                    })
                })
        })
        .catch(err => {
            console.log("Something went wrong - there is an error")
            dispatch({ type: SET_SCRIBBLES, payload: [] });
        })
}

export const likeScribble = (scribbleId) => (dispatch) => {
    // console.log("trying to like the scribble...")
    axios.get(`/scribble/${scribbleId}/like`)
        .then(res => {
            dispatch({ type: LIKE_SCRIBBLE, payload: res.data })

            axios.get("/scribbles")
                .then(res => {
                    dispatch({
                        type: SET_SCRIBBLES,
                        payload: res.data
                    })
                })
                .catch(err => {
                    dispatch({
                        type: SET_SCRIBBLES,
                        payload: []
                    })
                })
            // console.log("Getting scribbles and likes...")
        }).catch(err => console.log(err))
}

// removing for now until I can fix toggling heart filled in
// export const unlikeScribble = (scribbleId) => (dispatch) => {
//     axios.get(`/scribble/${scribbleId}/unlike`).then(res => {
//         dispatch({ type: UNLIKE_SCRIBBLE, payload: res.data })
//     }).catch(err => console.log(err))
// } 

export const deleteScribble = (scribbleId) => (dispatch) => {
    axios.delete(`/scribble/${scribbleId}`)
        .then(() => {
            dispatch({ type: DELETE_SCRIBBLE, payload: scribbleId })
        })
        .catch(err => console.log(err));
}

export const submitComment = (scribbleId, commentData) => (dispatch) => {
    axios.post(`/scribble/${scribbleId}/comment`, commentData)
        .then(res => {
            dispatch({ type: SUBMIT_COMMENT, payload: res.data });
            dispatch({ type: CLEAR_ERRORS })
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}

export const getUserProfileData = (userHandle) => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios.get(`/user/${userHandle}`)
        .then(res => {
            dispatch({ type: SET_SCRIBBLES, payload: res.data.scribbles });

        })
        .catch(() => {
            dispatch({ type: SET_SCRIBBLES, payload: null })
        })
}
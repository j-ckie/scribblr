// import { SET_SCRIBBLES, LOADING_DATA, LIKE_SCRIBBLE, UNLIKE_SCRIBBLE, DELETE_SCRIBBLE } from "../types";
import { SET_SCRIBBLES, LOADING_DATA, LIKE_SCRIBBLE, DELETE_SCRIBBLE, LOADING_UI, SET_ERRORS, CLEAR_ERRORS, POST_SCRIBBLE } from "../types";
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

export const postScribble = (newScribble) => (dispatch) => {
    console.log("Button has been pressed...")
    dispatch({ type: LOADING_UI })
    
    axios.post("/scribble", newScribble)
        .then(res => {
            console.log("trying to post the scribble")
            dispatch({ type: POST_SCRIBBLE, payload: res.data });
            dispatch({ type: CLEAR_ERRORS });
        })
        .catch(err => {
            console.log("Something went wrong - there is an error")
            dispatch({ type: SET_ERRORS, payload: err.response.data });
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
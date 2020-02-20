// import { SET_SCRIBBLES, LOADING_DATA, LIKE_SCRIBBLE, UNLIKE_SCRIBBLE, DELETE_SCRIBBLE } from "../types";
import { SET_SCRIBBLES, LOADING_DATA, LIKE_SCRIBBLE, DELETE_SCRIBBLE } from "../types";
import axios from "axios";

export const getScribbles = () => (dispatch) => {
    console.log('getscribbles function')
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

export const foo = () => {
    console.log("foo")
}


export const likeScribble = (scribbleId) => (dispatch) => {
    console.log("trying to like the scribble...")
    axios.get(`/scribble/${scribbleId}/like`)
        .then(res => {
            dispatch({ type: LIKE_SCRIBBLE, payload: res.data })

            foo();

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
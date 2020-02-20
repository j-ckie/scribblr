import { SET_SCRIBBLES, LOADING_DATA, LIKE_SCRIBBLE, UNLIKE_SCRIBBLE, DELETE_SCRIBBLE } from "../types";
import axios from "axios";


export const getScribbles = () => (dispatch) => {
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


export const likeScribble = (scribbleId) => (dispatch) => {
    axios.get(`/scribble/${scribbleId}/like`).then(res => {
        dispatch({ type: LIKE_SCRIBBLE, payload: res.data })
    }).catch(err => console.log(err))
}

export const unlikeScribble = (scribbleId) => (dispatch) => {
    axios.get(`/scribble/${scribbleId}/unlike`).then(res => {
        dispatch({ type: UNLIKE_SCRIBBLE, payload: res.data })
    }).catch(err => console.log(err))
}

export const deleteScribble = (scribbleId) => (dispatch) => {
    axios.delete(`/scribble/${scribbleId}`)
        .then(() => {
            dispatch({ type: DELETE_SCRIBBLE, payload: scribbleId })
        })
        .catch(err => console.log(err));
}
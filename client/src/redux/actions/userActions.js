import axios from "axios";
import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI } from "../types";

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI }); // sends action
    axios.post("/login", userData)
        .then(res => {
            const fireBaseIDToken = `Bearer ${res.data.token}`
            localStorage.setItem("fireBaseIDToken", fireBaseIDToken);
            // this.setState({ // on successful login, set loading back to false ??
            //     loading: false
            // });
            axios.defaults.headers.common["Authorization"] = fireBaseIDToken;
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push("/");
        })
        .catch(err => {
            console.log(err)
            console.log(err.TypeError)
            dispatch({
                type: SET_ERRORS,
                payload: err
            })
        })

}
export const getUserData = () => (dispatch) => {
    axios.get("/user")
        .then(res => {
            dispatch({ type: SET_USER, payload: res.data })
        })
        .catch(err => console.log(err));
}
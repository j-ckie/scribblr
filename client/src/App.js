import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import './App.css';
import themeFile from "./util/theme";
import jwtDecode from "jwt-decode";

// ======= Redux =======
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";

// ======= Material UI =======
import { ThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

// ======= Components =======
import Navbar from "./components/Navbar";
import AuthRoute from "./util/AuthRoute"

// ======= pages =======
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import axios from 'axios';

// ======= use theme file =======
const theme = createMuiTheme(themeFile);

// ======= AXIOS DEFAULT URL =======
axios.defaults.baseURL =
    'https://us-central1-scribblr-a0ed9.cloudfunctions.net/api';

// ======= validate token =======
const token = localStorage.fireBaseIDToken;

if (token) {
    const decodedToken = jwtDecode(token);
    // console.log(decodedToken);
    if (decodedToken.exp * 1000 < Date.now()) {
        store.dispatch(logoutUser())
        window.location.href = "/login";
    } else {
        store.dispatch({ type: SET_AUTHENTICATED });
        axios.default.headers.common["Authorization"] = token;
        store.dispatch(getUserData());
    }
}

console.log(React.version);

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>

                <BrowserRouter>
                    <Navbar />
                    <div className="container">
                        <Switch>
                            <Route exact path="/" component={home} />
                            <AuthRoute exact path="/login" component={login} />
                            <AuthRoute exact path="/signup" component={signup} />
                        </Switch>
                    </div>
                </BrowserRouter>

            </ThemeProvider>
        </Provider>
    );
}

export default App;

import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import './App.css';
import themeFile from "./util/theme";
import jwtDecode from "jwt-decode";

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

// ======= use theme file =======
const theme = createMuiTheme(themeFile);

// ======= validate token =======
let authenticated;
const token = localStorage.fireBaseIDToken;
if (token) {
    const decodedToken = jwtDecode(token);
    // console.log(decodedToken);
    if (decodedToken.exp * 1000 < Date.now()) {
        window.location.href = "/login";
        authenticated = false;
    } else {
        authenticated = true;
    }
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <BrowserRouter>
                    <Navbar />
                    <div className="container">
                        <Switch>
                            <Route exact path="/" component={home} />
                            <AuthRoute exact path="/login" component={login} authenticated={authenticated} />
                            <AuthRoute exact path="/signup" component={signup} authenticated={authenticated} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        </ThemeProvider>
    );
}

export default App;

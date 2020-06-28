import React, { Component } from 'react';
import './App.css';

import * as firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

import firebaseConfig from "./config/firebaseConfig.json";

import 'fontsource-roboto';
import { TextField, Button, ButtonGroup, AppBar, Toolbar, Typography } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import Project from './components/Project/Project.js';

firebase.initializeApp(firebaseConfig);

const theme = createMuiTheme({
    palette: {
      primary: green,
    }
});

export default class App extends Component {
    
    state = {
        auth: 0,
        page: 0,
        login: {},
        signup: {}
    }

    constructor() {
        super();
        firebase.auth().onAuthStateChanged((user) => {
            if(user) 
                this.setState({ auth: 1 });
            else
                this.setState({ auth: 0 });
        });
        this.unknownState = (
            <div>
                <h1>Error: </h1>
                <br />
                <p style="font-size: 200%">This state should not have been reached!</p>
            </div>
        );
    }

    render() {
        switch(this.state.auth) {
            case 1:
                switch(this.state.page) {
                    case 0:
                        return (
                            <div className="container">
                                <AppBar className="bar" position="static">
                                    <Toolbar>
                                        <Typography variant="h6" style={{ flexGrow: 1 }}>
                                            Workflow Manager
                                        </Typography>
                                        <ThemeProvider theme={theme}>
                                            <Button onClick={() => {
                                                
                                            }} variant="contained" color='primary' className="create-project-btn" style={{ marginRight: '10px' }}>Create Project</Button>
                                        </ThemeProvider>
                                        <Button onClick={() => firebase.auth().signOut()} variant="contained" color="secondary">Sign Out</Button>
                                    </Toolbar>
                                </AppBar>
                                <div className="main">
                                    Main
                                    <Project />
                                </div>
                            </div>
                        );
                    default:
                        return this.unknownState;
                }
            case 0:
                return (
                    <div className="login-page">
                        <form className="login-form" noValidate autoComplete="off">
                            <span className="login-title">Login</span>
                            <TextField value={this.state.login.email} onChange={
                                (e) => this.setState({ login: {...this.state.login, email: e.target.value} })
                            } required className="email-field" label="Email" variant="standard" />
                            <TextField value={this.state.login.password} onChange={
                                (e) => this.setState({ login: {...this.state.login, password: e.target.value} })
                            } required className="password-field" label="Password" type="password" autoComplete="current-password" variant="standard" />
                            <div className="login-btn-div">
                                <ButtonGroup>
                                    <Button onClick={
                                        () => this.setState({ auth: -1 })
                                    } className="login-btn" variant="contained">Sign Up</Button>
                                    <Button onClick={
                                        () => firebase.auth().signInWithEmailAndPassword(this.state.login.email, this.state.login.password).catch((err) => alert(err.message))
                                    } className="login-btn" variant="contained" color="primary">Login</Button>
                                </ButtonGroup>
                            </div>
                        </form>
                    </div>
                );
            case -1:
                return (
                    <div className="login-page">
                        <form className="login-form" noValidate autoComplete="off">
                            <span className="login-title">Sign Up</span>
                            <TextField onChange={
                                (e) => this.setState({ signup: {...this.state.signup, email: e.target.value} })
                            } required className="email-field" label="Email" variant="standard" />
                            <TextField onChange={
                                (e) => this.setState({ signup: {...this.state.signup, password1: e.target.value} })
                            } required className="password-field" label="Password" type="password" autoComplete="current-password" variant="standard" />
                            <TextField onChange={
                                (e) => this.setState({ signup: {...this.state.signup, password2: e.target.value} })
                            } required className="password-field" label="Password" type="password" autoComplete="current-password" variant="standard" />
                            <div className="login-btn-div">
                                <ButtonGroup>
                                    <Button onClick={
                                        () => this.setState({ auth: 0 })
                                    } className="login-btn" variant="contained">Login</Button>
                                    <Button onClick={
                                        () => {
                                            const pas1 = this.state.signup.password1;
                                            const pas2 = this.state.signup.password2;
                                            console.log(pas1, pas2);
                                            if(pas1 === pas2) {
                                                firebase.auth().createUserWithEmailAndPassword(this.state.signup.email, pas1).catch((err) => alert(err.message));
                                            } else {
                                                alert("Passwords do not match!");
                                            }
                                        }
                                    } className="login-btn" variant="contained" color="primary">Sign Up</Button>
                                </ButtonGroup>
                            </div>
                        </form>
                    </div>
                );
            default:
                return this.unknownState;
        }
    }

}
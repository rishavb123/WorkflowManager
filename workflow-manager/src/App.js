import React, { Component } from 'react';
import './App.css';

import * as firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

import firebaseConfig from "./config/firebaseConfig.json";

import 'fontsource-roboto';
import { TextField, Button, ButtonGroup, AppBar, Toolbar, Typography, Modal, IconButton, Menu, MenuItem } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';

import Project from './components/Project/Project.js';
import ProjectView from './components/ProjectView/ProjectView.js';

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const theme = createMuiTheme({
    palette: {
      primary: green,
    }
});

export default class App extends Component {
    
    state = {
        auth: 0,
        page: 0,
        curProject: {},
        login: {},
        signup: {},
        createProject: {},
        createProjectModalOpen: false,
        editProjects: [],
        viewProjects: [],
    };

    constructor() {
        super();
        this.setDataListener = this.setDataListener.bind(this);
        auth.onAuthStateChanged((user) => {
            if(user) {
                this.setState({ auth: 1 });
                this.setDataListener();
            }
            else
                this.setState({ auth: 0 });
        });
        this.unknownState = (
            <div>
                <h1>Error: </h1>
                <br />
                <p style={{ fontSize: "200%" }}>This state should not have been reached!</p>
            </div>
        );
    }

    setDataListener() {
        const editArray = [];
        const viewArray = [];

        db.collection("projects").where("editors", "array-contains", auth.currentUser.uid).onSnapshot((querySnapshot) => {
            editArray.length = 0;
            querySnapshot.forEach((doc) => {
                const obj = doc.data();
                obj.id = doc.id;
                editArray.push(obj);
            });
            this.setState({ editProjects: editArray });
        });

        db.collection("projects").where("viewers", "array-contains", auth.currentUser.uid).onSnapshot((querySnapshot) => {
            viewArray.length = 0;
            querySnapshot.forEach((doc) => {
                const obj = doc.data();
                obj.id = doc.id;
                viewArray.push(obj);
            });
            this.setState({ viewProjects: viewArray });
        });
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
                                            <Button onClick={() => this.setState({ createProjectModalOpen: true })} variant="contained" color='primary' className="create-project-btn" style={{ marginRight: '10px' }}>Create Project</Button>
                                        </ThemeProvider>
                                        <IconButton edge="end" aria-label="account" onClick={(e) => this.setState({ anchorEl: e.currentTarget })}>
                                            <AccountCircleTwoToneIcon />
                                        </IconButton>
                                        <Menu
                                            id="simple-menu"
                                            anchorEl={this.state.anchorEl}
                                            keepMounted
                                            open={Boolean(this.state.anchorEl)}
                                            onClose={() => this.setState({ anchorEl: null })}
                                        >
                                            <MenuItem onClick={() => alert(auth.currentUser.uid)}>View UID</MenuItem>
                                            <MenuItem onClick={() => auth.sendPasswordResetEmail(auth.currentUser.email)}>Send Password Reset</MenuItem>
                                            <MenuItem onClick={() => auth.signOut()}>Logout</MenuItem>
                                        </Menu>
                                    </Toolbar>
                                </AppBar>
                                <div className="main">
                                    <h2>Edit Access</h2>
                                    {this.state.editProjects.map((project) => <Project db={db} onOpen={() => {
                                            this.setState({
                                                curProject: project,
                                                page: 1
                                            });
                                        }} detail={project} />)}
                                    <h2>View Access</h2>
                                    {this.state.viewProjects.map((project) => <Project db={db} onOpen={() => {
                                        this.setState({
                                            curProject: project,
                                            page: 1
                                        });
                                    }} detail={project} />)}
                                </div>
                                <Modal
                                    open={this.state.createProjectModalOpen}
                                    onClose={() => this.setState({ createProjectModalOpen: false })}
                                    aria-labelledby="simple-modal-title"
                                    aria-describedby="simple-modal-description"
                                    className="create-project-modal"
                                >
                                    <form className="form create-project-form" noValidate autoComplete="off">
                                        <span className="form-title">Create Project</span>
                                        <TextField value={this.state.createProject.name} onChange={
                                            (e) => this.setState({ createProject: {...this.state.createProject, name: e.target.value} })
                                        } required className="form-field" label="Name" variant="standard" />
                                        <TextField value={this.state.createProject.description} onChange={
                                            (e) => this.setState({ createProject: {...this.state.createProject, description: e.target.value} })
                                        } required className="form-field" label="Description" variant="standard" />
                                        <div className="create-project-submit-btn-container">
                                            <ThemeProvider theme={theme}>
                                                <Button onClick={
                                                    () => db.collection("projects").add({
                                                        ...this.state.createProject,
                                                        ownerId: auth.currentUser.uid,
                                                        editors: [auth.currentUser.uid],
                                                        viewers: [],
                                                        links: [],
                                                        files: [],
                                                    }).then(() => this.setState({ createProject: {}, createProjectModalOpen: false }))
                                                } variant="contained" color='primary'>Create Project</Button>
                                            </ThemeProvider>
                                        </div>
                                    </form>
                                </Modal>
                            </div>
                        );
                    case 1:
                        return (
                            <div class="container">
                                <AppBar className="bar" position="static">
                                    <Toolbar>
                                        <Typography variant="h6" style={{ flexGrow: 1 }}>
                                            {this.state.curProject.name}
                                        </Typography>
                                        <ThemeProvider theme={theme}>
                                            <Button onClick={() => {
                                                if(this.state.curProject.ownerId === auth.currentUser.uid)
                                                    this.setState({ shareModalOpen: true });
                                            }} variant="contained" color={this.state.curProject.ownerId === auth.currentUser.uid? 'primary': 'disabled'} className="create-project-btn" style={{ marginRight: '10px' }}>Share</Button>
                                        </ThemeProvider>
                                        <Button onClick={() => this.setState({ page: 0 })} variant="contained" color="secondary">Back</Button>
                                    </Toolbar>
                                </AppBar>
                                <div className="main">
                                    <ProjectView project={this.state.curProject} db={db} />
                                </div>
                                <Modal
                                    open={this.state.shareModalOpen}
                                    onClose={() => this.setState({ shareModalOpen: false })}
                                    aria-labelledby="simple-modal-title"
                                    aria-describedby="simple-modal-description"
                                    className="create-project-modal"
                                >
                                    <form className="form create-project-form" noValidate autoComplete="off">
                                        <span className="form-title">Share Project</span>
                                        <TextField value={this.state.shareTo} onChange={
                                            (e) => this.setState({ shareTo: e.target.value })
                                        } required className="form-field" label="Email" variant="standard" />
                                        <ThemeProvider theme={theme}>
                                            <Button onClick={() => {
                                                const dbRef = db.collection('projects').doc(this.state.curProject.id);
                                                db.runTransaction(transation => {
                                                    return transation.get(dbRef).then((snapshot) => {
                                                        const arr = snapshot.get('editors');
                                                        return fetch('https://us-central1-rb-workflow-manager.cloudfunctions.net/getUser?email=' + this.state.shareTo).then(res => res.json()).then(
                                                            (result) => {
                                                                arr.append(result.uid);
                                                                transation.update(dbRef, 'editors', arr);
                                                            }
                                                        );
                                                    })
                                                });
                                            }} variant="contained" color={this.state.curProject.ownerId === auth.currentUser.uid? 'primary': 'disabled'} className="create-project-btn" style={{ marginRight: '10px' }}>Share</Button>
                                        </ThemeProvider>
                                    </form>
                                </Modal>
                            </div>
                        );
                    default:
                        return this.unknownState;
                }
            case 0:
                return (
                    <div className="login-page">
                        <form className="form login-form" noValidate autoComplete="off">
                            <span className="form-title">Login</span>
                            <TextField value={this.state.login.email} onChange={
                                (e) => this.setState({ login: {...this.state.login, email: e.target.value} })
                            } required className="form-field" label="Email" variant="standard" />
                            <TextField value={this.state.login.password} onChange={
                                (e) => this.setState({ login: {...this.state.login, password: e.target.value} })
                            } required className="form-field" label="Password" type="password" autoComplete="current-password" variant="standard" />
                            <a onClick={() => this.setState({ auth: -2 })}>Forgot Password</a>
                            <div className="login-btn-div">
                                <ButtonGroup>
                                    <Button onClick={
                                        () => this.setState({ auth: -1 })
                                    } className="login-btn" variant="contained">Sign Up</Button>
                                    <Button onClick={
                                        () => auth.signInWithEmailAndPassword(this.state.login.email, this.state.login.password).catch((err) => alert(err.message))
                                    } className="login-btn" variant="contained" color="primary">Login</Button>
                                </ButtonGroup>
                            </div>
                        </form>
                    </div>
                );
            case -1:
                return (
                    <div className="login-page">
                        <form className="form login-form" noValidate autoComplete="off">
                            <span className="form-title">Sign Up</span>
                            <TextField onChange={
                                (e) => this.setState({ signup: {...this.state.signup, email: e.target.value} })
                            } required className="form-field" label="Email" variant="standard" />
                            <TextField onChange={
                                (e) => this.setState({ signup: {...this.state.signup, password1: e.target.value} })
                            } required className="form-field" label="Password" type="password" autoComplete="current-password" variant="standard" />
                            <TextField onChange={
                                (e) => this.setState({ signup: {...this.state.signup, password2: e.target.value} })
                            } required className="form-field" label="Password" type="password" autoComplete="current-password" variant="standard" />
                            <div className="login-btn-div">
                                <ButtonGroup>
                                    <Button onClick={
                                        () => this.setState({ auth: 0 })
                                    } className="login-btn" variant="contained">Back to Login</Button>
                                    <Button onClick={
                                        () => {
                                            const pas1 = this.state.signup.password1;
                                            const pas2 = this.state.signup.password2;
                                            console.log(pas1, pas2);
                                            if(pas1 === pas2) {
                                                auth.createUserWithEmailAndPassword(this.state.signup.email, pas1).catch((err) => alert(err.message));
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
            case -2:
                return (
                    <div className="login-page">
                        <form className="form login-form" noValidate autoComplete="off">
                            <span className="form-title">Forgot Password</span>
                            <TextField value={this.state.login.email} onChange={
                                (e) => this.setState({ login: {...this.state.login, email: e.target.value} })
                            } required className="form-field" label="Email" variant="standard" />
                            <div className="login-btn-div">
                                <ButtonGroup>
                                    <Button onClick={
                                        () => this.setState({ auth: 0 })
                                    } className="login-btn" variant="contained">Back to Login</Button>
                                    <Button onClick={
                                        () => auth.sendPasswordResetEmail(this.state.login.email).catch((err) => alert(err.message))
                                    } className="login-btn" variant="contained" color="primary">Send Password Reset</Button>
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
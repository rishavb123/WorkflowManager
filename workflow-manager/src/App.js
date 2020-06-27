import React, { Component } from 'react';
import './App.css';

import * as firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

import * as firebaseConfig from "./config/firebaseConfig.json";

import 'fontsource-roboto';


export default class App extends Component {
    
    state = {
        auth: 0
    }

    constructor() {
        super();
        firebase.initializeApp(firebaseConfig);
        firebase.auth().onAuthStateChanged((user) => {
            if(user)
                this.setState({ auth: 1 });
            else
                this.setState({ auth: 0 });
        });
    }

    render() {
        if(this.state.auth)
            return (
                <div className="App">
                    Hello World
                </div>
            );
        else
            return (
                <div className="App">
                    Login Please
                </div>
            )
    }

}
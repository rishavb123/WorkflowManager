import React, { Component } from 'react';

import './Folder.css';

export default class Folder extends Component {

    componentWillMount() {
        this.setState(this.props.detail);
        console.log(this.props.detail);
    }

    render() {
        return (
            Folder
        );
    }

}
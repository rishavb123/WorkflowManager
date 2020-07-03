import React, { Component } from 'react';

import 'fontsource-roboto';
import { Card } from '@material-ui/core';

import './ProjectView.css';

export default class ProjectView extends Component {

    componentWillMount() {
        this.setState(this.props.project);
    }

    render() {
        return (
            <div>
                {this.state.description}
            </div>
        );
    }

}
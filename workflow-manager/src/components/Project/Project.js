import React, { Component } from 'react';

import 'fontsource-roboto';
import { Card, CardContent, CardActions, Button, Typography } from '@material-ui/core';

import './Project.css';

export default class Project extends Component {

    componentWillMount() {
        this.setState(this.props.detail);
        console.log(this.props.detail);
    }

    render() {
        return (
            <Card className="project-card">
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Word of the Day
                    </Typography>
                    <Typography variant="h5" component="h2">
                        Hello World
                    </Typography>
                    <Typography color="textSecondary">
                        adjective
                    </Typography>
                    <Typography variant="body2" component="p">
                        well meaning and kindly.
                        <br />
                        {'"a benevolent smile"'}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Open</Button>
                </CardActions>
            </Card>
        );
    }

}
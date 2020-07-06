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
                        {this.state.id}
                    </Typography>
                    <Typography variant="h5">
                        {this.state.name}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {this.state.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="secondary" onClick={() => {
                        if(this.state.name === prompt("Are you sure you want to delete " +
                                                        this.state.name + 
                                                        "? To confirm, please type the project name (" + 
                                                        this.state.name + 
                                                        ") in the space below. This action is permanant and cannot be undone.")) {
                            const uid = this.props.auth.uid;
                            if(this.state.editors.includes(uid)) {
                                const dbRef = this.props.db.collection('projects').doc(this.state.id);
                                this.props.db.runTransaction(transation => {
                                    return transation.get(dbRef).then((snapshot) => {
                                        const arr = snapshot.get('editors');
                                        arr.remove(this.props.auth.currentUser.uid);
                                        transation.update(dbRef, 'editors', arr);
                                    })
                                });
                            }
                            if(this.state.viewers.includes(uid)) {
                                const dbRef = this.props.db.collection('projects').doc(this.state.id);
                                this.props.db.runTransaction(transation => {
                                    return transation.get(dbRef).then((snapshot) => {
                                        const arr = snapshot.get('viewers');
                                        arr.remove(this.props.auth.currentUser.uid);
                                        transation.update(dbRef, 'viewers', arr);
                                    })
                                });
                            }
                            if(uid === this.state.owner)
                                this.props.db.collection("projects").doc(this.state.id).delete().then(() => alert("Project Deleted!"))
                        }
                    }}>Delete</Button>
                    <Button size="small" onClick={this.props.onOpen}>Open</Button>
                </CardActions>
            </Card>
        );
    }

}
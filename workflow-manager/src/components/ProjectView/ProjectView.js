import React, { Component } from 'react';

import 'fontsource-roboto';
import { List, ListSubheader, ListItemText, TextField, Button, Modal, ListItem, TextareaAutosize, ListItemSecondaryAction, IconButton, ListItemIcon, Checkbox, FormControlLabel, LinearProgress, Typography, Box } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { green } from '@material-ui/core/colors';

import './ProjectView.css';

import fixVar from '../../util/FixVar.js';

const theme = createMuiTheme({
    palette: {
      primary: green
    }
});

function LinearProgressWithLabel(props) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
  }

export default class ProjectView extends Component {

    state = {
        todoModalOpen: false,
        todoEditor: {},
        todo: []
    };

    constructor() {
        super();
        this.setDataListeners = this.setDataListeners.bind(this);
    }

    componentWillMount() {
        this.setDataListeners();
    }

    setDataListeners() {
        const todoArray = [];
        this.props.db.collection("projects").doc(this.props.project.id).collection("todo").onSnapshot((querySnapshot) => {
            todoArray.length = 0;
            querySnapshot.forEach((doc) => {
                const obj = doc.data();
                obj.id = doc.id;
                todoArray.push(obj);
            });
            todoArray.sort((a, b) => a.priority - b.priority);
            this.setState({
                ...this.props.project,
                todo: todoArray? todoArray : []
            });
        });
    }

    render() {
        return (
            <div class='project-view'>
                <h2 class='project-header'>{this.state.name}</h2>
                <p className="desc">{this.state.description}</p>
                <List class="full-todo-list" subheader={<li />}>
                    {
                        [{
                            name: "Not Completed",
                            filter: (todo) => !todo.done
                        }, {
                            name: "Completed",
                            filter: (todo) => todo.done
                        }].map((obj) => (
                            <li key={obj.name} className="todo-list-section">
                                <ul className="todo-list">
                                <ListSubheader style={{ backgroundColor: 'white' }} className="todo-list-item">{obj.name}</ListSubheader>
                                    {this.state.todo.filter(obj.filter).map((todo) => (
                                        <ListItem className="todo-list-item" key={todo.task}>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={todo.done}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    onChange={(e) => this.props.db.collection("projects").doc(this.state.id).collection('todo').doc(todo.id).update({ done: e.target.checked })}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary={todo.task} className="todo-text" onClick={() => this.setState({ todoEditor: todo, todoModalOpen: true })} />
                                            <ListItemSecondaryAction onClick={() => this.props.db.collection("projects").doc(this.state.id).collection("todo").doc(todo.id).delete().then(() => alert("Deleted " + todo.task + " todo successfully!"))}>
                                                <IconButton edge="end" aria-label="delete">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                    {((name) => {
                                        if(name === "Not Completed")
                                            return (
                                                <ListItem className="todo-list-item" key='add-todo' onClick={() => {
                                                    const ref = this.props.db.collection('projects').doc(this.state.id).collection('todo').doc();
                                                    this.setState({ todoEditor: {id: ref.id, done: false}, todoModalOpen: true });
                                                }}>
                                                    <ListItemText className="todo-text" primary='+ New Todo' />
                                                </ListItem>
                                            );
                                        else 
                                            return null;
                                    })(obj.name)}
                                </ul>
                            </li>
                        ))
                    }
                </List>
                <h3>Progress</h3>
                <LinearProgressWithLabel value={(() => {
                    const addLengths = (list) => {
                        let sum = 0;
                        for(let obj of list) sum += parseInt(obj.length);
                        return sum;
                    }
                    const total = addLengths(this.state.todo);
                    if(total === 0) return 100;
                    return addLengths(this.state.todo.filter((todo) => todo.done)) * 100 / total;
                })()}/>
                <Modal
                    open={this.state.todoModalOpen}
                    onClose={() => this.setState({ todoModalOpen: false })}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    className="create-project-modal"
                >
                    <form className="form create-project-form" noValidate autoComplete="off">
                        <span className="form-title">Todo Editor</span>
                        <TextField value={this.state.todoEditor.task} onChange={
                            (e) => this.setState({ todoEditor: {...this.state.todoEditor, task: e.target.value} })
                        } required className="form-field" label="Task" variant="standard" />
                        <TextareaAutosize rowsMin={5} value={this.state.todoEditor.notes} style={{ marginTop: '10px', marginBottom: '10px' }} onChange={
                            (e) => this.setState({ todoEditor: {...this.state.todoEditor, notes: e.target.value} })
                        } required className="form-field" placeholder="Notes" />
                        <TextField value={this.state.todoEditor.priority} onChange={
                            (e) => this.setState({ todoEditor: {...this.state.todoEditor, priority: e.target.value} })
                        } required className="form-field" label="Priority" variant="standard" type="number"/>
                        <TextField value={this.state.todoEditor.length} onChange={
                             (e) => this.setState({ todoEditor: {...this.state.todoEditor, length: e.target.value} })
                        } required className="form-field" label="Length" variant="standard" type="number"/>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.todoEditor.done}
                                    onChange={(e) => {
                                        this.setState({ todoEditor: { ...this.state.todoEditor, done: e.target.checked } });
                                        this.props.db.collection("projects").doc(this.state.id).collection('todo').doc(this.state.todoEditor.id).update({ done: e.target.checked })
                                    }}
                                    color="primary"
                                />
                            }
                            label="Done"
                        />
                        <div className="create-project-submit-btn-container">
                            <ThemeProvider theme={theme}>
                                <Button onClick={
                                    () => this.props.db.collection("projects").doc(this.state.id).collection("todo").doc(this.state.todoEditor.id).set({
                                        task: fixVar(this.state.todoEditor.task),
                                        notes: fixVar(this.state.todoEditor.notes),
                                        priority: fixVar(this.state.todoEditor.priority, 0),
                                        length: fixVar(this.state.todoEditor.length, 1),
                                        done: fixVar(this.state.todoEditor.done, false),
                                        assignedTo: []
                                    }).then(() => this.setState({ todoEditor: {}, todoModalOpen: false }))
                                } variant="contained" color='primary'>Save</Button>
                            </ThemeProvider>
                        </div>
                    </form>
                </Modal>
            </div>
        );
    }

}
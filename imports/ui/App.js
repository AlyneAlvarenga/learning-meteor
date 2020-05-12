import React, {Component} from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Tasks} from '../api/tasks.js';
import Task from './Task';
import AccountsUIWrapper from './AccountsUIWrapper';

class App extends Component {
  constructor() {
    super();

    this.state = {
      input: '',
      hideCompleted: false,
    }
  }

  handleChange = (e) => {
    this.setState({
      input: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const text = this.state.input;

    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    })

    this.setState({
      input: '',
    })
  }

  toggleHideCompleted = () => {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks = () => {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }

    return filteredTasks.map(task => {
      return <Task key={task._id} task={task} />
    });
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Alyne's Todos ({this.props.incompleteCount})</h1>

          <label htmlFor="hideCompleted">Hide Completed Tasks</label>
          <input type="checkbox" readOnly id="hideCompleted" checked={this.state.hideCompleted} onClick={this.toggleHideCompleted} />

          <AccountsUIWrapper />

          {
            this.props.currentUser ? 
            <form className="new-task" onSubmit={this.handleSubmit} >
              <input
                type="text"
                value={this.state.input}
                placeholder="Type to add new tasks"
                onChange={this.handleChange}
              />
            </form>
            : null
          }
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  }
})(App);
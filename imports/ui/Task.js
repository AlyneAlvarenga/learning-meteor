import React, {Component} from 'react';
import { Tasks } from '../api/tasks.js';
import {Meteor} from 'meteor/meteor';


export default class Task extends Component {

  toggleChecked = () => {
    // Tasks.update(this.props.task._id, {
    //   $set: { checked: !this.props.task.checked }
    // })
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  }

  deleteThisTask = () => {
    // Tasks.remove(this.props.task._id);
    Meteor.call('tasks.remove', this.props.task._id);
  }

  render() {
    const taskClassName = this.props.task.checked ? 'checked' : null;

    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteThisTask}>
          &times;
        </button>

        <input type="checkbox" readOnly checked={!!this.props.task.checked} onClick={this.toggleChecked} />

        <span className="text">
          <strong>{this.props.task.username}</strong>: {this.props.task.text}
          </span>
      </li>
    )
  }
}
import React, { Component, PropTypes } from 'react'
import Task from './Task'
import TaskActions from '../actions/TaskActions'

class Tasks extends Component {
    constructor(props) {
        super(props)

        this.styles = {
            tasks: {
                listStyle: 'none',
                padding: 10
            }
        }

    }

    static propTypes = {
        tasks: PropTypes.arrayOf(PropTypes.object)
    };

    render() {
        const tasks = this.props.tasks

        return (
            <ul style={this.styles.tasks}>
                { tasks.map(this.renderTask) }
            </ul>
        )
    }

    renderTask(task) {
        return (
            <Task key={task.id} id={task.id} task={task} />
        )
    }

    
}

export default Tasks

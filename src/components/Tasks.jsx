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
        tasks: PropTypes.object
    };

    render() {
        const tasks = this.props.tasks

        return (
            <ul style={this.styles.tasks}>
                { tasks.map(this.renderTask, this) }
            </ul>
        )
    }

    renderTask(task) {
        return (
            <Task 
                className="task" 
                key={task.get('id')}
                id={task.get('id')} 
                task={task}
                onDelete={this.deleteTask.bind(this, task.get('id'))}
                onEdit={this.editTask.bind(this, task.get('id'))}
                />
        )
    }

    deleteTask(id) {
        if (confirm(`Are you sure you want to delete task #${id}?`)) {
            TaskActions.deleteTask(id)
        }
    }
    
    editTask(id, name) {
        TaskActions.updateTask(id, { name })
    }
    
}

export default Tasks

import React, { Component, PropTypes } from 'react'
import { Glyphicon, Label, DropdownButton, MenuItem } from 'react-bootstrap'
import { DragSource, DropTarget } from 'react-dnd'

import TaskActions from '../actions/TaskActions'
import ListActions from '../actions/ListActions'
import AppStore from '../stores/AppStore'
import ListStore from '../stores/ListStore'
import TaskStore from '../stores/TaskStore'
import Editable from '../components/Editable'
import ItemTypes from '../constants'

const taskSource = {
    beginDrag(props, monitor) {
        const lists = ListStore.getState().lists

        const currentList = lists.filter((list) => {
            return list.tasks.indexOf(props.task.id) > -1
        })[0]

        return {
            id: props.task.id,
            listId: currentList.id,
            storyType: props.task.story_type
        }
    },

    isDragging(props, monitor) {
        return props.id === monitor.getItem().id
    },

    endDrag(props, monitor) {
        const task = props.task
        const { id, listId, storyType } = monitor.getItem()

        const {beforeId, afterId, newListId, defaultState} = monitor.getDropResult()
        const updateParams = {}

        if (newListId !== listId) {
            // moving to new list give default state
            updateParams.current_state = defaultState

            // need to handle estimate
            if (storyType === 'feature' && task.estimate === undefined) {
                const project = AppStore.getState().project
                updateParams.estimate = +project.point_scale.split(',')[0]
            }
        } else {
            updateParams.current_state = task.current_state
        } 

        // accepted wont allow position
        if (updateParams.current_state !== 'accepted') {
            if (beforeId) updateParams.before_id = beforeId
            if (afterId) updateParams.after_id = afterId
        }

        TaskActions.updateTask(id, updateParams)
    }
}

const taskTarget = {
    hover(targetProps, monitor) {
        const targetId = targetProps.task.id
        const sourceId = monitor.getItem().id

        if (sourceId !== targetId && monitor.canDrop()) {
            ListActions.moveList({sourceId, targetId})
        }
    },
}

@DragSource(ItemTypes.TASK, taskSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
@DropTarget(ItemTypes.TASK, taskTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
}))
class Task extends Component {
    constructor(props) {
        super(props)

        this.states = {
            unstarted: '#4388FF',
            started: '#FCAC79',
            finished: '#D3E173',
            delivered: '#CC96EF',
            rejected: '#FA6E6E',
            accepted: '#7EC871'
        }

        this.types = TaskStore.getState().types

        this.changeState = this.changeState.bind(this)
        this.editTask = this.editTask.bind(this)
        this.deleteTask = this.deleteTask.bind(this, props.task.id)
    }

    static propTypes = {
        task: PropTypes.object.isRequired,
        id: PropTypes.number.isRequired
    };

    render() {
        const { task, connectDragSource, connectDropTarget, isDragging, ...props } = this.props

        this.styles = {
            label: {
                marginRight: 5
            },
            name: {
                margin: '10px 0',
                fontFamily: 'Raleway, sans-serif',
                fontSize: 20
            },
            state: {
                fontVariant: 'small-caps',
                color: '#999'
            },
            type: {
                float: 'right',
                fontVariant: 'small-caps',
                color: '#999'
            },
            task: {
                background: '#fff',
                marginBottom: 10,
                padding: 10,
                borderStyle: 'solid',
                borderWidth: '0 0 0 10px',
                borderColor: this.states[task.current_state]
            },
            delete: {
                float: 'right',
                marginTop: 3,
                color: '#777',
                cursor: 'pointer'
            },
            footer: {
                minHeight: 20
            }
        }

        const states = this.types.filter((type) => {
            return type.name === task.story_type
        })[0].states

        return connectDropTarget(connectDragSource(
            <div style={this.styles.task} {...props}>
                <DropdownButton id={task.id} title={task.current_state}
                    onSelect={this.changeState} bsSize="xsmall"
                    style={this.styles.state}>
                    {states.map(this.renderMenuItem, this)}
                </DropdownButton>
                <span style={this.styles.type}>{task.story_type}</span>

                <Editable style={this.styles.name} value={task.name} type="textarea" onEdit={this.editTask}/>

                <div style={this.styles.footer}>
                    {task.labels.map(this.renderLabel, this)}
                    <Glyphicon glyph="trash" style={this.styles.delete} onClick={this.deleteTask} title="Delete task"/>
                </div>
            </div>
        ))
    }

    renderLabel(label) {
        return <Label key={label.id} style={this.styles.label}>{label.name}</Label>
    }

    renderMenuItem(state, index) {
        return <MenuItem eventKey={state} key={index}>{state}</MenuItem>
    }

    changeState(e, newState) {
        const task = this.props.task
        const updateParams = {}

        if (task.story_type === 'feature' && task.estimate === undefined) {
            const project = AppStore.getState().project
            updateParams.estimate = +project.point_scale.split(',')[0]
        }

        updateParams.current_state = newState

        TaskActions.updateTask(task.id, updateParams)
    }

    editTask(name) {
        const {id} = this.props.task

        TaskActions.updateTask(id, { name })
    }

    deleteTask(id) {
        if (confirm(`Are you sure you want to delete task #${id}?`)) {
            TaskActions.deleteTask(id)
        }
    }
    
}

export default Task

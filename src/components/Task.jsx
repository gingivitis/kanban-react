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
            return list.tasks.includes(props.task.get('id'))
        })[0]

        return {
            id: props.task.get('id'),
            listId: currentList.id,
            storyType: props.task.get('story_type')
        }
    },

    isDragging(props, monitor) {
        return props.id === monitor.getItem().id
    },

    endDrag(props, monitor) {
        if (!monitor.didDrop()) {
            return
        }

        const task = props.task
        const { id, listId, storyType } = monitor.getItem()

        const {beforeId, afterId, newListId, defaultState} = monitor.getDropResult()
        const updateParams = {}

        if (newListId !== listId) {
            // moving to new list give default state
            updateParams.current_state = defaultState

            // need to handle estimate
            if (storyType === 'feature' && task.get('estimate') === undefined) {
                const project = AppStore.getState().project
                updateParams.estimate = +project.get('point_scale').split(',')[0]
            }
        } else {
            updateParams.current_state = task.get('current_state')
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
        const targetId = targetProps.task.get('id')
        const sourceId = monitor.getItem().id

        if (sourceId !== targetId && monitor.canDrop()) {
            ListActions.moveList({sourceId, targetId})
        }
    },

    canDrop(targetProps, monitor) {
        const targetId = targetProps.id
        const lists = ListStore.getState().lists
        const types = TaskStore.getState().types // make static method
 
        const listStates = lists.filter((list) => {
            return list.tasks.includes(targetId)
        })[0].states

        const typeStates = types.filter((type) => {
            return type.name === monitor.getItem().storyType
        })[0].states

        const intersection = listStates.filter((state) => {
            return typeStates.indexOf(state) > -1
        })
        
        if (intersection.length > 0) {
            return true
        }
        return false
    }
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
        this.editTask = this.editTask.bind(this, props.id)
        this.deleteTask = this.deleteTask.bind(this, props.id)
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
                borderColor: this.states[task.get('current_state')]
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
            return type.name === task.get('story_type')
        })[0].states

        return connectDropTarget(connectDragSource(
            <div style={this.styles.task} {...props}>
                <DropdownButton id={task.get('id')} title={task.get('current_state')}
                    onSelect={this.changeState} bsSize="xsmall"
                    style={this.styles.state}>
                    {states.map(this.renderMenuItem, this)}
                </DropdownButton>
                <span style={this.styles.type}>{task.get('story_type')}</span>

                <Editable style={this.styles.name} value={task.get('name')} type="textarea" onEdit={this.editTask}/>

                <div style={this.styles.footer}>
                    {task.get('labels').map(this.renderLabel, this)}
                    <Glyphicon glyph="trash" style={this.styles.delete} onClick={this.deleteTask} title="Delete task"/>
                </div>
            </div>
        ))
    }

    renderLabel(label) {
        return <Label key={label.get('id')} style={this.styles.label}>{label.get('name')}</Label>
    }

    renderMenuItem(state, index) {
        return <MenuItem eventKey={state} key={index}>{state}</MenuItem>
    }

    changeState(e, newState) {
        const task = this.props.task
        const updateParams = {}

        if (task.get('story_type') === 'feature' && task.get('estimate') === undefined) {
            const project = AppStore.getState().project
            updateParams.estimate = +project.get('point_scale').split(',')[0]
        }

        updateParams.current_state = newState

        TaskActions.updateTask(task.get('id'), updateParams)
    }

    editTask(id, name) {
        TaskActions.updateTask(id, { name })
    }

    deleteTask(id) {
        if (confirm(`Are you sure you want to delete task #${id}?`)) {
            TaskActions.deleteTask(id)
        }
    }
    
}

export default Task

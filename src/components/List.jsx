import React, { Component, PropTypes } from 'react'
import AltContainer from 'alt-container'
import { Badge, Glyphicon } from 'react-bootstrap'
import { DropTarget } from 'react-dnd'
import Tasks from './Tasks'
import TaskStore from '../stores/TaskStore'
import ListActions from '../actions/ListActions'
import ItemTypes from '../constants'

const listTarget = {
    hover(targetProps, monitor) {
        const sourceId = monitor.getItem().id
        const listId = targetProps.list.id

        if (!targetProps.list.tasks.size && monitor.canDrop()) {
            ListActions.attachList({
                sourceId,
                listId
            }) 
        }
    },

    drop(targetProps, monitor) {
        const sourceId = monitor.getItem().id
        const list = targetProps.list
        const index = list.tasks.indexOf(sourceId)

        const afterId = list.tasks.first() === sourceId 
            ? null
            : list.tasks.get(index - 1) 

        const beforeId = list.tasks.last() === sourceId
            ? null
            : list.tasks.get(index + 1)  

        return {
            afterId,
            beforeId,
            newListId: list.id,
            defaultState: list.states[0]
        }
    },

    canDrop(targetProps, monitor) {
        const listStates = targetProps.list.states

        const types = TaskStore.getState().types

        const typeStates = types.filter((type) => {
            return type.name === monitor.getItem().storyType
        })[0].states

        const intersection = listStates.filter((state) => { 
            return typeStates.indexOf(state) > -1 
        })

        if (intersection.length > 0) {
            return true
        } else {
            return false
        }

    }
}

@DropTarget(ItemTypes.TASK, listTarget, (connect ,monitor) => ({
    connectDropTarget: connect.dropTarget()
}))
class List extends Component {
    constructor(props) {
        super(props)

        this.styles = {
            list: {
                background: '#505360',
                minHeight: '80vh'
            },
            header: {
                background: '#2E323E',
                padding: 10,
                color: '#858E99',
            },
            headerText: {
                fontSize: 22,
                fontFamily: 'Raleway, sans-serif'
            },
            badge: {
                marginTop: 5,
                background: '#858E99',
                color: '#20232B',
            },
            addTask: {
                margin: '1px 5px',
                color: '#858E99',
                cursor: 'pointer',
                background: '#2E323E',
                fontSize: 'x-large',
            },
            icon: {
                top: -1,
                marginRight:10 
            }
        }

    }

    static propTypes = {
        list: PropTypes.object.isRequired,
        onAddTask: PropTypes.func.isRequired
    };

    render() {
        const {list, connectDropTarget, onAddTask, ...props } = this.props
        return connectDropTarget(
            <div style={this.styles.list}>
                <div style={this.styles.header}>
                    <Glyphicon glyph="list" style={this.styles.icon}/>
                    <span style={this.styles.headerText}>{list.name}</span>

                    <Badge style={this.styles.badge}
                        pullRight={true}>{list.tasks.size}</Badge>
                    <Badge style={this.styles.addTask}
                        onClick={this.props.onAddTask.bind(this, list)}
                        title="Add task to list"
                        pullRight={true}>+</Badge> </div>

                <AltContainer
                    stores={[TaskStore]}
                    inject={{
                        tasks: TaskStore.get(list.tasks) || [],
                    }}
                    component={Tasks} />
            </div>
        )
    }
    
}

export default List

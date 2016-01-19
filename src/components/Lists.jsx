import React, { Component, PropTypes } from 'react'
import { Button, Col, Input, Modal, OverlayTrigger } from 'react-bootstrap'
import List from './List'
import TaskStore from '../stores/TaskStore'
import AddTaskForm from './AddTaskForm'
import ListStore from '../stores/ListStore'

class Lists extends Component {
    constructor(props) {
        super(props)

        this.styles = {
            lists: {
                marginTop: 90
            }
        }

        this.state = {
            showAddTask: false,
            addList: null
        }

        // this.openAddTask = this.openAddTask.bind(this)
        // this.closeAddTask = this.closeAddTask.bind(this)
    }

    static propTypes = {
        lists: PropTypes.array.isRequired
    };

    render() {
        const lists = this.props.lists

        const modal = this.state.showAddTask ?  this.renderAddTask() : null

        return (
            <div>
                <div className="lists" style={this.styles.lists}>
                    {lists.map(this.renderList, this)}
                </div>
                {modal}
            </div>
        )
    }

    renderAddTask() {
        return (
            <Modal show={this.state.showAddTask} onHide={this.closeAddTask}>
                <Modal.Header closeButton>
                    <Modal.Title>Add task to {this.state.addList.name}</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <AddTaskForm addList={this.state.addList} onClose={this.closeAddTask} />

                </Modal.Body>
            </Modal>
        )
    }


    renderList(list) {
        return (
            <Col xs={4} key={list.id}>
                <List list={list} onAddTask={this.openAddTask}/>
            </Col>
        )
    }

    openAddTask = (addList) => {
        this.setState({ showAddTask: true, addList })
	};

    closeAddTask = () => {
        this.setState({ showAddTask: false })
    };
}

export default Lists

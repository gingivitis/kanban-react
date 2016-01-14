import React, { Component } from 'react'
import { Badge, Button, Glyphicon, Grid, Navbar, Row } from 'react-bootstrap'
import AltContainer from 'alt-container'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import AppStore from '../stores/AppStore'
import ListStore from '../stores/ListStore'
import AppActions from '../actions/AppActions'
import TaskActions from '../actions/TaskActions'
import Editable from './Editable'
import Lists from './Lists'

@DragDropContext(HTML5Backend)
class App extends Component {
    constructor(props) {
        super(props)

        this.state = AppStore.getState()

        this.styles = {
            name: {
                fontSize: 35,
                height: 70,
                lineHeight: 1,
                fontFamily: 'Raleway, sans-serif',
            },
            navbar: {
                backgroundColor: '#2E323E',
                borderColor: '#1D1F26'
            }
        }

        this.onChange = this.onChange.bind(this)
        this.editProjectName = this.editProjectName.bind(this)
    }

    closeModal() {
        this.setState({ showAddTask: false })
    }

    openModal() {
        this.setState({ showAddTask: true })
    }

    componentDidMount() {
        AppActions.getProject()
        TaskActions.fetchTasks()
        AppStore.listen(this.onChange)
    }

    componentWillUnmount() {
        AppStore.unlisten(this.onChange)
    }

    onChange(s) {
        this.setState(s)
    }

    editProjectName(name) {
        AppActions.editProject({ name })
    }

    addTask() {
        alert('add task!')
    }

    render() {
        return (
            <Grid fluid={true}>
                <Row>
                    <Navbar inverse fixedTop fluid style={this.styles.navbar}>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <Editable value={this.state.project.get('name')}
                                    onEdit={this.editProjectName}
                                    style={this.styles.name}
                                    type="text" />
                            </Navbar.Brand>
                        </Navbar.Header>
                    </Navbar>
                    <AltContainer 
                        stores={[ListStore]}
                        inject={{
                            lists: ListStore.getState().lists
                        }}
                        component={Lists}
                    />
                </Row>
            </Grid>
        )
    }
    
}

export default App

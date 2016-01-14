import React, { Component, PropTypes } from 'react'
import { Button, Input } from 'react-bootstrap'
import { Form, ValidatedInput } from 'react-bootstrap-validation'
import TaskActions from '../actions/TaskActions'
import ListStore from '../stores/ListStore'
import TaskStore from '../stores/TaskStore'
import AppStore from '../stores/AppStore'

class AddTaskForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            storyType: ''
        }

        this.lists = ListStore.getState().lists

        this.types = TaskStore.getState().types

        this.styles = {
            actions: {
                padding: 15,
                textAlign: 'right',
                borderTop: '1px solid #e5e5e5',
                margin: '0 -15px'
            },
            button: {
                marginRight: 10
            }
        }

        this.handleChange = this.handleChange.bind(this)
		this.handleValidSubmit = this.handleValidSubmit.bind(this)
		this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this)
    }

    static propTypes = {
        addList: PropTypes.object.isRequired
    };
    
    render() {
        const storyType = this.renderStoryType()

        const stateOptions = this.state.storyType ? this.renderState() : null

        return (
            <Form
                onValidSubmit={this.handleValidSubmit}
                onInvalidSubmit={this.handleInvalidSubmit}>

                <ValidatedInput
                    type="textarea"
                    label="Task"
                    name="name"
                    placeholder="Task description"
                    validate="required"
                    errorHelp={{
                        required: "Please enter task name",
                    }}
                    onChange={this.handleChange} />
                {storyType}
                {stateOptions}
                <div className="actions" style={this.styles.actions}>
                    <Button onClick={this.props.onClose} style={this.styles.button}>Close</Button>
                    <Button type="submit" bsStyle="success">Submit</Button>
                </div>
                
            </Form>
        )
    }

    handleValidSubmit(params) {
        // features need estimate!
        params.kind = "story"

        params.current_state = params.current_state || params.current_state_hidden
        delete params.current_state_hidden

        if (params.story_type === 'feature') {
            const project = AppStore.getState().project
            params.estimate = +project.get('point_scale').split(',')[0]
        }

        TaskActions.addTask(params)
        this.props.onClose()
    }

    handleInvalidSubmit(errors, values) {
        // console.log(errors, values)
    }

    renderState() {
        const states = this.allowedStates()

        if (states.size > 1) {
            const options = []
            for (let [key, option] of states.entries()) {
                options.push(this.renderStateOptions(option, key)) 
            }

            return (
                <ValidatedInput 
                    type="select"
                    label="State"
                    placeholder="select"
                    name="current_state"
                    validate="required"
                    errorHelp={{
                        required: "Please select task status"
                    }}>

                    <option value="">Select...</option>
                    {options}
                </ValidatedInput>
            )
        } else {
            // dont show dropdown if only one state
            return (
                <ValidatedInput type="hidden" name="current_state_hidden" defaultValue={[...states][0]} />
            )
        }
    }

    renderStateOptions(state, key) {
        return (
            <option value={state} key={key}>
                {state[0].toUpperCase() + state.slice(1)}
            </option>
        )
    }

    renderStoryType() {
        const options = []
        for (let [key, option] of this.allowedStoryTypes().entries()) {
            options.push(this.renderStoryTypeOptions(option, key))
        } 

        return (
            <ValidatedInput
                type="select"
                label="Type"
                name="story_type"
                validate="required"
                ref="storyType"
                onChange={this.handleChange}
                errorHelp={{
                    required: "Please select task type",
                }}>
                <option value="">Select...</option>
                {options}
            </ValidatedInput>
        )
    }

    renderStoryTypeOptions(storyType, key) {
        return (
            <option value={storyType} key={key}>
                {storyType[0].toUpperCase() + storyType.slice(1)}
            </option>
        )
    }

    handleChange() {
        // This could also be done using ReactLink:
        // http://facebook.github.io/react/docs/two-way-binding-helpers.html
        this.setState({
            storyType: this.refs.storyType.getValue()
        })
    }


    allowedStoryTypes() {
        const listId = this.props.addList.id
        const lists = this.lists
        const types = this.types

        // get the states that this list allows
        const states = lists.filter((list) => {
            return list.id === listId
        })[0].states

        const allowedTypes = new Set()
        states.forEach((state) => {
            // now loop through types that have this state
            types.forEach((type) => {
                if (type.states.indexOf(state) > -1) {
                    allowedTypes.add(type.name)
                }
            })
        })

        return allowedTypes
    }

    allowedStates() {
        const listId = this.props.addList.id
        const storyType = this.state.storyType
        const types = this.types
        const lists = this.lists

        // get the states that this type allows
        const typeStates = types.filter((type) => {
            return type.name === storyType
        })[0].states

        // get the states that this list allows
        const listStates = lists.filter((list) => {
            return list.id === listId
        })[0].states

        const intersection = new Set(listStates.filter((state) => { 
            return typeStates.indexOf(state) > -1 
        }))

        return intersection 
    }
}

export default AddTaskForm

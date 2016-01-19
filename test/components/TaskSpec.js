import React from 'react'
import { shallow, mount } from 'enzyme'
import { expect } from 'chai'
import { spy } from 'sinon'
import TestBackend from 'react-dnd-test-backend'
import {DragDropContext} from 'react-dnd'
import { fromJSGreedy } from 'app/utils/ImmutableHelpers'
import { DropdownButton, Label } from 'react-bootstrap'
import uuid from 'node-uuid'

import Task from 'app/components/Task'
import Editable from 'app/components/Editable'

describe('Task', () => {
    var wrapper, task, WrappedTask

    beforeEach(() => {
        task = {
            id: uuid.v4(),
            name: 'Consectetur adipisicing elit',
            story_type: "feature",
            current_state: "started",
            labels: []
        }

        WrappedTask = wrapInTestContext(Task)
        wrapper = mount(<WrappedTask className="task" task={fromJSGreedy(task)} id={task.id} />)
    })

    it('should render a task', () => {
        expect(wrapper.find('.task')).to.have.length(1)

        expect(wrapper.type()).to.equal(WrappedTask)
    })

    it('should render story title', () => {
        expect(wrapper.find('.value').text()).to.eql(task.name)
    })

    it('should render states dropdown', () => {
        expect(wrapper.find('.dropdown-menu')).to.be.ok
    })

    it('should render story type', () => {
        expect(wrapper.find('.story-type').text()).to.eql(task.story_type)
    })

    it('type feature should render 6 status options', () => {
        expect(wrapper.find('.dropdown-menu').children()).to.have.length(6)
    })

    it('type chore should render 3 status options', () => {
        task.story_type = 'chore'
        wrapper.setProps({
            task: fromJSGreedy(task)
        })
        expect(wrapper.find('.dropdown-menu').children()).to.have.length(3)
    })

    it('type bug should render 6 status options', () => {
        task.story_type = 'bug'
        wrapper.setProps({
            task: fromJSGreedy(task)
        })
        expect(wrapper.find('.dropdown-menu').children()).to.have.length(6)
    })

    it('type release should render 2 status options', () => {
        task.story_type = 'release'
        wrapper.setProps({
            task: fromJSGreedy(task)
        })
        expect(wrapper.find('.dropdown-menu').children()).to.have.length(2)
    })

    it('should render labels', () => {
        task.labels = [{
            id: uuid.v4(),
            kind: "label",
            name: "shopper"
        }, {
            id: uuid.v4(),
            kind: "label",
            name: "ui"
        }]

        wrapper.setProps({
            task: fromJSGreedy(task)
        })

        expect(wrapper.find(Label)).to.have.length(2)
        expect(wrapper.find('.label').at(0).text()).to.eql(task.labels[0].name)
        expect(wrapper.find('.label').at(1).text()).to.eql(task.labels[1].name)
    })

    it('should invoke onDelete when delete icon clicked', () => {
        const onDelete = spy()
        wrapper.setProps({
            onDelete
        })

        wrapper.find('.glyphicon-trash').simulate('click')
        expect(onDelete).to.have.been.called
    })

    it('status unstarted should have #4388FF border', () => {
        task.current_state = 'unstarted'

        wrapper.setProps({
            task: fromJSGreedy(task)
        })

        expect(wrapper.find('.task').props().style.borderColor).to.eql('#4388FF')
    })

    it('status started should have #FCAC79 border', () => {
        task.current_state = 'started'

        wrapper.setProps({
            task: fromJSGreedy(task)
        })

        expect(wrapper.find('.task').props().style.borderColor).to.eql('#FCAC79')
    })

    it('status finished should have #D3E173 border', () => {
        task.current_state = 'finished'

        wrapper.setProps({
            task: fromJSGreedy(task)
        })

        expect(wrapper.find('.task').props().style.borderColor).to.eql('#D3E173')
    })

    it('status delivered should have #CC96EF border', () => {
        task.current_state = 'delivered'

        wrapper.setProps({
            task: fromJSGreedy(task)
        })

        expect(wrapper.find('.task').props().style.borderColor).to.eql('#CC96EF')
    })

    it('status rejected should have #FA6E6E border', () => {
        task.current_state = 'rejected'

        wrapper.setProps({
            task: fromJSGreedy(task)
        })

        expect(wrapper.find('.task').props().style.borderColor).to.eql('#FA6E6E')
    })

    it('status accepted should have #7EC871 border', () => {
        task.current_state = 'accepted'

        wrapper.setProps({
            task: fromJSGreedy(task)
        })

        expect(wrapper.find('.task').props().style.borderColor).to.eql('#7EC871')
    })
})

function wrapInTestContext(DecoratedComponent) {
    @DragDropContext(TestBackend)
    class TestContextContainer extends React.Component {
        render() {
            return <DecoratedComponent {...this.props} />
        }
    }

    return TestContextContainer
}

import React from 'react'
import { shallow, mount } from 'enzyme'
import { spy } from 'sinon'
import { expect } from 'chai'
import Immutable from 'immutable'
import uuid from 'node-uuid'
import { Form, ValidatedInput } from 'react-bootstrap-validation'

import AddTaskForm from 'app/components/AddTaskForm'
import ListStore from 'app/stores/ListStore'

describe('AddTaskForm', () => {
    var wrapper, lists

    before(() => {
        lists = ListStore.getState().lists
        wrapper = mount(<AddTaskForm addList={lists[0]} />)
    })

    it('should create form', () => {
        expect(wrapper.find(Form)).to.have.length(1)
    })

    it('should validate task name input', () => {
        const textArea = wrapper.find(ValidatedInput).at(0)

        expect(textArea.props().validate("\n \t")).to.be.false

        expect(textArea.props().validate("lorem ipsum")).to.be.true
    })

    describe('Backlog', () => {
        beforeEach(() => {
            wrapper = mount(<AddTaskForm addList={lists[0]} />)
        })

        it('should not show state options for features', () => {
            wrapper.setState({
                storyType: 'feature'
            })

            const select = wrapper.find('select')

            expect(select).to.have.length(1)
            expect(wrapper.find('input[type="hidden"]')).to.have.length(1)

            expect(wrapper.find('input[type="hidden"]').props()).to.have.property('defaultValue', 'unstarted')
        })

        it('should not show state options for chores', () => {
            wrapper.setState({
                storyType: 'chore'
            })

            const select = wrapper.find('select')

            expect(select).to.have.length(1)
            expect(wrapper.find('input[type="hidden"]')).to.have.length(1)

            expect(wrapper.find('input[type="hidden"]').props()).to.have.property('defaultValue', 'unstarted')
        })

        it('should not show state options for bugs', () => {
            wrapper.setState({
                storyType: 'bug'
            })

            const select = wrapper.find('select')

            expect(select).to.have.length(1)
            expect(wrapper.find('input[type="hidden"]')).to.have.length(1)

            expect(wrapper.find('input[type="hidden"]').props()).to.have.property('defaultValue', 'unstarted')
        })

        it('should not show state options for releases', () => {
            wrapper.setState({
                storyType: 'release'
            })

            const select = wrapper.find('select')

            expect(select).to.have.length(1)
            expect(wrapper.find('input[type="hidden"]')).to.have.length(1)

            expect(wrapper.find('input[type="hidden"]').props()).to.have.property('defaultValue', 'unstarted')
        })
    })

    describe('Working', () => {
        beforeEach(() => {
            wrapper = mount(<AddTaskForm addList={lists[1]} />)
        })

        it('should show 4 state options for features', () => {
            wrapper.setState({
                storyType: 'feature'
            })
            const stateSelect = wrapper.find('select').at(1)
            expect(stateSelect.children().not('.default')).to.have.length(4)
        })

        it('should not show state select for chores', () => {
            wrapper.setState({
                storyType: 'chore'
            })
            const select = wrapper.find('select')

            expect(select).to.have.length(1)
            expect(wrapper.find('input[type="hidden"]')).to.have.length(1)

            expect(wrapper.find('input[type="hidden"]').props()).to.have.property('defaultValue', 'started')
        })

        it('should show 4 state options for bugs', () => {
            wrapper.setState({
                storyType: 'bug'
            })
            const stateSelect = wrapper.find('select').at(1)
            expect(stateSelect.children().not('.default')).to.have.length(4)
        })

        it('should not include type release', () => {
            const typeSelect = wrapper.find('select').at(0)

            expect(typeSelect.children('[value="release"]')).to.have.length(0)
        })
    })

    describe('Done', () => {
        beforeEach(() => {
            wrapper = mount(<AddTaskForm addList={lists[2]} />)
        })

        it('should not show state options for features', () => {
            wrapper.setState({
                storyType: 'feature'
            })

            const select = wrapper.find('select')

            expect(select).to.have.length(1)
            expect(wrapper.find('input[type="hidden"]')).to.have.length(1)

            expect(wrapper.find('input[type="hidden"]').props()).to.have.property('defaultValue', 'accepted')
        })

        it('should not show state options for chores', () => {
            wrapper.setState({
                storyType: 'chore'
            })

            const select = wrapper.find('select')

            expect(select).to.have.length(1)
            expect(wrapper.find('input[type="hidden"]')).to.have.length(1)

            expect(wrapper.find('input[type="hidden"]').props()).to.have.property('defaultValue', 'accepted')
        })

        it('should not show state options for bugs', () => {
            wrapper.setState({
                storyType: 'bug'
            })

            const select = wrapper.find('select')

            expect(select).to.have.length(1)
            expect(wrapper.find('input[type="hidden"]')).to.have.length(1)

            expect(wrapper.find('input[type="hidden"]').props()).to.have.property('defaultValue', 'accepted')
        })

        it('should not show state options for releases', () => {
            wrapper.setState({
                storyType: 'release'
            })

            const select = wrapper.find('select')

            expect(select).to.have.length(1)
            expect(wrapper.find('input[type="hidden"]')).to.have.length(1)

            expect(wrapper.find('input[type="hidden"]').props()).to.have.property('defaultValue', 'accepted')
        })
    })

})

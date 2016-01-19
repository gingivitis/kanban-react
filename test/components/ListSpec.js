import React from 'react'
import { shallow, mount } from 'enzyme'
import { expect } from 'chai'
import { spy } from 'sinon'
import TestBackend from 'react-dnd-test-backend'
import { DragDropContext } from 'react-dnd'
import { Badge, Glyphicon } from 'react-bootstrap'
import Immutable from 'immutable'

import { fromJSGreedy } from 'app/utils/ImmutableHelpers'
import List from 'app/components/List'
import ListStore from 'app/stores/ListStore'

describe('List', () => {
    var wrapper, list, addTask

    beforeEach(() => {
        addTask = spy()
        list = ListStore.getState().lists[0]

        const WrappedList = wrapInTestContext(List)

        wrapper = mount(<WrappedList list={list} onAddTask={addTask}/>)
    })

    it('should render a heading', () => {
        expect(wrapper.find('.list-header').text()).to.eql(list.name)
    })

    it('should trigger the addTask modal', () => {
        wrapper.find('.add-task').simulate('click')

        expect(addTask).to.have.been.called
    })

    it('should display the correct count', () => {
        expect(wrapper.find('.task-count').text()).to.eql('0')
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

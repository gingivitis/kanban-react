import React from 'react'
import { shallow, mount } from 'enzyme'
import { spy, fakeServer } from 'sinon'
import { expect } from 'chai'
import TestBackend from 'react-dnd-test-backend'
import {DragDropContext} from 'react-dnd'
import Immutable from 'immutable'

import App from 'app/components/App'
import Editable from 'app/components/Editable'

describe('App', () => {
    var server, WrappedApp

    beforeEach(() => {
        server = fakeServer.create()

        var projectResponse = [
            200,
            { 'Content-type': 'application/json' },
            '{"name": "hello world"}'
        ]

        var tasks = [
            {id: 0, name: 'hello'},
            {id: 1, name: 'yellow'},
            {id: 2, name: 'fever'},
        ]

        var tasksResponse = [
            200,
            { 'Content-type': 'application/json' },
            JSON.stringify(tasks)
        ]

        server.respondWith('GET', '/project', projectResponse)
        server.respondWith('GET', '/tasks', tasksResponse)
        WrappedApp = wrapInTestContext(App)
    })

    afterEach(() => {
        // server.restore()
    })

    it('should load the app', () => {
        const wrapper = mount(<WrappedApp />)

        wrapper.setState({
            project: Immutable.Map({
                "id": 1513984,
                "kind": "project",
                "name": "KanBan!",
                "point_scale": "0,1,2,3"
            })
        })

        // expect(wrapper.find('.value').text()).to.eql('KanBan!')
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

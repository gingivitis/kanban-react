import React from 'react'
import { shallow, mount } from 'enzyme'
import { expect } from 'chai'
import { spy } from 'sinon'
import Immutable from 'immutable'
import uuid from 'node-uuid'

import { fromJSGreedy } from 'app/utils/ImmutableHelpers'
import Tasks from 'app/components/Tasks'
import Task from 'app/components/Task'

describe('Tasks', () => {
    var wrapper, tasks

    beforeEach(() => {
        const tasks = fromJSGreedy([
            { id:uuid.v4(), name: 'Lorem ipsum dolor sit ameta' },
            { id:uuid.v4(), name: 'Takimata sanctus est ameta' },
            { id:uuid.v4(), name: 'Tempor invidunt ut labore' }
        ])

        wrapper = shallow(<Tasks tasks={tasks}/>)
    })

    it('should render 3 tasks', () => {
        expect(wrapper.find(Task)).to.have.length(3)
    })
})

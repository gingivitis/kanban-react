import TaskActions from 'app/actions/TaskActions'
import TaskStore from 'app/stores/TaskStore'
import alt from 'app/libs/alt'
import { fromJSGreedy } from 'app/utils/ImmutableHelpers'
import Immutable from 'immutable'
import { expect } from 'chai'
import { spy } from 'sinon'
import uuid from 'node-uuid'

describe('TaskStore', () => {
    beforeEach(() => {
    })

    it('creates tasks', () => {
        const data = {
            id: uuid.v4(),
            name: 'Lorem ipsum amet dolar sig',
            story_type: 'feature',
            estimate: 0,
            current_state: 'unstarted',
            labels: []
        }

        TaskActions.addTaskSuccess({data})

        expect(TaskStore.getState().tasks.get(data.id).toJS()).to.eql(data)
    })

    it('updates tasks', () => {
        const data = {
            id: uuid.v4(),
            name: 'Lorem ipsum amet dolar sig',
            story_type: 'feature',
            estimate: 0,
            current_state: 'unstarted',
            labels: []
        }

        TaskActions.addTaskSuccess({data})
        const name = 'Mollit anim id est laborum'

        TaskActions.updateTask(data.id, { name })
        expect(TaskStore.getState().tasks.get(data.id).get('name')).to.eql(name)
    })

    it('gets tasks', () => {
        const data = {
            id: uuid.v4(),
            name: 'Lorem ipsum amet dolar sig',
            story_type: 'feature',
            estimate: 0,
            current_state: 'unstarted',
            labels: []
        }

        TaskActions.addTaskSuccess({data})

        const tasks = TaskStore.get([data.id])
        expect(tasks.length).to.eql(1)
        expect(tasks[0].toJS()).to.eql(data)
    })

    it('deletes tasks', () => {
        const data = {
            id: uuid.v4(),
            name: 'Lorem ipsum amet dolar sig',
            story_type: 'feature',
            estimate: 0,
            current_state: 'unstarted',
            labels: []
        }

        TaskActions.addTaskSuccess({data})
        expect(TaskStore.getState().tasks.get(data.id)).to.be.ok

        TaskActions.deleteTaskSuccess({data: {id: data.id}})
        expect(TaskStore.getState().tasks.get(data.id)).to.not.be.ok
    })

})

import ListActions from 'app/actions/ListActions'
import TaskActions from 'app/actions/TaskActions'
import ListStore from 'app/stores/ListStore'
import TaskStore from 'app/stores/TaskStore'
import uuid from 'node-uuid'
import alt from 'app/libs/alt'
import { fromJSGreedy } from 'app/utils/ImmutableHelpers'
import Immutable from 'immutable'
import { expect } from 'chai'

describe('ListStore', () => {

    it('initializes lists after fetching tasks', () => {
        const tasks = {
            data: [{
                id: uuid.v4(),
                name: 'Lorem ipsum amet dolar sig',
                story_type: 'feature',
                estimate: 0,
                current_state: 'unstarted',
                labels: []
            }, {
                id: uuid.v4(),
                name: 'Lorem ipsum amet dolar sig',
                story_type: 'feature',
                estimate: 0,
                current_state: 'started',
                labels: []
            }, {
                id: uuid.v4(),
                name: 'Lorem ipsum amet dolar sig',
                story_type: 'feature',
                estimate: 0,
                current_state: 'rejected',
                labels: []
            }]
        }

        TaskActions.fetchTasksSuccess(tasks)

        const lists = ListStore.getState().lists

        expect(lists[0].tasks.size).to.eql(1)
        expect(lists[1].tasks.size).to.eql(2)
        expect(lists[2].tasks.size).to.eql(0)

    })

    it('should move a task to the right list after updating', () => {
        const data = {
            id: uuid.v4(),
            name: 'Lorem ipsum amet dolar sig',
            story_type: 'feature',
            estimate: 0,
            current_state: 'unstarted',
            labels: []
        }
        const lists = ListStore.getState().lists

        TaskActions.addTaskSuccess({data})
        const current_state = 'started'

        expect(lists[0].tasks.indexOf(data.id)).to.be.above(-1)

        TaskActions.updateTask(data.id, { current_state })

        expect(lists[0].tasks.indexOf(data.id)).to.eql(-1)
        expect(lists[1].tasks.indexOf(data.id)).to.be.above(-1)
    })

    it('should remove a task from the list after deleting', () => {
        const data = {
            id: uuid.v4(),
            name: 'Lorem ipsum amet dolar sig',
            story_type: 'feature',
            estimate: 0,
            current_state: 'unstarted',
            labels: []
        }
        const lists = ListStore.getState().lists

        TaskActions.addTaskSuccess({data})

        expect(lists[0].tasks.indexOf(data.id)).to.be.above(-1)

        TaskActions.deleteTask(data.id)
        expect(lists[0].tasks.indexOf(data.id)).to.eql(-1)
    })

    it('should move a source task to a target task\'s list', () => {
        const source = {
            id: uuid.v4(),
            name: 'Lorem ipsum amet dolar sig',
            story_type: 'feature',
            estimate: 0,
            current_state: 'unstarted',
            labels: []
        }

        const target = {
            id: uuid.v4(),
            name: 'Lorem ipsum amet dolar sig',
            story_type: 'feature',
            estimate: 0,
            current_state: 'started',
            labels: []
        }

        const lists = ListStore.getState().lists
        TaskActions.addTaskSuccess({data: source})
        TaskActions.addTaskSuccess({data: target})

        expect(lists[0].tasks.indexOf(source.id)).to.be.above(-1)

        ListActions.moveList({
            sourceId: source.id,
            targetId: target.id
        })

        expect(lists[0].tasks.indexOf(source.id)).to.eql(-1)
        expect(lists[1].tasks.indexOf(source.id)).to.be.above(-1)
    })

    it('should attach a source task to a target list', () => {
        const source = {
            id: uuid.v4(),
            name: 'Lorem ipsum amet dolar sig',
            story_type: 'feature',
            estimate: 0,
            current_state: 'unstarted',
            labels: []
        }

        const lists = ListStore.getState().lists
        TaskActions.addTaskSuccess({data: source})

        expect(lists[0].tasks.indexOf(source.id)).to.be.above(-1)

        const listId = lists[2].id
        ListActions.attachList({sourceId: source.id, listId})

        expect(lists[0].tasks.indexOf(source.id)).to.eql(-1)
        expect(lists[2].tasks.indexOf(source.id)).to.eql(0)
    })
})

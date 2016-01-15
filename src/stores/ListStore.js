import alt from '../libs/alt'
import uuid from 'node-uuid'
import { decorate, bind } from 'alt-utils/lib/decorators'
import update from 'react-addons-update'
import Immutable from 'immutable'
import { fromJSOrdered, fromJSGreedy } from '../utils/ImmutableHelpers'
import ListActions from '../actions/ListActions'
import TaskActions from '../actions/TaskActions'
import TaskStore from './TaskStore'

@decorate(alt)
class ListStore {
    constructor() {
        this.lists = [{
            id: uuid.v4(),
            name: 'Backlog',
            states: ['unstarted'],
            tasks: Immutable.List()
        }, {
            id: uuid.v4(),
            name: 'Working',
            states: ['started', 'finished', 'delivered', 'rejected'],
            tasks: Immutable.List()
        }, {
            id: uuid.v4(),
            name: 'Done',
            states: ['accepted'],
            tasks: Immutable.List()
        }]
    }

    @bind(TaskActions.FETCH_TASKS_SUCCESS)
    initTasks(response) {
        this.waitFor(TaskStore.dispatchToken)
        const tasks = response.data

        tasks.forEach((task) => {
            for (var i = 0, len = this.lists.length; i < len; i++) {
                if (this.lists[i].states.indexOf(task.current_state) > -1) {
                    const list = this.lists[i]
                    list.tasks = list.tasks.push(task.id)
                    break
                }
            }
        })
    }

    @bind(TaskActions.UPDATE_TASK_SUCCESS)
    updateList(response) {
        this.waitFor(TaskStore.dispatchToken)

        const task = response.data

        const currentList = this.lists.filter((list) => {
            return list.tasks.includes(task.id)
        })[0]

        if (currentList.states.indexOf(task.current_state) === -1) {
            console.log("value")
            let index = currentList.tasks.findIndex((taskId) => {
                return taskId === task.id
            })

            currentList.tasks = currentList.tasks.remove(index)

            const targetList = this.lists.filter((list) => {
                return list.states.indexOf(task.current_state) > -1
            })[0]

            targetList.tasks = targetList.tasks.unshift(task.id)
        }
    }

    @bind(TaskActions.ADD_TASK_SUCCESS)
    addToList(response) {
        this.waitFor(TaskStore.dispatchToken)
        const task = response.data

        const targetList = this.lists.filter((list) => {
            return list.states.indexOf(task.current_state) > -1
        })[0]

        targetList.tasks = targetList.tasks.push(task.id)
    }

    @bind(TaskActions.DELETE_TASK_SUCCESS)
    deleteFromList(response) {
        this.waitFor(TaskStore.dispatchToken)

        const taskId = +response.data.id

        const list = this.lists.filter((list) => {
            return list.tasks.includes(taskId)
        })[0]
        const index = list.tasks.indexOf(taskId)

        list.tasks = list.tasks.remove(index)
    }

    @bind(ListActions.MOVE_LIST)
    moveList({sourceId, targetId}) {
        const lists = this.lists

        const sourceList = lists.filter((list) => {
            return list.tasks.includes(sourceId)
        })[0]

        const targetList = lists.filter((list) => {
            return list.tasks.includes(targetId)
        })[0]

        const sourceIndex = sourceList.tasks.indexOf(sourceId)
        const targetIndex = targetList.tasks.indexOf(targetId)

        if (sourceList === targetList) {
            sourceList.tasks = Immutable.List(update(sourceList.tasks.toJS(), {
                $splice: [
                    [sourceIndex, 1],
                    [targetIndex, 0, sourceId]
                ]
            }))
        } else {
            sourceList.tasks = sourceList.tasks.remove(sourceIndex)
            targetList.tasks = targetList.tasks.splice(targetIndex, 0, sourceId)
        }
    }

    @bind(ListActions.ATTACH_LIST)
    attachList({sourceId, listId}) {
        const lists = this.lists

        // remove task from old list
        lists.forEach((list) => {
            const taskIndex = list.tasks.indexOf(sourceId)
            if (taskIndex > -1) {
                list.tasks = list.tasks.delete(taskIndex)
            }
        })

        // attach task to new list
        const targetList = lists.filter((list) => {
            return list.id === listId
        })[0]

        targetList.tasks = targetList.tasks.push(sourceId)
    }
}

export default alt.createStore(ListStore, 'ListStore')

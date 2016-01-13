import alt from '../libs/alt'
import uuid from 'node-uuid'
import { decorate, bind } from 'alt-utils/lib/decorators'
import update from 'react-addons-update'
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
            tasks: []
        }, {
            id: uuid.v4(),
            name: 'Working',
            states: ['started', 'finished', 'delivered', 'rejected'],
            tasks: []
        }, {
            id: uuid.v4(),
            name: 'Done',
            states: ['accepted'],
            tasks: []
        }]
    }

    @bind(TaskActions.FETCH_TASKS_SUCCESS)
    initTasks(response) {
        this.waitFor(TaskStore.dispatchToken)
        const tasks = response.data

        tasks.forEach((task) => {
            for (var i = 0, len = this.lists.length; i < len; i++) {
                if (this.lists[i].states.indexOf(task.current_state) > -1) {
                    this.lists[i].tasks.push(task.id)
                    break
                }
            }
        })
    }

    @bind(TaskActions.UPDATE_TASK_SUCCESS)
    updateList(response) {
        this.waitFor(TaskStore.dispatchToken)

        const task = response.data
        const { id, current_state } = task

        const currentList = this.lists.filter((list) => {
            return list.tasks.indexOf(id) > -1
        })[0]

        if (currentList.states.indexOf(current_state) === -1) {
            let index = currentList.tasks.findIndex((taskId) => {
                return taskId === id
            })
            currentList.tasks.splice(index, 1)

            const targetList = this.lists.filter((list) => {
                return list.states.indexOf(current_state) > -1
            })[0]
            targetList.tasks.unshift(id)
        }
    }

    @bind(TaskActions.ADD_TASK_SUCCESS)
    addToList(response) {
        const task = response.data
        this.initTasks({data: [task]})
    }

    @bind(TaskActions.DELETE_TASK_SUCCESS)
    deleteFromList(response) {
        this.waitFor(TaskStore.dispatchToken)

        const taskId = +response.data.id

        const list = this.lists.filter((list) => {
            return list.tasks.indexOf(taskId) > -1
        })[0]

        const index = list.tasks.indexOf(taskId)
        list.tasks.splice(index, 1)
    }


    @bind(ListActions.MOVE_LIST)
    moveList({sourceId, targetId}) {
        const lists = this.lists

        const sourceList = lists.filter((list) => {
            return list.tasks.indexOf(sourceId) > -1
        })[0]

        const targetList = lists.filter((list) => {
            return list.tasks.indexOf(targetId) > -1
        })[0]

        const sourceIndex = sourceList.tasks.indexOf(sourceId)
        const targetIndex = targetList.tasks.indexOf(targetId)

        if (sourceList === targetList) {
            sourceList.tasks = update(sourceList.tasks, {
                $splice: [
                    [sourceIndex, 1],
                    [targetIndex, 0, sourceId]
                ]
            })
        } else {
            sourceList.tasks.splice(sourceIndex, 1)
            targetList.tasks.splice(targetIndex, 0, sourceId)
        }
    }

    @bind(ListActions.ATTACH_LIST)
    attachList({sourceId, listId}) {
        const lists = this.lists

        // remove task from old list
        lists.forEach((list) => {
            const taskIndex = list.tasks.indexOf(sourceId)
            if (taskIndex > -1) {
                list.tasks.splice(taskIndex, 1)
            }
        })

        // attach task to new list
        const targetList = lists.filter((list) => {
            return list.id === listId
        })[0]

        targetList.tasks.push(sourceId)
    }
}

export default alt.createStore(ListStore, 'ListStore')

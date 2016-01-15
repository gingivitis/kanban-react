import alt from '../libs/alt'
import { decorate, bind } from 'alt-utils/lib/decorators'
import Immutable from 'immutable'
import { fromJSOrdered, fromJSGreedy } from '../utils/ImmutableHelpers'
import TaskActions from '../actions/TaskActions'

@decorate(alt)
class TaskStore {
    constructor() {
        this.tasks = Immutable.Map()

        this.types = [{
            name: 'feature',
            states: ['unstarted', 'started', 'finished', 'delivered', 'rejected', 'accepted'],
        }, {
            name: 'chore',
            states: ['unstarted', 'started', 'accepted'],
        }, {
            name: 'bug',
            states: ['unstarted', 'started', 'finished', 'delivered', 'rejected', 'accepted'],
        }, {
            name: 'release',
            states: ['unstarted', 'accepted']
        }]

        this.exportPublicMethods({
            get: this.get.bind(this)
        })
    }

    get(ids) {
        return ( ids || [] ).map(id => this.tasks.get(String(id)))
    }

    @bind(TaskActions.FETCH_TASKS_SUCCESS)
    fetchTasksSuccess(response) {
        const tasks = {}
        response.data.forEach((task) => {
            tasks[task.id] = task
        })
        this.tasks = fromJSGreedy(tasks)
    }

    @bind(TaskActions.UPDATE_TASK)
    updateTask({id, params}) {
        let task = this.tasks.get(String(id))
        task = task.merge(params)

        this.tasks = this.tasks.set(String(id), task)
    }

    @bind(TaskActions.ADD_TASK_SUCCESS)
    @bind(TaskActions.UPDATE_TASK_SUCCESS)
    updateTaskSuccess(response) {
        const task = response.data
        this.tasks = this.tasks.set(String(task.id), fromJSGreedy(task))
    }

    @bind(TaskActions.DELETE_TASK_SUCCESS)
    deleteTaskSuccess(response) {
        const task = response.data
        this.tasks = this.tasks.remove(String(task.id))
    }

    @bind(TaskActions.ADD_TASK_ERROR, TaskActions.UPDATE_TASK_ERROR,
          TaskActions.DELETE_TASK_ERROR, TaskActions.FETCH_TASKS_ERROR)
    logTaskError(err) {
        console.log(err)
    }

}

export default alt.createStore(TaskStore, 'TaskStore')

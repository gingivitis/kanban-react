import alt from '../libs/alt'
import { decorate, bind } from 'alt-utils/lib/decorators'
import TaskActions from '../actions/TaskActions'

@decorate(alt)
class TaskStore {
    constructor() {
        this.tasks = []

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
        return ( ids || [] ).map((id) => this.tasks[this.findTaskIndex(id)])
    }

    findTaskIndex(id) {
        return this.tasks.findIndex((task) => task.id === id)
    }

    @bind(TaskActions.FETCH_TASKS_SUCCESS)
    fetchTasksSuccess(response) {
        this.setState({tasks: response.data})
    }

    @bind(TaskActions.FETCH_TASKS_ERROR)
    fetchTasksError(err) {
        alert(err)
    }

    @bind(TaskActions.UPDATE_TASK_SUCCESS)
    updateTaskSuccess(response) {
        const tasks = this.tasks
        const task = response.data

        const index = this.findTaskIndex(task.id)

        tasks.splice(index, 1, task)
        this.setState({ tasks })
    }

    @bind(TaskActions.UPDATE_TASK_ERROR)
    updateTaskError(err) {
        console.log(err)
    }

    @bind(TaskActions.ADD_TASK_SUCCESS)
    addTaskSuccess(response) {
        const tasks = this.tasks
        const task = response.data

        tasks.push(task)
        this.setState({ tasks })
    }

    @bind(TaskActions.ADD_TASK_ERROR)
    addTaskError(err) {
        console.log(err)
    }

    @bind(TaskActions.DELETE_TASK_SUCCESS)
    deleteTaskSuccess(response) {
        const taskId = response.data.id
        const tasks = this.tasks

        const index = this.findTaskIndex(taskId)

        tasks.splice(index, 1)
        this.setState({ tasks })
    }

    @bind(TaskActions.DELETE_TASK_ERROR)
    deleteTaskError(err) {
        console.log(err)
    }

}

export default alt.createStore(TaskStore, 'TaskStore')

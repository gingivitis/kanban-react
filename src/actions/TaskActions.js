import alt from '../libs/alt'
import KanBanWebAPI from '../utils/KanBanWebAPI'

class TaskActions {
    constructor() {
        let actions = [ 'fetchTasksSuccess', 'fetchTasksError',
            'updateTaskSuccess', 'updateTaskError', 'addTaskSuccess',
            'addTaskError', 'deleteTaskSuccess', 'deleteTaskError']
        this.generateActions(...actions) }

    fetchTasks() {
        return (dispatch) => {
            KanBanWebAPI.fetchTasks()
                .then(this.fetchTasksSuccess.bind(this))
                .catch(this.fetchTasksError.bind(this))
        }

    }

    updateTask(id, params) {
        return (dispatch) => {
            // dispatch(id) //-> TaskStore#updateTask
            KanBanWebAPI.updateTask(id, params)
                .then(this.updateTaskSuccess.bind(this))
                .catch(this.updateTaskError.bind(this))
        }
    }

    addTask(params) {
        return () => {
            KanBanWebAPI.addTask(params)
                .then(this.addTaskSuccess.bind(this))
                .catch(this.addTaskError.bind(this))
        }
    }

    deleteTask(id) {
        return () => {
            KanBanWebAPI.deleteTask(id)
                .then(this.deleteTaskSuccess.bind(this))
                .catch(this.deleteTaskError.bind(this))
        }
    }
}


export default alt.createActions(TaskActions)

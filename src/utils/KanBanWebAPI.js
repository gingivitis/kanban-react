import axios from 'axios'

class KanBanWebAPI {
    static getProject() {
        return axios.get('/project')
    }

    static editProject(params) {
        return axios.put('/project', params)
    }

    static fetchTasks() {
        return axios.get('/tasks')
    }

    static updateTask(id, params) {
        return axios.put(`/tasks/${id}`, params)
    }

    static addTask(params) {
        return axios.post('/tasks', params)
    }

    static deleteTask(id) {
        return axios.delete(`/tasks/${id}`)
    }
}

export default KanBanWebAPI

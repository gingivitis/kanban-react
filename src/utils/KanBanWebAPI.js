import axios from 'axios'

class KanBanWebAPI {
    static getProject() {
        return axios.get('/api/project')
    }

    static editProject(params) {
        return axios.put('/api/project', params)
    }

    static fetchTasks() {
        return axios.get('/api/tasks')
    }

    static updateTask(id, params) {
        return axios.put(`/api/tasks/${id}`, params)
    }

    static addTask(params) {
        return axios.post('/api/tasks', params)
    }

    static deleteTask(id) {
        return axios.delete(`/api/tasks/${id}`)
    }
}

export default KanBanWebAPI

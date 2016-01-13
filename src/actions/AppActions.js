import alt from '../libs/alt'
import KanBanWebAPI from '../utils/KanBanWebAPI'

class AppActions {
    constructor() {
        let actions = ['getProjectSuccess', 'getProjectError',
            'editProjectSuccess', 'editProjectError']
        this.generateActions(...actions)
    }

    getProject() {
        return () => {
            KanBanWebAPI.getProject()
                .then(this.getProjectSuccess.bind(this))
                .catch(this.getProjectError.bind(this))
        }
    }

    editProject(id, params) {
        return () => {
            KanBanWebAPI.editProject(id, params)
                .then(this.editProjectSuccess.bind(this))
                .catch(this.editProjectError.bind(this))
        }
    }

}

export default alt.createActions(AppActions)

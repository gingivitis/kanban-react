import alt from '../libs/alt'
import AppActions from '../actions/AppActions'
import { decorate, bind } from 'alt-utils/lib/decorators'

@decorate(alt)
class AppStore {
    constructor() {
        this.project = {}
        this.showAddTask = false
    }

    @bind(AppActions.GET_PROJECT_SUCCESS)
    getProjectSuccess(response) {
        this.setState({project: response.data})
    }

    @bind(AppActions.GET_PROJECT_ERROR)
    getProjectError(err) {
        console.log(err)
    }

    @bind(AppActions.EDIT_PROJECT_SUCCESS)
    editProjectSuccess(response) {
        this.setState({project: response.data})
    }

    @bind(AppActions.EDIT_PROJECT_ERROR)
    editProjectError(err) {
        console.log(err.data)
    }
}

export default alt.createStore(AppStore)

import alt from '../libs/alt'
import AppActions from '../actions/AppActions'
import { decorate, bind } from 'alt-utils/lib/decorators'
import Immutable from 'immutable'

@decorate(alt)
class AppStore {
    constructor() {
        this.project = Immutable.Map({})
        this.showAddTask = false

        // (lifecycleMethod: string, handler: function): undefined on: This
        // method can be used to listen to Lifecycle events. Normally would be
        // set up in the constructor
        this.on('init', this.bootstrap)
        this.on('bootstrap', this.bootstrap)

    }

    bootstrap() {
        if (!Immutable.Map.isMap(this.project)) {
            this.project = Immutable.fromJS(this.project)
        }
    }

    @bind(AppActions.GET_PROJECT_SUCCESS, AppActions.EDIT_PROJECT_SUCCESS)
    getProjectSuccess(response) {
        this.project = Immutable.fromJS(response.data)
    }

    @bind(AppActions.GET_PROJECT_ERROR, AppActions.EDIT_PROJECT_ERROR)
    projectError(err) {
        console.log(err)
    }

}

export default alt.createStore(AppStore)

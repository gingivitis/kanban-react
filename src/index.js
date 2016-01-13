import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

require('bootstrap/less/bootstrap.less')
require('./main.css')

ReactDOM.render(
    <App />,
    document.getElementById('app')
)

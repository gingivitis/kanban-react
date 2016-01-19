const path = require('path')
const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const API_BASE_URL = 'https://www.pivotaltracker.com/services/v5'
const USER_TOKEN = process.env.USER_TOKEN || exit('Must specify USER_TOKEN env variable')
const PROJECT_ID = process.env.PROJECT_ID || exit('Must specify PROJECT_ID env variable')

const app = express()
const staticPath = path.join(__dirname, './../build')

app.enable('trust proxy')

const request = axios.create({
    baseURL: API_BASE_URL,
    timeout: 2000,
    headers: {
        'X-TrackerToken': USER_TOKEN
    }
})

function exit(msg) {
    console.error(msg)
    process.exit()
}

app.use(bodyParser.json())

app.use(compression())

app.options('/api', cors())

app.get('/api/project', cors(), (req, res) => {
    request.get('/projects/' + PROJECT_ID)
        .then((response) => res.json(response.data))
        .catch((response) => res.status(response.status).json(response.data.error))
})

app.put('/api/project', cors(), (req, res) => {
    request.put('/projects/' + PROJECT_ID, req.body)
        .then((response) => res.json(response.data))
        .catch((response) => res.status(response.status).json(response.data.error))
})

app.post('/api/tasks', cors(), (req, res) => {
    request.post('/projects/' + PROJECT_ID + '/stories', req.body)
        .then((response) => res.json(response.data))
        .catch((response) => res.status(response.status).json(response.data.error))
})

app.get('/api/tasks', cors(), (req, res) => {
    request.get('/projects/' + PROJECT_ID + '/stories')
        .then((response) => res.json(response.data))
        .catch((response) => res.status(response.status).json(response.data.error))
})

app.put('/api/tasks/:id', cors(), (req, res) => {
    request.put('/projects/' + PROJECT_ID + '/stories/' + req.params.id, req.body)
        .then((response) => res.json(response.data))
        .catch((response) => res.status(response.status).json(response.data.error))
})

app.delete('/api/tasks/:id', cors(), (req, res) => {
    request.delete('/projects/' + PROJECT_ID + '/stories/' + req.params.id)
        .then((response) => res.json(req.params))
        .catch((response) => res.status(response.status).json(response.data.error))
})

app.route('/').get(function(req, res) {
    res.header('Cache-Control', "max-age=60, must-revalidate, private")
    res.sendFile('index.html', {
        root: staticPath
    })
})

function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '-1')
    res.header('Pragma', 'no-cache')
    next()
}

app.use('/', express.static(staticPath, {
    maxage: 31557600
}))

const server = app.listen(process.env.PORT || 5000, function() {

    const host = server.address().address
    const port = server.address().port

    console.log(`Example app listening at http://${host}:${port}`)

})

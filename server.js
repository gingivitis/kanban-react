const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const config = require('./webpack.config.dev')
const axios = require('axios')

const API_BASE_URL = 'https://www.pivotaltracker.com/services/v5'
const USER_TOKEN = process.env.USER_TOKEN
const PROJECT_ID = process.env.PROJECT_ID

const app = express()
const compiler = webpack(config)

const request = axios.create({
    baseURL: API_BASE_URL,
    timeout: 2000,
    headers: { 'X-TrackerToken': USER_TOKEN }
})

app.use(bodyParser.json())

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}))

app.use(require('webpack-hot-middleware')(compiler))


app.get('/project', (req, res) => {
    request.get('/projects/' + PROJECT_ID)
        .then((response) => res.json(response.data))
        .catch((response) => res.status(response.status).json(response.data.error))
})

app.put('/project', (req, res) => {
    request.put('/projects/' + PROJECT_ID, req.body)
        .then((response) => res.json(response.data))
        .catch((response) => res.status(response.status).json(response.data.error))
})

app.post('/tasks', (req, res) => {
    request.post('/projects/' + PROJECT_ID + '/stories', req.body)
        .then((response) => res.json(response.data))
        .catch((response) => res.status(response.status).json(response.data.error))
})

app.get('/tasks', (req, res) => {
    request.get('/projects/' + PROJECT_ID + '/stories')
        .then((response) => res.json(response.data))
        .catch((response) => res.status(response.status).json(response.data.error))
})

app.put('/tasks/:id', (req, res) => {
    request.put('/projects/' + PROJECT_ID + '/stories/' + req.params.id, req.body)
        .then((response) => res.json(response.data))
        .catch((response) => res.status(response.status).json(response.data.error))
})

app.delete('/tasks/:id', (req, res) => {
    request.delete('/projects/' + PROJECT_ID + '/stories/' + req.params.id)
        .then((response) => res.json(req.params))
        .catch((response) => res.status(response.status).json(response.data.error))
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(3000, 'localhost', (err) => {
    if (err) {
        console.err(err)
        return
    }

    console.log('Listening at http://localhost:3000')
})

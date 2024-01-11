const flash = require('connect-flash/lib/flash');
const express = require('express');
require('express-async-errors');

const app = express()

app.set('view engine', 'ejs')

app.use(require('body-parser').urlencoded({ extended: true}))

require('dotenv').config()
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const url = process.env.MONGO_URI

const store = new MongoDBStore({
    uri: url, 
    collection: "MySessions"
})

store.on('error', function (error) {
    console.log(error)
})

const sessionParms = {
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie: { secure: false, sameSite: "strict" }
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1)
    sessionParms.cookie.secure = true 
}

app.use(session(sessionParms))


app.get('/secretWord', (req, res) => {
    if (!req.session.secretWord) {
        req.session.secretWord = 'syzygy'
    }

    res.locals.info = req.flash('info')
    res.locals.errors = req.flash('error')
    res.render( 'secretWord', { secretWord: req.session.secretWord })
})

app.use(require("connect-flash")())

app.post('/secretWord', (req, res) => {
    
    if (req.body.secretWord.toUpperCase()[0] === "P") {
        req.flash('error', 'that word won`t work!')
        req.flash('error', 'you can`t use words that starts with P!')
    } else {
        req.session.secretWord = req.body.secretWord
        req.flash('info', 'the secret word has changed')
    }
    res.redirect('/secretWord')
})

app.use((req, res) => {
    res.status(404).send(`The page (${req.url}) was not found`)
})

app.use((err, req, res, next) => {
    res.status(500).send(err.message)
    console.log(err)
})

const port = process.env.PORT || 3000

const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()


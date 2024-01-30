const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const csrf = require('host-csrf');
const cookieParser = require('cookie-parser')
const passport = require('passport');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const path = require('path');
const passportInit = require('./passport/passportInit');
const groceriesRouter = require('./routes/groceries.js')

require('express-async-errors');
require('dotenv').config();

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));
let csrf_development_mode = true;


const url = process.env.MONGO_URI;
const store = new MongoDBStore({
    uri: url,
    collection: 'MySessions',
});

store.on('error', function (error) {
    console.log(error);
});

const sessionParams = {
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie: { secure: false, sameSite: 'strict' },
};

if (app.get('env') === 'production') {
    csrf_development_mode = false
    app.set('trust proxy', 1);
    sessionParams.cookie.secure = true;
}

const csrf_options = {
    protected_operations: ["PATCH"],
    protected_content_types: ["application/json"],
    development_mode: csrf_development_mode,
  };

app.use(csrf(csrf_options));
app.use(xss());
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(session(sessionParams));
passportInit();
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const secretWordRouter = require("./routes/secretWord");
const authMiddleware = require('./middleware/auth');
app.use("/secretWord", authMiddleware, secretWordRouter);

app.use(require('./middleware/storeLocals'));

app.get('/', (req, res) => {
    res.render('index');
});


app.use('/groceries', groceriesRouter, authMiddleware)
app.use('/sessions', require('./routes/sessionRoutes'));





app.use((req, res) => {
    res.status(404).send(`The page (${req.url}) was not found`);
    console.log(err);
});

app.use((err, req, res, next) => {
    res.status(500).send(err.message);
    console.log(err);
});


const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await mongoose.connect(url);
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();



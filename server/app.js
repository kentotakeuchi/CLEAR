const express = require('express');
var bodyParser = require('body-parser')
const app = express();

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json({ type: 'application/*+json' }))
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', (req, res) => {
    console.log('root api called');
    res.end('root api');
});

app.post('/register', (req, res) => {
    if (!req.body) return res.sendStatus(400);

    console.log(req.body);

    if (!req.body.email || !req.body.password) {
        console.log('missing email or password');
        res.end('missing email or password');
        return;
    }

    console.log(req.body.email);
    console.log(req.body.password);

    console.log('register api called');
    res.end('Register email ' + req.body.email);
});

app.listen(3000, () => {
    console.log('server is listening on port 3000...');  
});
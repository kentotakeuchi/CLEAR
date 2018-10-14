const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
var User = require('./User');
var Item = require('./Item');
const cloudinaryData = require('./cloudinaryData');
const contact = require('./contact');
const app = express();

// For image uploading.
cloudinary.config({
    cloud_name: cloudinaryData.CLOUD_NAME,
    api_key: cloudinaryData.API_KEY,
    api_secret: cloudinaryData.API_SECRET
});
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "CLEAR",
    allowedFormats: ["jpg", "png"],
    transformation: [{ width: 250, height: 250, crop: "limit" }]
});
const parser = multer({ storage: storage });

// Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/ClearServer';
mongoose.connect(mongoDB, { useNewUrlParser: true });

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

// Get the default connection
var db = mongoose.connection;
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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

// Contact us
app.use('/contact', contact);

app.post('/register', (req, res) => {
    if (!req.body) return res.sendStatus(400);

    if (!req.body.email || !req.body.password) {
        console.log('missing email or password');
        res.end('missing email or password');
        return;
    }

    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) {
            res.end('Error registering.');
        } else if (user) {
            res.end('Email ' + req.body.email + ' is already registered.');
        } else {
            // Create an instance of model someModel
            var user = new User({
                email: req.body.email,
                password:req.body.password
            });

            // Save the new user, passing a callback
            user.save(function(err) {
                if (err) return handleError(err);
            });
            res.end('You have successfully registered!');
        }
    });
});

app.post('/login', (req, res) => {
    if (!req.body) return res.sendStatus(400);

    if (!req.body.email || !req.body.password) {
        console.log('missing email or password');
        res.end('missing email or password');
        return;
    }

    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) {
            res.end('Error logging in.');
        } else if (user) {
            res.end('TODO implement code for user login');
        } else {
            res.end('Email ' + req.body.email + ' is not registered.');
        }
    });
});

app.post('/items', parser.single('image'), (req, res) => {
    if (req.file) {
        console.log(req.file);
        console.log('a');
        console.log(req.body);
        console.log('b');


        // if (!req.file) return res.send('Please upload a file');
        if (!req.body) return res.sendStatus(400);
        console.log('1');

        const image = {};
        image.url = req.file.url;
        image.id = req.file.public_id;
        console.log(req.file.url);
        console.log(image);

        // Create an instance of model SomeModel
        var item = new Item({
            userEmail: req.body.userEmail,
            img: image.url,
            name: req.body.name,
            desc: req.body.desc,
            brand: req.body.brand,
            ctg: req.body.ctg,
            cnd: req.body.cnd
        });

        // Save the new item, passing a callback
        item.save(function (err) {
            if (err) {
                console.log('err', err);
                res.end('error adding your item!');
                return handleError(err);
            }
            res.end('You have successfully added your item!');
        });
    }
});

app.get('/items/:userEmail', (req, res) => {
    const userEmail = req.params.userEmail;

    Item.find({
        userEmail: userEmail
    })
    .then(items => {
        res.send(items);
    })
    .catch(err => {
        res.send(err);
    });
});

app.get('/items/:id', (req, res) => {
    Item.findById(req.params.id)
    .then(item => {
        res.send(item);
    })
    .catch(err => {
        res.send(err);
    });
});

app.put('/items/:id', parser.single('image'), (req, res) => {
    const image = {};
    image.url = req.file.url;
    image.id = req.file.public_id;

    Item.findById(req.params.id, (err, item) => {
        if (err) {
            res.send(err);
        } else {
            // Update an item's info.
            item.img = image.url;
            item.name = req.body.name;
            item.desc = req.body.desc;
            item.brand = req.body.brand;
            item.ctg = req.body.ctg;
            item.cnd = req.body.cnd;

            // Save the updated item.
            item.save(err => {
                if (err) {
                    res.send(err);
                }
                res.end('You have successfully updated your item!');
            });
        }
    });
});

app.delete('/items/:id', (req, res) => {
    Item.findByIdAndRemove(req.params.id, (err) => {
        if (err) return res.send(err);
        res.send('Deleted successfully!');
    });
});

app.post('/items/search', (req, res) => {
    const searchText = req.body.searchText;

    if (!req.body) return res.sendStatus(400);

    const filter = req.body.filter == 'true' ? {
        name: 1,
        _id: 0
    } : {};

    Item.find({
        "name": { $regex: searchText, $options: 'i' }
    }, filter, (err, items) => {
        console.log(items);
        if (err) {
            res.end('Error searching item.');
        } else {
            res.send(items);
        }
    });
});

app.listen(3000, () => {
    console.log('server is listening on port 3000...');
});
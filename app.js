//jshint esversion:6
require('dotenv').config()
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const encrypt = require('mongoose-encryption');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const userSchema = new mongoose.Schema({

    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model('User', userSchema);


app.get('/', function(req, res) {
    res.render('home');
});

app.get('/login', function(req, res) {
    res.render('login');
})

app.get('/logout', function(req, res) {

    res.redirect('/');
});

app.get('/submit', function(req, res) {
    res.render('submit');
})

app.get('/register', function(req, res) {
    res.render('register');
})

app.post('/register', function(req, res) {

    const username = req.body.username;
    const password = req.body.password;

    const newUser = new User({
        email: username,
        password: password

    })
    newUser.save(function(err) {
        if (!err) {
            res.render('secrets');
        } else {
            res.send(err);
        }
    });

})

app.post('/login', function(req, res) {

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function(err, foundUser) {
        if (err) {

            console.log(err);
        } else {
            if (foundUser) {

                if (foundUser.password == password) {
                    res.render('secrets');
                }
            }


        }

    })
});

app.post('/submit', function(req, res) {
    const secret = req.body.secret;


});


app.listen(3000, function() {
    console.log("successfully listening");
});
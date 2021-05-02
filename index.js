const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
const fetch = require("node-fetch")
const fs = require('fs');
const Datastore = require("nedb");
const app = express();


const database = new Datastore('database.db');
database.loadDatabase();

function userExists(user, pass) {
    database.find({
        user: [user],
        pass, pass
    }, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            console.log(data);
        }
    })
    return true
}

async function getContent(filename) {
    const url = filename;
    const fetch_response = await fetch(url);
    const text = await fetch_response.text();
    return text;
}
console.log(getContent('database.db'));

const port = 4000;
app.listen(port, () => {
    console.log(`Listening at port: ${port}`);
});

// app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json({
    limit: '1mb'
}));

app.post('/api/login', (req, res) => {
    console.log(req.body)
    let user = req.body.user;
    let pass = req.body.pass;
    // Cookie: user=tobi.CP7AWaXDfAKIRfH49dQzKJx7sKzzSoPq7/AcBBRVwlI3
    // console.log(req.signedCookies.user);
    // console.log(req.signedCookies);
    if (userExists(user, pass)) {
        res.cookie('loginInfo', {
            loggedIn: true,
            username: user
        }, { 
            expires: new Date(Date.now() + 10000000), 
            httpOnly: true 
        });
        res.json({
            loggedIn: true,
            err: null,
            username: user,
            password: pass
        });
    } else {
        res.json({
            err: "Invalid username and/or password"
        })
    }
});
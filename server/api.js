const express = require("express");
const cors = require("cors");
const mongoClient = require("mongodb").MongoClient;

require("dotenv").config();
const conString = process.env.MONGO_URI;

// ✅ Load environment variables
require("dotenv").config();

// ✅ Use Mongo URI from .env file

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Fetch user by ID
app.get('/users/:userid', (req, res) => {
    mongoClient.connect(conString).then(clientObj => {
        var database = clientObj.db("todo");
        database.collection('users').findOne({ user_id: req.params.userid }).then(user => {
            res.send(user);
            res.end();
        });
    });
});

// ✅ Fetch all appointments by user ID
app.get('/appointments/:userid', (req, res) => {
    mongoClient.connect(conString).then(clientObj => {
        var database = clientObj.db("todo");
        database.collection('appointments').find({ user_id: req.params.userid }).toArray().then(documents => {
            res.send(documents);
            res.end();
        });
    });
});

// ✅ Fetch one appointment by ID
app.get('/appointment/:id', (req, res) => {
    mongoClient.connect(conString).then(clientObj => {
        var database = clientObj.db("todo");
        database.collection('appointments').findOne({ appointment_id: parseInt(req.params.id) }).then(document => {
            res.send(document);
            res.end();
        });
    });
});

// ✅ Register new user
app.post('/register-user', (req, res) => {
    var user = {
        user_id: req.body.user_id,
        user_name: req.body.user_name,
        password: req.body.password,
        mobile: req.body.mobile
    };

    mongoClient.connect(conString).then(clientObj => {
        var database = clientObj.db("todo");
        database.collection('users').insertOne(user).then(() => {
            console.log('✅ User Registered');
            res.end();
        });
    });
});

// ✅ Add new appointment
app.post('/add-appointment', (req, res) => {
    var appointment = {
        appointment_id: parseInt(req.body.appointment_id),
        title: req.body.title,
        description: req.body.description,
        date: new Date(req.body.date),
        user_id: req.body.user_id
    };

    mongoClient.connect(conString).then(clientObj => {
        var database = clientObj.db("todo");
        database.collection('appointments').insertOne(appointment).then(() => {
            console.log('✅ Appointment Added');
            res.end();
        });
    });
});

// ✅ Edit appointment
app.put('/edit-appointment/:id', (req, res) => {
    var id = parseInt(req.params.id);

    var appointment = {
        appointment_id: parseInt(req.body.appointment_id),
        title: req.body.title,
        description: req.body.description,
        date: new Date(req.body.date),
        user_id: req.body.user_id
    };

    mongoClient.connect(conString).then(clientObj => {
        var database = clientObj.db("todo");
        database.collection('appointments').updateOne({ appointment_id: id }, { $set: appointment })
            .then(() => {
                console.log('✅ Appointment Updated');
                res.end();
            });
    });
});

// ✅ Delete appointment
app.delete('/delete-appointment/:id', (req, res) => {
    var id = parseInt(req.params.id);

    mongoClient.connect(conString).then(clientObj => {
        var database = clientObj.db("todo");
        database.collection('appointments').deleteOne({ appointment_id: id })
            .then(() => {
                console.log('🗑️ Appointment Deleted');
                res.end();
            });
    });
});

// ✅ API test route
app.get("/", (req, res) => {
    res.send("✅ API is live");
});

// ✅ Start server
app.listen(4040, () => {
    console.log("🚀 Server Started on http://localhost:4040");
});

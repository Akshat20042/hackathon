const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://zekeyeager18:ragebater18@cluster0.tttvr3k.mongodb.net/first?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('mongoose connected');
    })
    .catch((e) => {
        console.error('Mongoose connection failed:', e);
    });

const logInSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const signupvolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    skill: {
        type: String,
        required: true
    },
    Exp: Number,
    lang: String
});

const vol = mongoose.model("vol", signupvolSchema, 'logincollections');

const signupbusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const bus = mongoose.model("bus", signupbusSchema, 'logincollections');
const LogIn = mongoose.model("LogIn", logInSchema, 'logincollections');

module.exports = {
    LogIn: LogIn,
    bus: bus,
    vol: vol
};

const mongoose = require('mongoose')
const { config } = require('dotenv')

config({
    path: '.env',
})

const DB = process.env.MONGODB_URL

mongoose.connect(DB, {

}).then(() => {
    console.log("DataBase Connected")
}).catch((error) => {
    console.log(error);
})
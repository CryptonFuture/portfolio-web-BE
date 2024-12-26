const app = require('./app')

const {config} = require('dotenv')

config({
    path: '.env',
})

const port = process.env.PORT

app.listen(port, () => {
    console.log(`server is running on ${port}`);
})
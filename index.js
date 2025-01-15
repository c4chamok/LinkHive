require('dotenv').config();
const express =  require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

const port = process.env.PORT || 5000;


app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    credentials: true

}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});





app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
})

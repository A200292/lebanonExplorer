const express = require("express");
const app = express();

const connectdb = require("./database").connectdb;
connectdb();



app.use (express.json());

const PORT = process.env.PORT || 3000;
app.listen(3000, ()=>
{
    console.log(`server is running at port ${PORT}`);
});
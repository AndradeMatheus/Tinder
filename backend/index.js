require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./src/routes')
const morgan = require('morgan');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {mongo} = require("./src/config/auth.json");
const connectedUsers = {
}
io.on('connection', socket => {
    const { user } = socket.handshake.query;

    connectedUsers[user] = socket.id;
});

mongoose.connect(mongo,
    { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true  });

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;
    return next();
})
app.use(cors());
app.use(express.json());

app.use(morgan("dev"));
app.use(
  "/files",
  express.static(path.resolve(__dirname, "tmp", "uploads"))
);
app.use(routes);

const PORT = 3333;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

console.log("rodando na porta 3333");
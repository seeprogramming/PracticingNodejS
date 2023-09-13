var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var Message = mongoose.model('Message', {
    name: String,
    message: String,
});

app.get('/messages', async (req, res) => {
    var messages = await Message.find({});
    res.send(messages);
});

app.post('/messages', async (req, res) => {
    var message = new Message(req.body);

    var savedMessage = await message.save();

    var censored = await Message.findOne({ message: 'badword' });

    if (censored) {
        await Message.findOneAndRemove({ _id: censored.id });
    } else {
        io.emit('message', req.body);
        res.sendStatus(200);
    }
});

io.on('connection', (socket) => {
    console.log('Connected To IO');
});

mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@specsworld-cluster.okmwh4h.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    )
    .then(() => {
        console.log('Connected To Database');
    })
    .catch((err) => console.log(err));

var server = http.listen(3000, () => {
    console.log(`Server is listening on port`, server.address().port);
});

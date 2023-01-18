const PORT = process.env.PORT || 9001;
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')  // npm install cors;
// Connect to MongoDB
mongoose.connect('mongodb+srv://root:root@cluster0.s5oku.mongodb.net/todo-next?retryWrites=true&w=majority', { useNewUrlParser: true });

// Create a MongoDB model for Todo items
const Todo = mongoose.model('Todo', {
    text: String,
    isCompleted: Boolean,
});

const app = express();

// Use body-parser to parse JSON request bodies
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'https://todo-xi-beryl.vercel.app'],
    credentials: true,
}));

app.use(morgan('dev'));
// Get all Todo items
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });



// app.use('/', express.static(path.resolve(path.join(__dirname, '../.next'))));

app.get('/todos', (req, res) => {
    // find all todos in the database
    Todo.find({}, function (err, data) {
        if (!err) {
            res.send({
                data: data,
                status: 200
            })
        }
    });

});

// Create a new Todo item
app.post('/todos', async (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        isCompleted: req.body.isCompleted,
    });
    await todo.save();
    res.send(todo);
});

// Update a Todo item
app.put('/todos/:id', async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body);
    res.send(todo);
});

// Delete a Todo item
app.delete('/todos/:id', async (req, res) => {
    await Todo.findByIdAndRemove(req.params.id);
    res.send({
        message: 'Todo deleted!',
        status: 200,
    });
});

app.listen(PORT, () => {
    console.log(`Todo API listening on port ${PORT}`);
});

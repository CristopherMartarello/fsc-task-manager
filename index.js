const express = require('express');
const dotenv = require('dotenv');
const connectToDatabase = require('./src/database/mongoose.database');

dotenv.config();
const app = express();
app.use(express.json());

connectToDatabase();

const TaskModel = require('./src/models/task.model');

app.listen(8000, () => {
    console.log('Listening on port 8000');
})

app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});

app.get('/tasks', async(req, res) => {
    try {
        const tasks = await TaskModel.find({});
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
});

app.post('/tasks', async(req, res) => {
    try {
        const newTask = new TaskModel(req.body);
        await newTask.save();
        res.status(201).send({message: 'Task criada com sucesso!', task: newTask});
    } catch (error) {
        res.status(500).send({message: error.message});
    }
});



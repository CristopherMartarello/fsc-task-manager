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

app.get('/tasks/:id', async(req, res) => {
    try {
        const taskId = req.params.id;
        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).send({message: 'Essa tarefa não foi encontrada.'});
        }
        return res.status(200).send({message: 'Task encontrada com sucesso!', task: task});
    } catch (error) {
        res.status(500).send({ message: error.message });
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

app.put('/tasks/:id', async(req, res) => {
    try {
        const taskId = req.params.id;
        const taskData = req.body;
        const taskToUpdate = await TaskModel.findById(taskId);

        const allowedUpdates = ['isCompleted'];
        const requestedUpdates = Object.keys(taskData);

        for (update of requestedUpdates) {
            if (allowedUpdates.includes(update)) {
                taskToUpdate[update] = taskData[update];
            } else {
                return res.status(500).send({message: 'Um ou mais campos inseridos não são editáveis.'})
            }
        }

        await taskToUpdate.save();
        return res.status(200).send(taskToUpdate);
    } catch (error) {
        return res.status(500).send({message: error.message});
    }
})

app.delete('/tasks/:id', async(req, res) => {
    try {
        const taskId = req.params.id;
        const taskToDelete = await TaskModel.findById(taskId);
        if (!taskToDelete) {
            return res.status(404).send({message: 'Task não encontrada!'});
        }
        const deletedTask = await TaskModel.findByIdAndDelete(taskId);
        res.status(200).send({message: 'Task deletada com sucesso!', task: deletedTask});
    } catch (error) {
        res.status(500).send({message: error.message});
    }
});



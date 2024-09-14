const TaskModel = require('../models/task.model');
const { notFoundError, objectIdError } = require('../errors/mongodb.errors');
const { notAllowedFieldsToUpdateError } = require('../errors/general.errors');
const { default: mongoose } = require('mongoose');

class TaskController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async getTasks() {
        try {
            const tasks = await TaskModel.find({});
            this.res.status(200).send(tasks);
        } catch (error) {
            return this.res.status(500).send({message: error.message});
        }
    }

    async getTaskById() {
        try {
            const taskId = this.req.params.id;
            const task = await TaskModel.findById(taskId);
            if (!task) {
                return notFoundError(this.res);
            }
            return this.res.status(200).send({message: 'Task encontrada com sucesso!', task: task});
        } catch (error) {
            if (error instanceof mongoose.Error.CastError) {
                return objectIdError(this.res);
            } else {
                return this.res.status(500).send({ message: error.message });
            }
        }
    }

    async createNewTask() {
        try {
            const newTask = new TaskModel(this.req.body);
            await newTask.save();
            this.res.status(201).send({message: 'Task criada com sucesso!', task: newTask});
        } catch (error) {
            return this.res.status(500).send({message: error.message});
        }
    }

    async updateTask() {
        try {
            const taskId = this.req.params.id;
            const taskData = this.req.body;
            const taskToUpdate = await TaskModel.findById(taskId);

            if (!taskToUpdate) {
                return notFoundError(this.res);
            }
    
            const allowedUpdates = ['isCompleted'];
            const requestedUpdates = Object.keys(taskData);
    
            for (const update of requestedUpdates) {
                if (allowedUpdates.includes(update)) {
                    taskToUpdate[update] = taskData[update];
                } else {
                    return notAllowedFieldsToUpdateError(this.res);
                }
            }
    
            await taskToUpdate.save();
            return this.res.status(200).send(taskToUpdate);
        } catch (error) {
            if (error instanceof mongoose.Error.CastError) {
                return objectIdError(this.res);
            }
            return this.res.status(500).send({message: error.message});
        }
    }

    async deleteTask() {
        try {
            const taskId = this.req.params.id;
            const taskToDelete = await TaskModel.findById(taskId);
            if (!taskToDelete) {
                return notFoundError(this.res);
            }
            const deletedTask = await TaskModel.findByIdAndDelete(taskId);
            this.res.status(200).send({message: 'Task deletada com sucesso!', task: deletedTask});
        } catch (error) {
            if (error instanceof mongoose.Error.CastError) {
                return objectIdError(this.res);
            }
            return this.res.status(500).send({message: error.message});
        }
    }
}

module.exports = TaskController;
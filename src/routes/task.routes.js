const express = require('express');

const TaskController = require('./../controllers/task.controller');

const router = express.Router();

router.get('/', async(req, res) => {
    return new TaskController(req, res).getTasks();
});

router.get('/:id', async(req, res) => {
    return new TaskController(req, res).getTaskById();
});

router.post('/', async(req, res) => {
    return new TaskController(req, res).createNewTask();
});

router.put('/:id', async(req, res) => {
    return new TaskController(req, res).updateTask();
})

router.delete('/:id', async(req, res) => {
    return new TaskController(req, res).deleteTask();
});

module.exports = router;
const { Schema, model } = require('mongoose');

//Tabela de Tarefas com os campos
const TaskSchema = Schema({
    description: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
})

const TaskModel = model('Task', TaskSchema);

module.exports = TaskModel;
const express = require('express');
const dotenv = require('dotenv');
const connectToDatabase = require('./src/database/mongoose.database');
const TaskRouter = require('./src/routes/task.routes');

dotenv.config();
const app = express();
app.use(express.json());

connectToDatabase();

app.use('/tasks', TaskRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});





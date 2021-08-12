const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
function connectDB() {
  mongoose
    .connect('mongodb://localhost:27017/TaskList', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err) => setTimeout(connectDB(), 5000));
}
connectDB();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const taskSchema = mongoose.Schema(
  {
    title: String,
    body: String,
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

app.post('/api/addTask', (req, res) => {
  const addTask = new Task({
    title: req.body.title,
    body: req.body.body,
  });

  addTask.save((err, doc) => {
    if (err) return console.log(err);
  });
});
app.get('/api/getTask', async (req, res) => {
  res.send(await Task.find());
});
app.delete('/api/deleteTask/:id', (req, res) => {
  Task.deleteOne({ _id: req.params.id }).catch((error) => {
    console.log(error);
  });
});

app.listen(process.env.PORT || 3001, () => console.log('server running'));

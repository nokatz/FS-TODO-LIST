
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const fs = require('fs');
let todos;

app.use(bodyParser.text());
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    app.send('Get good');
});

app.get('/todos', (req, res, next) => {

    fs.readFile('data/todos.json', (err, data) => {
        if (err) throw err;
        todos = JSON.parse(data);
        res.send(todos);
    });
});

app.post('/todos', (req, res, next) => {

    console.log('From server: ' + req.body);

    fs.writeFile('data/todos.json', req.body, 'utf8', err => {
        if (err) throw err;  
  
        res.send(req.body);
    });
});

app.listen(5000, () => {
    console.log('Server listening on port 5000');
});

const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
//const ejsLint = require('ejs-lint');
const mysql = require('mysql2');

var connection = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "todo_app",
    insecureAuth : true
});


//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 

app.get('/',(req,res) => {
    //res.send("hey there");
    let sql = "SELECT * FROM todo_app.todoTable;"
    let query = connection.query(sql,(err, rows) => {
        if (err) throw err;
        res.render('task_data',{
            title : "Crud app Todo-list",
            task : rows
        });
    });
    
});


app.get('/add', (req,res) => {
    
    res.render('task_add',{
        title : "Crud app Todo-list"
    });
});

app.post('/save',(req,res) => {
    let data = {title: req.body.title, description: req.body.description, date: req.body.date};
    let sql = "INSERT INTO todo_app.todoTable SET ?";
    let query = connection.query(sql,data,(err, results) => {
        if (err){
           throw err
        };
        res.redirect('/');
        });
})

app.get('/edit/:taskId',(req, res) => {
    const taskId = req.params.taskId;
    let sql = `Select * from todo_app.todoTable where id = ${taskId}`;
    let query = connection.query(sql,(err, result) => {
        if(err){
            throw err
        };
        res.render('task_edit', {
            title : 'Crud app Todo-list',
            task : result[0]
        });
    });
  });
   
app.post('/update',(req, res) => {
    const taskId = req.body.id;
    let sql = "update todo_app.todoTable SET title='"+req.body.title+"',  description='"+req.body.descripton+"',  date='"+req.body.date+"' where id ="+taskId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

app.get('/delete/:taskId',(req, res) => {
    const taskId = req.params.taskId;
    let sql = `DELETE from todo_app.todoTable where id = ${taskId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});

// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    })
});
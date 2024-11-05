const express = require('express');
const mongoose = require('mongoose')

const app = express();
app.use(express.json())


app.get('/',(req,res) => {
    res.send("Hellow World");
})

// sample storage for todo items
let todos = []

// connecting Mongodb 
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(() => {
    console.log("DB connected")
})
.catch((err) => {
    console.log(err)
})

//creating schema
const todoSchema = mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})

//creating model
const todoModel = mongoose.model('Todo',todoSchema)

// Create a new todo
app.post('/todos',async(req,res) => {
    const {title,description} = req.body
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // }
    // todos.push(newTodo)
    // console.log("newTodo",newTodo,"todos",todos)
    try {
        const newTodo = new todoModel({title,description})
        await newTodo.save();
        res.status(201).json(newTodo)
    } catch(e) {
        console.log(e)
        res.status(500).json({message: e.message})
    }

})

app.get('/todos',async(req,res) => {
    // res.send(todos)
    try {
        const todos =  await todoModel.find()
        res.json(todos)
    } catch (e) {
        console.log(e)
        res.status(500).json({message: e.message})
    }
})


// update todo item
app.put("/todos/:id", async(req,res) => {
    try {
        const {title,description} = req.body
        const id = req.params.id
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {title,description},
            {new: true}
        )
        if(!updatedTodo) {
            return res.status(400).json({message:"Todo not found"})
        }
        res.json(updatedTodo,

        )
    } catch (error) {
        console.log(e)
        res.status(500).json({message: e.message})
    }

})


// delete a tdod item
app.delete('/todos/:id', async(req,res) => {
    try {
        const id  = req.params.id;
        const deletedTodo = await todoModel.findByIdAndDelete(id)
        res.status(204).end()
    } catch (err) {
        console.log(err)
        res.status(500).json({message: err.message})
    }
})

const port = 3000;
app.listen(port, () =>{
    console.log("The server is listening", port)
})
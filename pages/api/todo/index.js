import connectDB from '../../../config/connectDB'
import Todos from '../../../models/todoModel'
import { getSession } from 'next-auth/client'

connectDB()

export default async function handler(req, res){
  switch(req.method){
    case "POST":
      await createTodo(req, res)
      break;
    case "GET":
      await getTodos(req, res)
      break;
  }
}

const createTodo = async (req, res) => {
  try {
    const session = await getSession({req})
    if(!session){
      return res.status(400).json({msg: "Invalid Authentication!"}) 
    }

    const { userId } = session
    const { todo } = req.body

    if(!todo)
      return res.status(400).json({msg: "Please add todo."}) 
    
    const newTodo = new Todos({
      name: todo.toLowerCase(),
      user: userId
    })

    await newTodo.save()
    res.json({msg: 'Success! Create a new todo.'})
  } catch (err) {
    return res.status(500).json({msg: err.message})
  }
}

const getTodos = async (req, res) => {
  try {
    const session = await getSession({req})
    if(!session){
      return res.status(400).json({msg: "Invalid Authentication!"}) 
    }

    const { userId } = session

    const todos = await Todos.find({ user: userId })
    res.json(todos)
  } catch (err) {
    return res.status(500).json({msg: err.message})
  }
}
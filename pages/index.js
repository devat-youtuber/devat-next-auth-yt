import React, { useState, useEffect } from 'react'
import { getSession } from 'next-auth/client'
import axios from 'axios'

import Nav from '../components/Nav'
import TodoInput from '../components/TodoInput'
import TodoItem from '../components/TodoItem'
import { toast } from 'react-toastify'

const Home = () => {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setLoading(true)
        const res = await axios.get('/api/todo')
        setTodos(res.data)
        setLoading(false)
      } catch (err) {
        toast.error(err.response.data.msg)
      }
    }
    fetchTodo()
  },[])

  return (
    <div>
      <Nav />

      <main>
        <TodoInput />
        <div>
          {
            todos.map(todo => (
              <TodoItem key={todo._id} todo={todo} />
            ))
          }
        </div>

        { loading && <h2>Loading ....</h2> }
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  
  if(!session){
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  
  return {
    props: { session }
  }
}

export default Home

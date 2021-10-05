import React from 'react'

const TodoItem = ({todo}) => {
  return (
    <div className="border shadow-sm my-3 p-2 rounded text-capitalize">
      {todo.name}
    </div>
  )
}

export default TodoItem

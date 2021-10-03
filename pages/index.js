import React from 'react'
import { signOut } from 'next-auth/client'

const Home = () => {
  return (
    <div>
      Home
      <button onClick={() => signOut()}>signOut</button>
    </div>
  )
}

export default Home

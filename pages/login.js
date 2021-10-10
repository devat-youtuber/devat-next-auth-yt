import React, { useEffect } from 'react'
import { providers, getSession, csrfToken } from 'next-auth/client'
import Router from 'next/router'
import { toast } from 'react-toastify'

import OAuth from '../components/auth/OAuth'
import Email from '../components/auth/Email'
import Credentials from '../components/auth/Credentials'


const Login = ({providers, session, csrfToken}) => {

  useEffect(() => {
    if(session) return Router.push('/');
  },[session])

  useEffect(() => {
    if(Router.query.error){
      toast.error(Router.query.error)
      return Router.push('/login');
    }
  },[])

  if(session) return null;
  return (
    <div className="d-flex justify-content-center align-items-center"
    style={{ minHeight: '100vh' }}>
      <div style={{maxWidth: '450px', width: '100%'}}
      className="border border-1 max-auto p-4 shadow">

        <h2 className="text-center fw-bolder text-uppercase"
        style={{ color: '#555', letterSpacing: '1px' }}>
          DevAT-VietNam
        </h2>

        <p className="text-center">Login with NextAuth</p>

        <Credentials providers={providers} csrfToken={csrfToken} />

        <div className="text-center">✦ Or ✦</div>
        
        <OAuth providers={providers} csrfToken={csrfToken} />
        
        <Email providers={providers} csrfToken={csrfToken} />
      </div>
    </div>
  )
}

export async function getServerSideProps (context) {
  return {
    props: {
      providers: await providers(context),
      session: await getSession(context),
      csrfToken: await csrfToken(context)
    }
  }
}

export default Login

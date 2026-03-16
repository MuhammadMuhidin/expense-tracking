"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login(){

  const router = useRouter()

  const [form,setForm] = useState({
    user:"",
    password:""
  })

  async function login(){

    const res = await fetch("/api/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(form)
    })

    const json = await res.json()

    if(!json.success){
      alert("Login failed")
      return
    }

    localStorage.setItem("user",json.user)

    router.push("/")
  }

  return(

    <div style={{padding:40}}>

      <h2>Login</h2>

      <input
        placeholder="Username"
        value={form.user}
        onChange={e=>setForm({...form,user:e.target.value})}
      />

      <br/><br/>

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={e=>setForm({...form,password:e.target.value})}
      />

      <br/><br/>

      <button onClick={login}>
        Login
      </button>

    </div>
  )
}
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

    <div style={{
      minHeight:"100vh",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      background:"#f1f5f9"
    }}>

      <div style={{
        width:360,
        background:"#ffffff",
        padding:30,
        borderRadius:10,
        boxShadow:"0 10px 25px rgba(0,0,0,0.08)"
      }}>

        <h2 style={{marginBottom:5}}>Expense Tracker</h2>
        <div style={{color:"#64748b",marginBottom:25,fontSize:14}}>
          Sign in to continue
        </div>

        <div style={{display:"grid",gap:14}}>

          <input
            placeholder="Username"
            value={form.user}
            onChange={e=>setForm({...form,user:e.target.value})}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e=>setForm({...form,password:e.target.value})}
            style={inputStyle}
          />

          <button
            onClick={login}
            style={{
              marginTop:5,
              padding:"10px",
              borderRadius:6,
              border:"none",
              background:"#2563eb",
              color:"white",
              fontWeight:600,
              cursor:"pointer"
            }}
          >
            Login
          </button>

        </div>

      </div>

    </div>
  )
}

const inputStyle={
  padding:"10px",
  border:"1px solid #e2e8f0",
  borderRadius:6,
  fontSize:14,
  outline:"none"
}
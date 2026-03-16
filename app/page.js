"use client"

import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page(){

  const router = useRouter()

  const [user,setUser] = useState("")
  const [tab,setTab] = useState("input")
  const [data,setData] = useState([])

  const [form,setForm] = useState({
    name:"",
    amount:"",
    category:"",
    source:"",
    date:""
  })

  useEffect(()=>{

    const u = localStorage.getItem("user")

    if(!u){
      router.push("/login")
      return
    }

    setUser(u)
    loadData(u)

  },[])

  async function loadData(u){

    const res = await fetch("/api/expense?user="+u)
    const json = await res.json()

    setData(json)
  }

  async function submit(e){

    e.preventDefault()

    await fetch("/api/expense",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        ...form,
        user
      })
    })

    loadData(user)
    setTab("history")
  }

  function logout(){

    localStorage.removeItem("user")
    router.push("/login")
  }

  return(

    <div style={{padding:20}}>

      <div style={{display:"flex",justifyContent:"space-between"}}>
        <h3>User: {user}</h3>
        <button onClick={logout}>Logout</button>
      </div>

      <br/>

      <button onClick={()=>setTab("input")}>Input</button>
      <button onClick={()=>setTab("history")}>History</button>

      <hr/>

      {tab==="input" && (

        <form onSubmit={submit}>

          <input
            placeholder="name"
            onChange={e=>setForm({...form,name:e.target.value})}
          />

          <input
            type="number"
            placeholder="amount"
            onChange={e=>setForm({...form,amount:e.target.value})}
          />

          <input
            placeholder="category"
            onChange={e=>setForm({...form,category:e.target.value})}
          />

          <input
            placeholder="source Dana"
            onChange={e=>setForm({...form,source:e.target.value})}
          />

          <input
            type="date"
            onChange={e=>setForm({...form,date:e.target.value})}
          />

          <button type="submit">Simpan</button>

        </form>

      )}

      {tab==="history" && (

        <table border="1">

          <thead>
            <tr>
              <th>name</th>
              <th>amount</th>
              <th>category</th>
              <th>source</th>
              <th>date</th>
            </tr>
          </thead>

          <tbody>

            {data.map((r,i)=>(
              <tr key={i}>
                <td>{r.name}</td>
                <td>{r.amount}</td>
                <td>{r.category}</td>
                <td>{r.source}</td>
                <td>{r.date}</td>
              </tr>
            ))}

          </tbody>

        </table>

      )}

    </div>
  )
}
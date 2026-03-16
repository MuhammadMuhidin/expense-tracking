"use client"

import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page(){

  const router = useRouter()

  const [user,setUser] = useState("")
  const [tab,setTab] = useState("input")
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(false)
  const [saving,setSaving] = useState(false)

  const now = new Date()
  const defaultMonth = now.toISOString().slice(0,7)

  const [month,setMonth] = useState(defaultMonth)

  const emptyForm={
    name:"",
    amount:"",
    category:"food",
    source:"cash",
    date:""
  }

  const [form,setForm] = useState(emptyForm)

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

    setLoading(true)

    const res = await fetch("/api/expense?user="+u)
    const json = await res.json()

    setData(json)

    setLoading(false)
  }

  async function submit(e){

    e.preventDefault()

    setSaving(true)

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

    setSaving(false)

    alert("Data berhasil disimpan")

    setForm(emptyForm)

    loadData(user)
  }

  const filteredData = data
    .filter(r=>{
      if(!r.date) return false
      return r.date.startsWith(month)
    })
    .sort((a,b)=> new Date(b.date) - new Date(a.date))

  const total = filteredData.reduce((sum,r)=>{
    return sum + Number(r.amount)
  },0)

  return(

    <div style={page}>

      <div style={container}>

        <div style={header}>
          <div>
            <h2 style={title}>Expense Tracker</h2>
            <div style={userText}>{user}</div>
          </div>
        </div>

        <div style={tabs}>

          <button
            style={tab==="input"?activeTab:tabBtn}
            onClick={()=>setTab("input")}
          >
            Input
          </button>

          <button
            style={tab==="history"?activeTab:tabBtn}
            onClick={()=>{
              setTab("history")
              loadData(user)
            }}
          >
            History
          </button>

        </div>

        {tab==="input" && (

          <form onSubmit={submit} style={formStyle}>

            <input
              style={input}
              placeholder="Name"
              value={form.name}
              onChange={e=>setForm({...form,name:e.target.value})}
            />

            <input
              style={input}
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={e=>setForm({...form,amount:e.target.value})}
            />

            <select
              style={input}
              value={form.category}
              onChange={e=>setForm({...form,category:e.target.value})}
            >
              <option value="food">Food</option>
              <option value="drink">Drink</option>
              <option value="utilities">Utilities</option>
              <option value="transport">Transport</option>
              <option value="shopping">Shopping</option>
              <option value="other">Other</option>
            </select>

            <select
              style={input}
              value={form.source}
              onChange={e=>setForm({...form,source:e.target.value})}
            >
              <option value="cash">Cash</option>
              <option value="transfer">Transfer</option>
              <option value="other">Other</option>
            </select>

            <input
              style={input}
              type="date"
              value={form.date}
              onChange={e=>setForm({...form,date:e.target.value})}
            />

            <button disabled={saving} style={saveBtn}>
              {saving ? "Saving..." : "Save"}
            </button>

          </form>

        )}

        {tab==="history" && (

          <div style={historyContainer}>

            <div style={historyHeader}>

              <div style={filterBox}>
                <span>Month</span>

                <input
                  type="month"
                  value={month}
                  onChange={e=>setMonth(e.target.value)}
                  style={monthInput}
                />
              </div>

              <div style={totalText}>
                Total Rp {total.toLocaleString()}
              </div>

            </div>

            <div style={tableScroll}>

              {loading && (
                <div style={loadingStyle}>Loading...</div>
              )}

              {!loading && (

                <table style={table}>

                  <thead>
                    <tr>
                      <th style={th}>Name</th>
                      <th style={th}>Amount</th>
                      <th style={th}>Category</th>
                      <th style={th}>Source</th>
                      <th style={th}>Date</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredData.map((r,i)=>(
                      <tr key={i} style={tr}>
                        <td style={td}>{r.name}</td>
                        <td style={td}>Rp {Number(r.amount).toLocaleString()}</td>
                        <td style={td}>{r.category}</td>
                        <td style={td}>{r.source}</td>
                        <td style={td}>{r.date}</td>
                      </tr>
                    ))}

                  </tbody>

                </table>

              )}

            </div>

          </div>

        )}

      </div>

    </div>
  )
}

const page={
  minHeight:"100vh",
  background:"#f8fafc",
  display:"flex",
  justifyContent:"center"
}

const container={
  width:"100%",
  maxWidth:720,
  padding:"20px"
}

const header={
  marginBottom:20
}

const title={
  margin:0
}

const userText={
  color:"#64748b"
}

const tabs={
  display:"flex",
  gap:10,
  marginBottom:20
}

const tabBtn={
  padding:"8px 16px",
  border:"1px solid #e2e8f0",
  background:"white",
  borderRadius:6
}

const activeTab={
  padding:"8px 16px",
  border:"1px solid #2563eb",
  background:"#2563eb",
  color:"white",
  borderRadius:6
}

const formStyle={
  display:"grid",
  gap:12
}

const input={
  width:"100%",
  padding:"10px",
  border:"1px solid #e2e8f0",
  borderRadius:6
}

const saveBtn={
  padding:"10px",
  background:"#2563eb",
  color:"white",
  border:"none",
  borderRadius:6
}

const historyContainer={
  display:"flex",
  flexDirection:"column",
  height:"75vh"
}

const historyHeader={
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  marginBottom:10
}

const filterBox={
  display:"flex",
  gap:10,
  alignItems:"center"
}

const monthInput={
  padding:"6px",
  border:"1px solid #e2e8f0",
  borderRadius:6
}

const totalText={
  fontWeight:600
}

const tableScroll={
  flex:1,
  overflow:"auto"
}

const table={
  width:"100%",
  borderCollapse:"collapse"
}

const th={
  textAlign:"left",
  padding:"10px",
  borderBottom:"1px solid #e2e8f0"
}

const td={
  padding:"10px"
}

const tr={
  borderBottom:"1px solid #f1f5f9"
}

const loadingStyle={
  padding:20
                }

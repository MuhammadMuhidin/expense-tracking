import { NextResponse } from "next/server";

export async function POST(req){

  const { user,password } = await req.json()

  const users = process.env.APP_USERS.split(",")

  const valid = users.find(u=>{
    const [n,p] = u.split(":")
    return n===user && p===password
  })

  if(!valid){
    return NextResponse.json({
      success:false,
      message:"Login failed"
    })
  }

  const res = NextResponse.json({
    success:true,
    user:user
  })

  res.cookies.set("user", user, {
    httpOnly:true,
    path:"/"
  })

  return res
}
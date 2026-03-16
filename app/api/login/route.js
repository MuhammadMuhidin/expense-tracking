export async function POST(req){

  const { name,password } = await req.json()

  const users = process.env.APP_USERS.split(",")

  const valid = users.find(u=>{
    const [n,p] = u.split(":")
    return n===name && p===password
  })

  if(!valid){
    return Response.json({
      success:false,
      message:"Login failed"
    })
  }

  return Response.json({
    success:true,
    user:name
  })
}
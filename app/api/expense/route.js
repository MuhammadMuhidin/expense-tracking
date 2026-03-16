import { getSheets } from "@/lib/sheets"

const spreadsheetId = process.env.SPREADSHEET_ID
const sheetName = "Expense"

export async function GET(req){

  const { searchParams } = new URL(req.url)
  const user = searchParams.get("user")

  const sheets = await getSheets()

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetName
  })

  const rows = res.data.values || []

  const data = rows.slice(1)
    .map(r => ({
      user:r[0],
      name:r[1],
      amount:r[2],
      category:r[3],
      source:r[4],
      date:r[5]
    }))
    .filter(r => r.user === user)

  return Response.json(data)
}

export async function POST(req){

  const body = await req.json()

  const sheets = await getSheets()

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: sheetName,
    valueInputOption:"USER_ENTERED",
    requestBody:{
      values:[[
        body.user,
        body.name,
        body.amount,
        body.category,
        body.source,
        body.date
      ]]
    }
  })

  return Response.json({success:true})
}
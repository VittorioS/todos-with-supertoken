import { add, findAll } from "../../repository/todos/local"

async function GET(req, res) {
  res.status(200).json(await findAll())
}
async function POST(req, res) {
  const { content } = JSON.parse(req.body)
  res.status(200).json(await add({ content }))
}
async function PUT(req, res) {}
async function DELETE(req, res) {}

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      GET(req, res)
      break
    case "POST":
      POST(req, res)
      break
    case "PUT":
      PUT(req, res)
      break
    case "DELETE":
      DELETE(req, res)
      break
    default:
      break
  }
}

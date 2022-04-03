import { update, remove } from "../../../repository/todos/local"

async function GET(req, res) {}
async function POST(req, res) {}
async function PUT(req, res) {
  const { id } = req.query
  const { content } = JSON.parse(req.body)
  res.status(200).json(await update({ id, content }))
}
async function DELETE(req, res) {
  const { id } = req.query
  res.status(200).json(await remove({ id }))
}

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

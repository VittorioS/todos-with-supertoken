import { superTokensNextWrapper } from "supertokens-node/nextjs"
import { verifySession } from "supertokens-node/recipe/session/framework/express"
import { removePrivate, updatePrivate } from "../../../repository/todos/prisma"

async function GET(req, res) {}
async function POST(req, res) {}
async function PUT(req, res) {
  const userId = req.session.getUserId()
  const { id } = req.query
  const { content } = JSON.parse(req.body)
  res.status(200).json(await updatePrivate({ id, content }, userId))
}
async function DELETE(req, res) {
  const userId = req.session.getUserId()
  const { id } = req.query
  res.status(200).json(await removePrivate({ id }, userId))
}

export default async function handler(req, res) {
  //#region The route is protected
  await superTokensNextWrapper(
    async (next) => {
      await verifySession()(req, res, next)
    },
    req,
    res
  )
  //#endregion

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

import { superTokensNextWrapper } from "supertokens-node/nextjs"
import { verifySession } from "supertokens-node/recipe/session/framework/express"
import { addPrivate, findAllPrivate } from "../../repository/todos/prisma"

async function GET(req, res) {
  const userId = req.session.getUserId();
  res.status(200).json(await findAllPrivate(userId))
}
async function POST(req, res) {
  const userId = req.session.getUserId();
  const { content } = JSON.parse(req.body)
  res.status(200).json(await addPrivate({ content }, userId))
}
async function PUT(req, res) {}
async function DELETE(req, res) {}

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

import generatorIds from "../../utils/generatorIds"
import UserError from "../../utils/userError"

//#region Utilities
const next = generatorIds()
//#endregion

const todos = [
  {
    id: next(),
    content: "Cras justo odio",
  },
  {
    id: next(),
    content: "Dapibus ac facilisis in",
  },
  {
    id: next(),
    content: "Morbi leo risus",
  },
  {
    id: next(),
    content: "Porta ac consectetur ac",
  },
  {
    id: next(),
    content: "Vestibulum at eros",
  },
]

export async function findAll() {
  return todos
}

export async function find({ id }) {
  return todos.find((todo) => todo.id === id)
}

export async function add({ content }) {
  const todo = {
    id: next(),
    content,
  }
  todos.push(todo)
  return todo
}

export async function update({ id, content }) {
  try {
    const numberId = Number(id)
    let i = todos.findIndex((todo) => todo.id === numberId)
    todos[i] = { id, content }
    return todos[i]
  } catch (ex) {
    throw new UserError("Todo not found")
  }
}

export async function remove({ id }) {
  try {
    const numberId = Number(id)
    let i = todos.findIndex((todo) => todo.id === numberId)
    return todos.splice(i, 1)[0]
  } catch (ex) {
    throw new UserError("Todo not found")
  }
}

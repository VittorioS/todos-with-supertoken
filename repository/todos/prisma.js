import { PrismaClient } from "@prisma/client"
import UserError from "../../utils/userError"
const prisma = new PrismaClient({
  rejectOnNotFound: {
    findFirst: { Todos: (err) => new UserError("Todo not found") },
    findUnique: { Todos: (err) => new UserError("Todo not found") },
  },
})

export async function findAll() {
  try {
    return await prisma.todos.findMany()
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function findAllPrivate(supertokensId) {
  try {
    return await prisma.todos.findMany({
      where: {
        author: {
          supertokensId,
        },
      },
      orderBy: {
        id: 'asc'
      }
    })
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function find({ id }) {
  try {
    return await prisma.todos.findFirst({
      where: {
        id,
      },
    })
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function add({ content }) {
  try {
    return await prisma.todos.create({
      data: {
        content,
      },
    })
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function addPrivate({ content }, supertokensId) {
  try {
    return await prisma.todos.create({
      data: {
        content,
        author: {
          connect: {
            supertokensId,
          },
        },
      },
    })
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function update({ id, content }) {
  try {
    return await prisma.todos.update({
      data: {
        content,
      },
      where: {
        id: Number(id),
      },
    })
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function updatePrivate({ id, content }, supertokensId) {
  try {
    return await prisma.todos.update({
      data: {
        content,
      },
      where: {
        id: Number(id),
      },
    })
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function remove({ id }) {
  try {
    return await prisma.todos.delete({
      where: {
        id: Number(id),
      },
    })
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function removePrivate({ id }, supertokensId) {
  try {
    return await prisma.todos.delete({
      where: {
        id: Number(id),
      },
    })
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

import UserError from "../../utils/userError"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient({
  rejectOnNotFound: {
    findFirst: { User: (err) => new UserError("User not found") },
    findUnique: { User: (err) => new UserError("User not found") },
  },
})

export async function findById({ id }) {
  try {
    return await prisma.user.findFirst({
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

export async function findBySupertokensId({ supertokensId }) {
  try {
    return await prisma.user.findFirst({
      where: {
        supertokensId,
      },
    })
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function add({ supertokensId, firstname, lastname }) {
  try {
    return await prisma.user.create({
      data: {
        supertokensId,
        firstname,
        lastname,
      },
    })
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function updateById({ id, supertokensId, firstname, lastname }) {
  try {
    return await prisma.user.update({
      data: {
        supertokensId,
        firstname,
        lastname,
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

export async function updateBySupertokensId({
  supertokensId,
  firstname,
  lastname,
}) {
  try {
    return await prisma.user.update({
      data: {
        firstname,
        lastname,
      },
      where: {
        supertokensId,
      },
    })
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function removeById({ id }) {
  try {
    return await prisma.user.delete({
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

export async function removeBySupertokensId({ supertokensId }) {
  try {
    return await prisma.user.delete({
      where: {
        supertokensId,
      },
    })
  } catch (error) {
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

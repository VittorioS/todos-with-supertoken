import EmailPasswordNode from "supertokens-node/recipe/emailpassword"
import SessionNode from "supertokens-node/recipe/session"
import { add, findBySupertokensId } from "../repository/users/prisma"
import { appInfo } from "./appInfo"

export const backendConfig = () => {
  return {
    framework: "express",
    supertokens: {
      // try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
      connectionURI: "http://localhost:3567",
      // apiKey: "IF YOU HAVE AN API KEY FOR THE CORE, ADD IT HERE",
    },
    appInfo,
    recipeList: [
      EmailPasswordNode.init({
        signUpFeature: {
          formFields: [
            {
              id: "firstname",
            },
            {
              id: "lastname",
            },
          ],
        },
        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              signUpPOST: async function (input) {
                if (originalImplementation.signUpPOST === undefined) {
                  throw Error("Should never come here")
                }

                // First we call the original implementation of signUpPOST.
                let response = await originalImplementation.signUpPOST(input)

                // Post sign up response, we check if it was successful
                if (response.status === "OK") {
                  let { id: supertokensId, email } = response.user

                  // These are the input form fields values that the user used while signing up
                  let formFields = input.formFields.reduce(
                    (fields, { id }, i) => ({
                      ...fields,
                      [id]: input.formFields[i],
                    })
                  )

                  await add({
                    supertokensId,
                    firstname: formFields.firstname.value,
                    lastname: formFields.lastname.value,
                  })
                }
                return response
              },
            }
          },
        },
      }),
      SessionNode.init({
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,
              createNewSession: async function (input) {
                let supertokensId = input.userId

                // This goes in the access token, and is availble to read on the frontend.
                input.accessTokenPayload = {
                  ...input.accessTokenPayload,
                }

                const user = await findBySupertokensId({
                  supertokensId,
                })
                if (user) {
                  // This goes in the access token, and is availble to read on the frontend.
                  input.accessTokenPayload.userData = {
                    firstname: user.firstname,
                    lastname: user.lastname,
                  }
                }

                // This is stored in the db against the sessionHandle for this session
                input.sessionData = {
                  ...input.sessionData,
                  // someKey: "someValue",
                }

                return originalImplementation.createNewSession(input)
              },
            }
          },
        },
      }),
    ],
    isInServerlessEnv: true,
  }
}

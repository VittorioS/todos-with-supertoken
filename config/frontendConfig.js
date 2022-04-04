import EmailPasswordReact from "supertokens-auth-react/recipe/emailpassword"
import SessionReact from "supertokens-auth-react/recipe/session"
import { appInfo } from "./appInfo"

export const frontendConfig = () => {
  return {
    appInfo,
    recipeList: [
      EmailPasswordReact.init({
        signInAndUpFeature: {
          signUpForm: {
            formFields: [
              {
                id: "firstname",
                label: "First name",
                placeholder: "First name",
              },
              {
                id: "lastname",
                label: "Last name",
                placeholder: "Last name",
              }
            ],
          },
        },
        onHandleEvent: async (context) => {
          if (context.action === "SESSION_ALREADY_EXISTS") {
            // TODO:
          } else {
            if (context.action === "SUCCESS") {
              if (context.isNewUser) {
                // TODO: Sign up
              } else {
                // TODO: Sign in
                // Redirect to the home
                window.location.href = "/"
              }
            }
          }
        },
        getRedirectionURL: async (context) => {
          if (context.action === "SUCCESS") {
            if (context.redirectToPath !== undefined) {
              // we are navigating back to where the user was before they authenticated
              return context.redirectToPath
            }
            return "/"
          }
          return undefined
        },
      }),
      SessionReact.init(),
    ],
  }
}

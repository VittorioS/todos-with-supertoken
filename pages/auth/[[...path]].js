import React, { useEffect } from "react"
import dynamic from "next/dynamic"
import SuperTokens from "supertokens-auth-react"
import { redirectToAuth } from "supertokens-auth-react/recipe/emailpassword"

// const SuperTokensComponentNoSSR = dynamic(
//   new Promise((res) => res(SuperTokens.getRoutingComponent)),
//   { ssr: false }
// )
const SuperTokensComponentNoSSR = dynamic(
  async () => SuperTokens.getRoutingComponent,
  { ssr: false }
)

export default function Auth() {
  // if the user visits a page that is not handled by us (like /auth/random), then we redirect them back to the auth page.
  useEffect(() => {
    if (SuperTokens.canHandleRoute() === false) {
      redirectToAuth()
    }
  }, [])

  return <SuperTokensComponentNoSSR />
}

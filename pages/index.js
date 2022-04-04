import "bootstrap/dist/css/bootstrap.min.css"
import HomePage from "../components/Home"
import dynamic from "next/dynamic"
import EmailPassword from "supertokens-auth-react/recipe/emailpassword"

const EmailPasswordAuthNoSSR = dynamic(
  async () => EmailPassword.EmailPasswordAuth,
  { ssr: false }
)

export default function Home() {
  return (
    <EmailPasswordAuthNoSSR>
      <HomePage />
    </EmailPasswordAuthNoSSR>
  )
}

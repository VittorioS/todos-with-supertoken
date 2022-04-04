import Head from "next/head"
import { useState } from "react"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import ListGroup from "react-bootstrap/ListGroup"
import Navbar from "react-bootstrap/Navbar"
import Row from "react-bootstrap/Row"
import Spinner from "react-bootstrap/Spinner"
import useSWR from "swr"
import UserError from "../utils/userError"
import { signOut } from "supertokens-auth-react/recipe/emailpassword"
import { useSessionContext } from "supertokens-auth-react/recipe/session"

//#region Utilities
const res2json = (res) => res.json()
const fetcher = (...args) => fetch(...args).then(res2json)
//#endregion

export function Header({ fullName, signed, onSignOut }) {
  const handlerClickSignOut = () => {
    //#region fire sign out event
    const isSignOutValid = typeof onSignOut === "function"
    if (isSignOutValid) onSignOut()
    //#endregion
  }

  return (
    <Navbar bg="dark" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand href="/">Todos</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {signed ? (
            <>
              <Navbar.Text>
                Signed in as: <a href="#login">{fullName}</a>
              </Navbar.Text>
              <Button
                variant="outline-primary"
                className="ms-2"
                onClick={handlerClickSignOut}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button variant="primary">Login</Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export function Body() {
  const {
    data: todos,
    error,
    mutate: mutateTodos,
  } = useSWR("/api/todos", fetcher, {
    revalidateOnFocus: false,
    fallbackData: [],
  })
  const isLoading = !todos

  const handlerAdd = (content) => {
    //#region Validation
    //#endregion
    //#region Perform request
    fetch("api/todos", {
      method: "POST",
      body: JSON.stringify({ content }),
    })
      .then(res2json)
      .then((todo) => {
        return mutateTodos([...todos, todo])
      })
    //#endregion
  }

  const handlerEdit = ({ id, content }) => {
    //#region Validation
    //#endregion
    //#region Perform request
    fetch(`api/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ id, content }),
    })
      .then(res2json)
      .then((todoUpdated) => {
        return mutateTodos(
          todos.map((todo) => {
            if (todo.id === todoUpdated.id) return todoUpdated
            return todo
          })
        )
      })
    //#endregion
  }

  const handlerDelete = (id) => {
    //#region Validation
    //#endregion
    //#region Perform request
    fetch(`api/todos/${id}`, {
      method: "DELETE",
    })
      .then(res2json)
      .then((todoDeleted) => {
        return mutateTodos(todos.filter((todo) => todo.id !== todoDeleted.id))
      })
    //#endregion
  }

  return (
    <Container>
      <TodoForm className="pt-5" onAdd={handlerAdd}></TodoForm>
      <TodoList className="pt-3" loading={isLoading}>
        {todos.map(({ id, content }) => (
          <TodoItem
            key={id}
            id={id}
            onDelete={handlerDelete}
            onEdit={handlerEdit}
          >
            {content}
          </TodoItem>
        ))}
      </TodoList>
    </Container>
  )
}

export function TodoList({ className, children, loading }) {
  if (loading) {
    return (
      <div className={className}>
        <Row className="justify-content-center align-items-center">
          <Col className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      </div>
    )
  }
  return <ListGroup className={className}>{children}</ListGroup>
}

export function TodoItem({ id, children, onDelete, onEdit }) {
  const [editable, setEditable] = useState(false)

  const handlerClickEdit = () => setEditable(!editable)

  const handlerClickDelete = () => {
    //#region fire delete event
    const isDeleteValid = typeof onDelete === "function"
    if (isDeleteValid) onDelete(id)
    //#endregion
  }

  const handlerClickSave = (content) => {
    //#region fire save event
    const isSaveValid = typeof onEdit === "function"
    if (isSaveValid) onEdit({ id, content })
    //#endregion
  }

  return (
    <ListGroup.Item>
      <Row className="justify-content-center align-items-center">
        <Col>
          {editable ? (
            <TodoForm
              buttonText="Save"
              defaultContent={children}
              onAdd={handlerClickSave}
            ></TodoForm>
          ) : (
            <>{children}</>
          )}
        </Col>
        <Col xs="auto" className="text-align-right">
          {editable ? (
            <Button
              className="me-1"
              variant="secondary"
              onClick={handlerClickEdit}
            >
              Cancel
            </Button>
          ) : (
            <Button
              className="me-1"
              variant="secondary"
              onClick={handlerClickEdit}
            >
              Edit
            </Button>
          )}
          <Button variant="danger" onClick={handlerClickDelete}>
            Delete
          </Button>
        </Col>
      </Row>
    </ListGroup.Item>
  )
}

export function TodoForm({
  className,
  defaultContent = "",
  buttonText = "Add todo",
  onAdd,
}) {
  const [content, setContent] = useState(defaultContent)
  const [validated, setValidated] = useState(false)

  const handlerChange = (e) => setContent(e.target.value)

  const handlerSubmit = (event) => {
    const form = event.currentTarget
    event.preventDefault()

    try {
      //#region Validation
      if (!form.checkValidity()) throw UserError("Validation failed")
      if (content == "") throw UserError("Content is mandatory")
      //#endregion

      //#region fire add event
      const isAddValid = typeof onAdd === "function"
      if (isAddValid) onAdd(content)
      //#endregion

      //#region Perform request
      //#endregion
      setValidated(true)
      setContent("")
      form.reset()
    } catch (exception) {
      setValidated(false)
      handlerUserError(exception)
    }
  }

  const handlerUserError = (error) => {
    const isUserErrorInstance = e instanceof UserError
    if (!isUserErrorInstance) throw error
  }

  return (
    <Form className={className} validated={validated} onSubmit={handlerSubmit}>
      <Row className="justify-content-center align-items-center">
        <Col>
          <Form.Label htmlFor="todoInput" visuallyHidden>
            Todo
          </Form.Label>
          <Form.Control
            id="todoInput"
            placeholder="Todo"
            onChange={handlerChange}
            value={content}
            required
          />
        </Col>
        <Col xs="auto" className="text-align-right">
          <Button type="submit">{buttonText}</Button>
        </Col>
      </Row>
    </Form>
  )
}

export default function Page() {
  let {
    userId,
    accessTokenPayload: { userData },
  } = useSessionContext()
  const fullName = userData.firstname + " " + userData.lastname

  const handlerSignOut = async () => {
    await signOut()
    window.location.href = "/"
  }

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header
        fullName={fullName}
        signed={true}
        onSignOut={handlerSignOut}
      ></Header>
      <Body></Body>
    </>
  )
}

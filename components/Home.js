import Head from "next/head"
import { useEffect, useState } from "react"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import ListGroup from "react-bootstrap/ListGroup"
import Navbar from "react-bootstrap/Navbar"
import Row from "react-bootstrap/Row"
import Spinner from "react-bootstrap/Spinner"
import UserError from "../utils/userError"

//#region Utilities
const res2json = (res) => res.json()
//#endregion

export function Header({ signed }) {
  return (
    <Navbar bg="dark" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand href="/">Todos</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {signed ? (
            <>
              <Navbar.Text>
                Signed in as: <a href="#login">Mark Otto</a>
              </Navbar.Text>
              <Button variant="outline-primary" className="ms-2">
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
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch("api/todos")
      .then(res2json)
      .then((data) => {
        setTodos(data)
        setLoading(false)
      })
  }, [])

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
        setTodos([...todos, todo])
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
        setTodos([...todos.filter((todo) => todo.id !== todoDeleted.id)])
      })
    //#endregion
  }

  return (
    <Container>
      <TodoForm className="pt-5" onAdd={handlerAdd}></TodoForm>
      <TodoList className="pt-3" loading={loading}>
        {todos.map(({ id, content }) => (
          <TodoItem key={id} id={id} onDelete={handlerDelete}>
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

export function TodoItem({ id, children, onDelete }) {
  const handlerClickDelete = () => {
    //#region fire delete event
    const isDeleteValid = typeof onDelete === "function"
    if (isDeleteValid) onDelete(id)
    //#endregion
  }

  return (
    <ListGroup.Item>
      <Row className="justify-content-center align-items-center">
        <Col>{children}</Col>
        <Col xs="auto" className="text-align-right">
          <Button variant="danger" onClick={handlerClickDelete}>
            Delete
          </Button>
        </Col>
      </Row>
    </ListGroup.Item>
  )
}

export function TodoForm({ className, onAdd }) {
  const [content, setContent] = useState("")
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
            required
          />
        </Col>
        <Col xs="auto" className="text-align-right">
          <Button type="submit">Add todo</Button>
        </Col>
      </Row>
    </Form>
  )
}

export default function Page() {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header signed={false}></Header>
      <Body></Body>
    </>
  )
}

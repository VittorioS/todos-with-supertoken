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
import useSWR from "swr"
import UserError from "../utils/userError"
import { signOut } from "supertokens-auth-react/recipe/emailpassword"
import { useSessionContext } from "supertokens-auth-react/recipe/session"

//#region Utilities
const res2json = (res) => res.json()
const fetcher = (...args) => fetch(...args).then(res2json)
//#endregion

//#region Repository
const TodoRepositoryREST = {
  create: async (content) => {
    //#region Perform request
    const response = await fetch("api/todos", {
      method: "POST",
      body: JSON.stringify({ content }),
    })
    return res2json(response)
    //#endregion
  },
  update: async ({ id, content }) => {
    //#region Perform request
    const response = await fetch(`api/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ id, content }),
    })
    return res2json(response)
    //#endregion
  },
  remove: async (id) => {
    //#region Perform request
    const response = await fetch(`api/todos/${id}`, {
      method: "DELETE",
    })
    return res2json(response)
    //#endregion
  },
}
//#endregion

//#region Hooks
export function useTodos(TodoRepository) {
  const {
    data: todos,
    error,
    mutate: mutateTodos,
  } = useSWR("/api/todos", fetcher, {
    revalidateOnFocus: false,
    fallbackData: [],
  })

  const create = async (content) => {
    //#region Validation
    //#endregion
    //#region Perform request
    const todo = await TodoRepository.create(content)
    return mutateTodos([...todos, todo])
    //#endregion
  }

  const update = async ({ id, content }) => {
    //#region Validation
    //#endregion
    //#region Perform request
    const todoUpdated = await TodoRepository.update({ id, content })
    return mutateTodos(
      todos.map((todo) => {
        if (todo.id === todoUpdated.id) return todoUpdated
        return todo
      })
    )
    //#endregion
  }

  const remove = async (id) => {
    //#region Validation
    //#endregion
    //#region Perform request
    const todoDeleted = await TodoRepository.remove(id)
    return mutateTodos(todos.filter((todo) => todo.id !== todoDeleted.id))
    //#endregion
  }

  return [todos, { create, update, remove }]
}
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
  const [
    todos,
    { create: createTodo, update: updateTodo, remove: removeTodo },
  ] = useTodos(TodoRepositoryREST)
  const [content, setContent] = useState("")
  const isLoading = !todos

  const handlerChangeContent = (newContent) => setContent(newContent)

  const handlerAdd = async (content) => {
    await createTodo(content)
    setContent("")
  }

  return (
    <Container>
      <TodoForm
        className="pt-5"
        content={content}
        onChangeContent={handlerChangeContent}
        onSubmit={handlerAdd}
      ></TodoForm>
      <TodoList className="pt-3" loading={isLoading}>
        {todos.map(({ id, content }) => (
          <TodoItemEditable
            key={id}
            onClickDelete={() => removeTodo(id)}
            onClickSave={(newContent) =>
              updateTodo({ id, content: newContent })
            }
          >
            {content}
          </TodoItemEditable>
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
  content = "",
  buttonText = "Add todo",
  onChangeContent,
  onSubmit,
}) {
  const [validated, setValidated] = useState(false)

  const handlerChange = (e) => {
    //#region fire change content event
    const isChangeContentValid = typeof onChangeContent === "function"
    if (isChangeContentValid) onChangeContent(e.target.value)
    //#endregion
  }

  const handlerSubmit = (event) => {
    const form = event.currentTarget
    event.preventDefault()

    try {
      //#region Validation
      if (!form.checkValidity()) throw new UserError("Validation failed")
      if (content == "") throw new UserError("Content is mandatory")
      //#endregion

      //#region fire submit event
      const isSubmitValid = typeof onSubmit === "function"
      if (isSubmitValid) onSubmit(content)
      //#endregion

      setValidated(true)
    } catch (exception) {
      setValidated(false)
      handlerUserError(exception)
    }
  }

  const handlerUserError = (error) => {
    const isUserErrorInstance = error instanceof UserError
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

export function TodoItemBasic(props) {
  if (props.buttons == null) {
    return <ListGroup.Item>{props.children}</ListGroup.Item>
  }
  return (
    <ListGroup.Item>
      <Row className="justify-content-center align-items-center">
        <Col>{props.children}</Col>
        <Col xs="auto" className="text-align-right">
          {props.buttons}
        </Col>
      </Row>
    </ListGroup.Item>
  )
}

export function TodoItemEditable(props) {
  const [editable, setEditable] = useState(false)
  const [content, setContent] = useState("")

  useEffect(() => {
    setContent(props.children)
  }, [props.children])

  useEffect(() => {
    setEditable(props.editable)
  }, [props.editable])

  const handlerChangeContent = (newContent) => setContent(newContent)

  const handlerClickDelete = () => {
    //#region fire delete event
    if (typeof props.onClickDelete === "function") props.onClickDelete()
    //#endregion
  }

  const handlerClickEdit = () => {
    //#region fire edit event
    if (typeof props.onClickEdit === "function") props.onClickEdit()
    //#endregion
    setEditable(true)
  }

  const handlerClickCancel = () => {
    //#region fire edit event
    if (typeof props.onClickEdit === "function") props.onClickEdit()
    //#endregion
    setEditable(false)
    setContent(props.children)
  }

  const handlerClickSave = (newContent) => {
    //#region fire save event
    if (typeof props.onClickSave === "function") props.onClickSave(newContent)
    //#endregion
    setEditable(false)
  }

  const DeleteButton = (
    <Button key="deleteButton" variant="danger" onClick={handlerClickDelete}>
      Delete
    </Button>
  )

  const EditButton = (
    <Button
      key="editButton"
      className="me-1"
      variant="secondary"
      onClick={handlerClickEdit}
    >
      Edit
    </Button>
  )

  const CancelButton = (
    <Button
      key="cancelButton"
      className="me-1"
      variant="secondary"
      onClick={handlerClickCancel}
    >
      Cancel
    </Button>
  )

  const buttons = []
  if (editable) {
    buttons.push(CancelButton)
  } else {
    buttons.push(EditButton)
  }
  buttons.push(DeleteButton)

  let children
  if (editable) {
    children = (
      <TodoForm
        buttonText="Save"
        content={content}
        onChangeContent={handlerChangeContent}
        onSubmit={handlerClickSave}
      ></TodoForm>
    )
  } else {
    children = props.children
  }
  return <TodoItemBasic buttons={buttons}>{children}</TodoItemBasic>
}

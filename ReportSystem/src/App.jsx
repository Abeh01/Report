// src/App.tsx (or App.jsx)
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {
  Button,
  Container,
  Navbar,
  Nav,
  Row,
  Col,
  Card,
  ButtonGroup,
  Form
} from 'react-bootstrap'

function getInitialTheme() {
  const saved = localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') return saved
  return (typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches)
      ? 'dark'
      : 'light'
}

export default function App() {
  const [count, setCount] = useState(0)
  const [theme, setTheme] = useState(getInitialTheme)
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleLabel = useMemo(
    () => (theme === 'dark' ? 'Light Mode' : 'Dark Mode'),
    [theme]
  )
  const toggleIcon = theme === 'dark' ? '☀️' : '🌙'

  return (
    <>
      {/* --- Navbar --- */}
      <Navbar expand="md" className="mb-4 border-bottom" sticky="top">
        <Container>
          <Navbar.Brand className="d-flex align-items-center gap-2">
            <img src={viteLogo} alt="Vite" height={24} />
            <strong>Vite + React</strong>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="top-nav" />
          <Navbar.Collapse id="top-nav" className="justify-content-end">
            <Nav className="me-3">
              <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
              <Nav.Link onClick={() => navigate('/report')}>Report</Nav.Link>
              <Nav.Link onClick={() => navigate('/create')}>Create</Nav.Link>
            </Nav>

            <Form.Check
              type="switch"
              id="theme-switch"
              label={`${toggleIcon} ${toggleLabel}`}
              checked={theme === 'dark'}
              onChange={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
            />
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* --- Hero section --- */}
      <Container className="mb-5">
        <Row className="align-items-center gy-4">
          <Col xs={12} md={5} className="text-center">
            <a href="https://vite.dev" target="_blank" rel="noreferrer">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank" rel="noreferrer">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </Col>
          <Col xs={12} md={7}>
            <h1 className="display-6 fw-semibold mb-3">Vite + React Starter</h1>
            <p className="lead read-the-docs mb-4">
              Fast dev server, instant HMR, and Bootstrap 5.3 theming with a single toggle.
            </p>
            <ButtonGroup>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="info">Info</Button>
              <Button variant="light">Light</Button>
            </ButtonGroup>
            <div className="mt-3">
              <Button variant="link" onClick={() => navigate('/create')}>
                Create a Report
              </Button>
              <Button variant="link" onClick={() => navigate('/report')}>
                Go to Report
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* --- Content card --- */}
      <Container className="mb-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="card">
              <Card.Body>
                <Card.Title className="mb-3">Counter</Card.Title>
                <Button onClick={() => setCount(c => c + 1)}>
                  Count is {count}
                </Button>
                <p className="mt-3 mb-0">
                  Edit <code>src/App.tsx</code> and save to test HMR.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* --- Footer --- */}
      <footer className="py-4 border-top">
        <Container className="text-center small read-the-docs">
          Click on the Vite and React logos to learn more.
        </Container>
      </footer>
    </>
  )
}


import { useEffect, useState } from 'react';
import './App.scss';
import { GiTakeMyMoney } from 'react-icons/gi';
import { Button, Container, Nav, Navbar, Spinner, Placeholder, Stack } from 'react-bootstrap';
import RoutePages from './Routes';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { setCookie } from './services/cookie-manager';
import { AppContext } from './lib/userContext';

function App() {
  const navigate = useNavigate();
  const [isAuthenticating, setAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);


  const onLoad = async (): Promise<void> => {
    try {
      const session = await (await Auth.currentSession()).getAccessToken();
      setCookie('Authorization', session.getJwtToken());
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== 'No current user') {
        console.error('My Auth Error --- ', JSON.stringify(e));
      }
    }

    setAuthenticating(false);
  }

  const handleLogout = async (): Promise<void> => {
    try {
      const session = await Auth.signOut();
      userHasAuthenticated(false);
      navigate('/login');
    } catch (e) {
      console.error(e)
    }

  }

  useEffect(() => {
    onLoad();
  }, []);

  return (
    !isAuthenticating ? (
      <>
        <Navbar bg="light" variant="light" className="shadow-sm p-1 mb-5 bg-white rounded">
          <Container>
            <Navbar.Brand href="/"><GiTakeMyMoney /> Expense Tracker </Navbar.Brand>
            <Nav className="d-flex">
              <>
                {
                  isAuthenticated ? (
                    <Stack direction='horizontal' gap={2}>
                      <Nav.Link href="/add-expense">
                        <Button variant='primary'>
                          Add Expense
                        </Button>
                      </Nav.Link>
                      <Button variant="outline-primary" onClick={handleLogout}>
                        Logout
                      </Button>
                    </Stack>
                  ) : (
                    <>
                      <Nav.Link href="/register">
                        <Button variant="outline-primary">Create Account</Button>
                      </Nav.Link>
                      <Nav.Link href="/login">
                        <Button variant="primary">Login</Button>
                      </Nav.Link>
                    </>
                  )
                }
              </>
            </Nav>
          </Container>
        </Navbar>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <RoutePages />
        </AppContext.Provider>
      </>
    ) : (
      <>
        <Navbar bg="light" variant="light" className="shadow-sm p-1 mb-5 bg-white rounded">
          <Container>
            <Navbar.Brand><GiTakeMyMoney /> Expense Tracker </Navbar.Brand>
            <Nav className="d-flex">

              <Placeholder as={Nav.Link} animation="glow">
                <Placeholder.Button variant="primary" sm={12}></Placeholder.Button>
              </Placeholder>

              <Nav.Link href="/login">
                <Button variant="primary">Login</Button>
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Container className='d-flex align-items-center justify-content-center' style={{ height: '80vh' }}>
          <Spinner size="sm" animation="grow" />
          <Spinner size="sm" animation="grow" />
          <Spinner animation="grow" />
          <Spinner animation="grow" />
        </Container>
      </>
    )
  );
}

export default App;

import { Auth } from "aws-amplify";
import {
    Container, Row, Col, Card,
    Form, FormGroup, Button, Stack, Alert
} from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { setCookie } from "../services/cookie-manager";
import { useAppContext } from '../lib/userContext';
import { useState } from "react";


const Login = (): JSX.Element => {
    const { userHasAuthenticated } = useAppContext();
    const navigate = useNavigate();
    const [error, setError] = useState({
        show: false,
        code: 0,
        message: ''
    });

    const handleLoginSubmit = async (event: any): Promise<void> => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const form = Object.fromEntries(formData.entries());

        try {
            const user = await Auth.signIn(
                form.email.toString(),
                form.password.toString()
            )
            const session = user.getSignInUserSession().getAccessToken().getJwtToken();
            setCookie("Authorization", session);
            userHasAuthenticated(true);
            navigate('/');

        } catch (e: any) {
            console.error('My Error', JSON.stringify(e));
            if (e.code === 'NotAuthorizedException') {
                setError({
                    show: true,
                    code: e.code,
                    message: 'Please enter valid credentials!!'
                });
                return;
            }
            setError({
                show: true,
                code: e.code,
                message: e.name
            });
        }
    }

    const closeAlertMessage = (): void => {
        setError({
            show: false,
            code: 0,
            message: ''
        })
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col sm={6} className="text-right">
                    {
                        error?.show && (
                            <Alert variant="danger" dismissible onClose={closeAlertMessage}>{error.message}</Alert>
                        )
                    }
                    <Card>
                        <Card.Header>Login</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleLoginSubmit}>
                                <FormGroup controlId="email" className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control required type="email" name="email" placeholder="Enter the email!!" />
                                </FormGroup>
                                <FormGroup controlId="password" className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name="password" placeholder="Enter the password!!" />
                                </FormGroup>
                                <Stack direction="horizontal" gap={2} className="justify-content-end">
                                    <Link to="/">
                                        <Button variant="outline-secondary">Cancel</Button>
                                    </Link>
                                    <Button type="submit" variant="primary">Submit</Button>
                                </Stack>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Login;
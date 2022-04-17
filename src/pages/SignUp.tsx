import { Auth } from "aws-amplify";
import { useState } from "react";
import { Container, Row, Col, Card, Form, FormGroup, Button, Toast, ToastContainer } from "react-bootstrap"
import OtpInput from "react-otp-input";
import { setCookie } from "../services/cookie-manager";
import './SignUp.scss';
import { useAppContext } from '../lib/userContext';
import { useNavigate } from 'react-router-dom';

const SignUp = (): JSX.Element => {
    const { userHasAuthenticated } = useAppContext();
    const navigate = useNavigate();
    const [state, setState] = useState({
        email: '',
        password: '',
        code: '',
        isSigned: false,
        otp: '',
        showToast: false
    });


    const handleOtpChange = (otpInput: any): void => {
        setState((prev) => ({
            ...prev,
            code: otpInput
        }));
    }

    const handleSignupSubmit = async (event: any): Promise<void> => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const form = Object.fromEntries(formData.entries());
        setState((prev) => ({
            ...prev,
            email: form.email.toString(),
            password: form.password.toString(),
        }));

        try {
            await Auth.signUp({
                username: form.email.toString(),
                password: form.password.toString(),
                attributes: {
                    email: form.email.toString()
                }
            });

            setState((prev) => ({
                ...prev,
                isSigned: true,
                showToast: true
            }));
        } catch (e) {
            console.log("Auth - ", e);
        }
    }

    const handleConfirmUser = async (): Promise<void> => {
        try {
            const confirmed = await Auth.confirmSignUp(state.email, state.code);
            if (confirmed === "SUCCESS") {
                const user = await Auth.signIn(state.email, state.password);
                const session = user.getSignInUserSession().getAccessToken();
                setCookie('Authorization', session.jwtToken)
                userHasAuthenticated(true);
                navigate("/");
            } else {
                setState((prev) => ({
                    ...prev,
                    isSigned: false
                }))
            }
        } catch (e) {
            console.error(e);
        }

    }


    return (
        <Container>
            <Row className="justify-content-center">
                <Col sm={6} className="text-right">
                    {
                        !state.isSigned ? (
                            <Card>
                                <Card.Header>User Registration</Card.Header>
                                <Card.Body>
                                    <Form onSubmit={handleSignupSubmit}>
                                        <FormGroup controlId="email" className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" name="email" placeholder="Enter the email!!" />
                                        </FormGroup>
                                        <FormGroup controlId="password" className="mb-3">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" name="password" placeholder="Enter the password!!" />
                                        </FormGroup>
                                        <div className="d-grid">
                                            <Button type="submit" variant="primary">Submit</Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        ) : (
                            <Card>
                                <Card.Header>OTP Confirmation</Card.Header>
                                <Card.Body>
                                    <div className="d-grid mb-3">
                                        <OtpInput
                                            value={state.code}
                                            onChange={handleOtpChange}
                                            numInputs={6}
                                            separator={<span>-</span>}
                                            className="otp-container"
                                        />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <Button
                                            variant="primary"
                                            disabled={state.code.length !== 6}
                                            onClick={handleConfirmUser}>Verify</Button>
                                    </div>

                                </Card.Body>
                            </Card>
                        )
                    }
                </Col>
            </Row>
            <ToastContainer position="top-end">
                <Toast bg="success" onClose={() => setState((prev) => ({ ...prev, showToast: false }))} show={state.showToast} autohide>
                    <Toast.Header>
                        <strong className="me-auto">OTP Sent successfully to {state.email}</strong>
                    </Toast.Header>
                </Toast>
            </ToastContainer>

        </Container>
    )
}

export default SignUp;
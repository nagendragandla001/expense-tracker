import { Button, Card, Col, Container, Form, FormControl, FormGroup, Row, Stack } from "react-bootstrap"
import { useNavigate } from 'react-router-dom';
import { addExpense } from "../services/expenses-service";

const AddExpense = (props: any): JSX.Element => {
    const navigate = useNavigate();

    const handleSubmit = async (event: any): Promise<void> => {
        event?.preventDefault();

        const formData = new FormData(event.target);
        const form = Object.fromEntries(formData.entries());
        const body = {
            "id": new Date().getTime(),
            "date": form.date.toString(),
            "amount": form.amount,
            "type": form.type.toString()
        }
        const resp = await addExpense(body);
        if ([200, 201, 202].includes(resp.status)) {
            navigate('/');
        }
    }

    const handleCancel = (): void => {
        navigate('/');
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col sm={6}>
                    <Card>
                        <Card.Header>Add an Expense</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <FormGroup controlId='type' className="mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <FormControl name="type" type='text' placeholder='Enter Expense Type' />
                                </FormGroup>
                                <FormGroup controlId='amount' className="mb-3">
                                    <Form.Label>Amount</Form.Label>
                                    <FormControl name="amount" type='number' placeholder='Enter Expense Cost' />
                                </FormGroup>
                                <FormGroup controlId='date' className="mb-3">
                                    <Form.Label>Date</Form.Label>
                                    <FormControl name="date" type='date' placeholder='Enter Expense Date' />
                                </FormGroup>
                                <div className="d-flex d-flex justify-content-center">
                                    <Stack direction='horizontal' gap={3}>
                                        <Button variant="outline-primary" onClick={handleCancel}>Cancel</Button>
                                        <Button type="submit" variant="primary">Submit</Button>
                                    </Stack>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>

                </Col>
            </Row>
        </Container>
    )
}

export default AddExpense;
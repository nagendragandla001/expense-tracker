import { useEffect, useState } from "react";
import { Container, Row, Col, Image, ListGroup, ListGroupItem, Button, Spinner, Card, Stack } from "react-bootstrap";
import { useAppContext } from '../../lib/userContext';
import { deleteExpense, ExpenseI, ExpensesI, getExpenses } from "../../services/expenses-service";
import { BsFillTrashFill } from 'react-icons/bs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
    Title
);


export const barOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Expense Report',
        },
    },
};

const Home = (): JSX.Element => {
    const { isAuthenticated } = useAppContext();
    const [expenses, setExpenses] = useState({} as ExpensesI);
    const [pieData, setPieData] = useState({
        labels: [],
        datasets: [],
        borderWidth: 1,
    } as any);

    const [barData, setBarData] = useState({
        labels: [],
        datasets: [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
    } as any);

    const [filter, setFilter] = useState({
        start: '',
        end: ''
    })

    const flatResponse = (data: any): any => {
        return data.Items.map((ex: any) => ({
            date: ex.date.S,
            expense: ex.expense.N,
            expenseId: ex.expenseId.N,
            expenseType: ex.expenseType.S
        }))
    }

    const loadExpenses = async (): Promise<void> => {
        const apiResponse = await getExpenses();
        if (apiResponse?.status === 200) {
            const flatItems = flatResponse(apiResponse.data);
            setExpenses({
                Count: apiResponse.data.Count,
                ScannedCount: apiResponse.data.ScannedCount,
                Items: flatItems
            });
        }
    }

    const deleteExpenseHandler = async (expense: ExpenseI, event: any): Promise<void> => {
        event.preventDefault();
        const resp = await deleteExpense({ "expenseId": expense.expenseId });

        if ([200, 201, 202].includes(resp.status)) {
            loadExpenses();
        }
    }

    const handleStartDateChange = (event: any): void => {
        setFilter((prev) => ({
            ...prev,
            start: event.target.value
        }));
    };
    const handleEndDateChange = (event: any): void => {
        setFilter((prev) => ({
            ...prev,
            end: event.target.value
        }));
    }

    const buildBarChartData = (expenseData: ExpensesI) => {
        const labels = expenseData.Items.map((expense: ExpenseI) => expense.date);
        const data = expenseData.Items.map((expense: ExpenseI) => expense.expense);
        setBarData({
            labels: labels,
            datasets: [
                {
                    label: 'Expenses',
                    data: data,
                    backgroundColor: 'rgba(70, 149, 255, 0.52)'
                }
            ]
        })
    }

    const buildPieChardData = (expenseData: ExpensesI) => {
        const labels = expenseData?.Items?.map(expense => expense.expenseType);
        const data = expenseData?.Items?.map(expense => expense.expense);
        const colors = expenseData?.Items?.map(expense => dynamicColors());
        setPieData({
            labels: labels,
            datasets: [
                {
                    label: 'Expenses',
                    data: data,
                    backgroundColor: colors,
                    borderColor: colors,
                    borderWidth: 1,
                }
            ]
        })
    }

    var dynamicColors = function () {
        const letters = 'BCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    };

    const applyFilter = (): void => {

        if (filter.start <= filter.end) {
            const filters = expenses.Items.filter((exp: any): any => {
                if (filter.start <= exp.date && exp.date <= filter.end) {
                    return exp;
                }
            });

            buildPieChardData({
                Count: filters.length,
                ScannedCount: filters.length,
                Items: filters
            });

            buildBarChartData({
                Count: filters.length,
                ScannedCount: filters.length,
                Items: filters
            });

        }

    }

    useEffect(() => {
        loadExpenses();
    }, [isAuthenticated]);

    useEffect(() => {
        if (expenses.Count > 0) {
            buildPieChardData(expenses);
            buildBarChartData(expenses);
        }
    }, [expenses.Count])

    return (
        <Container>
            {
                isAuthenticated ? (
                    <Row className="justify-content-center">
                        {
                            expenses?.Items?.length > 0 ? (
                                <>
                                    <Col sm={12} className="mb-5">
                                        <ListGroup key="list-header" variant="flush" className="rounded">
                                            <ListGroupItem key="list-header-row" variant="primary">
                                                <Row>
                                                    <Col sm={3}>Date</Col>
                                                    <Col sm={4}>Type</Col>
                                                    <Col sm={5}>Amount</Col>
                                                </Row>
                                            </ListGroupItem>
                                        </ListGroup>
                                        <ListGroup key="list-content" variant="flush">
                                            {
                                                expenses?.Items?.map((expense: ExpenseI) => (
                                                    <ListGroupItem key={Math.random()}>
                                                        <Row>
                                                            <Col sm={3}>{expense.date}</Col>
                                                            <Col sm={4}>{expense.expenseType}</Col>
                                                            <Col sm={3}>{expense.expense}</Col>
                                                            <Col sm={2}>
                                                                <Button variant="link" onClick={(event) => deleteExpenseHandler(expense, event)}>
                                                                    <BsFillTrashFill />
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </ListGroupItem>
                                                ))
                                            }
                                        </ListGroup>
                                    </Col>
                                    <Col sm={12} className="mb-5">
                                        <Card className="p-4">
                                            <Row className="align-items-center justify-content-start" offse>
                                                <Col sm={6}>
                                                    <Stack direction="vertical" gap={4}>
                                                        <Card style={{ width: 300 }}>
                                                            <Card.Header>Filters</Card.Header>
                                                            <Card.Body>
                                                                <Stack direction="vertical" gap={4}>
                                                                    <input onChange={handleStartDateChange} type="date" name="startDate" />
                                                                    <input onChange={handleEndDateChange} type="date" name="endDate" />
                                                                    <Button
                                                                        variant="primary"
                                                                        onClick={applyFilter}
                                                                        disabled={(filter.start === '' || filter.end === '') || (filter.start >= filter.end)}
                                                                    >Apply</Button>
                                                                </Stack>
                                                            </Card.Body>
                                                        </Card>
                                                    </Stack>
                                                </Col>
                                                <Col sm={5}>
                                                    <Stack direction="vertical" gap={5}>
                                                        <Pie data={pieData} options={{
                                                            plugins: {
                                                                legend: {
                                                                    position: 'right'
                                                                },
                                                            }
                                                        }} />
                                                        <Bar options={barOptions} data={barData} />

                                                    </Stack>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </>
                            ) : (
                                <>
                                    <Spinner animation="border" />
                                    <Spinner animation="grow" />
                                    <Spinner animation="grow" />
                                </>
                            )
                        }

                    </Row>
                ) : (
                    <Row className="align-items-center">
                        <Col sm={6}>
                            <h2>Simple, Better and Effective</h2>
                            <small>A simple platform for all expense calculations</small>
                        </Col>
                        <Col sm={6}>
                            <Image src='/money-2.svg' height={300} />
                        </Col>
                    </Row >
                )
            }
        </Container>
    )
}

export default Home;
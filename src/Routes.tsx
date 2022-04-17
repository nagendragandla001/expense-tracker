import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UnauthenticatedRoute from './components/UnAuthenticatedRoute';
import Home from './pages/Home';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import AddExpense from './pages/AddExpense';

const RoutePages = (): JSX.Element => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<UnauthenticatedRoute />}>
                <Route path="/login" element={<Login />} />
            </Route>
            <Route path='/register' element={<UnauthenticatedRoute />}>
                <Route path='/register' element={<SignUp />} />
            </Route>
            <Route path='/add-expense' element={<AuthenticatedRoute />}>
                <Route path='/add-expense' element={<AddExpense />} />
            </Route>
        </Routes>
    )
}

export default RoutePages;
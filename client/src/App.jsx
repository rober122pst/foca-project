import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Rotina from './pages/Rotina.jsx';

const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const AuthPage = lazy(() => import('./pages/oAuthPages/AuthPage.jsx'));

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="rotina" element={<Rotina />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;

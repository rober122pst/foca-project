import { Route, Routes } from 'react-router-dom';

import { lazy } from 'react';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Overview from './pages/dashboard/Overview.jsx';
import Rotina from './pages/dashboard/Rotina.jsx';

const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const AuthPage = lazy(() => import('./pages/oAuthPages/AuthPage.jsx'));

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Overview />} />
                    <Route path="rotina" element={<Rotina />} />
                    <Route path="*" element={<h1>Error 404</h1>} />
                </Route>
            </Routes>
        </>
    );
}

export default App;

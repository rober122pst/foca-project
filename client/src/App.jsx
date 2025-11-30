import { Route, Routes } from 'react-router-dom';

import { lazy } from 'react';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import AiPage from './pages/dashboard/AiPage.jsx';
import Class from './pages/dashboard/Class.jsx';
import Overview from './pages/dashboard/Overview.jsx';
import Routine from './pages/dashboard/Routine.jsx';
import Tasks from './pages/dashboard/Tasks.jsx';
import CallbackHandler from './pages/oAuthPages/CallbackHandler.jsx';
import PomodoroPage from './pages/PomodoroPage.jsx';

const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const AuthPage = lazy(() => import('./pages/oAuthPages/AuthPage.jsx'));

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/callback-handler" element={<CallbackHandler />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Overview />} />
                    <Route path="rotina" element={<Routine />} />
                    <Route path="tarefa" element={<Tasks />} />
                    <Route path="turmas" element={<Class />} />
                    <Route path="ai" element={<AiPage />} />
                    <Route path="*" element={<h1>Error 404</h1>} />
                </Route>
                <Route path="/pomodoro" element={<PomodoroPage />} />
            </Routes>
        </>
    );
}

export default App;

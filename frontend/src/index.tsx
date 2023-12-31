import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from './Login';
import { CookiesProvider } from 'react-cookie';
import { GroupManagementPage } from './GroupManagement';
import { AddGroupPage } from './GroupManagement/addGroupPage';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './common/theme';
import { GroupDetailedPage } from './GroupManagement/detailedPage';
import { TaskAddPage } from './TaskManagement/addTaskPage';
import App from './App';
import { TaskManagementPage } from './TaskManagement';
import { DiagramPresentationPage } from './DiagramManagement/presenting';
import { DiagramMergingPage } from './DiagramManagement/merging';

const routes = [
    {
        path: '/groups',
        element: <GroupManagementPage />,
    },
    {
        path: '/groups/:groupId/tasks',
        element: <GroupDetailedPage />,
    },
    {
        path: '/groups/:groupId/tasks/:taskId',
        element: <TaskManagementPage />,
    },
    {
        path: '/groups/:groupId/tasks/add',
        element: <TaskAddPage />,
    },
    {
        path: '/groups/add',
        element: <AddGroupPage />,
    },
    {
        path: '/groups/:groupId/tasks/:taskId/subtasks/:subtaskId/diagrams/:diagramId',
        element: <App />,
    },
    {
        path: '/groups/:groupId/tasks/:taskId/subtasks/:subtaskId/presentation',
        element: <DiagramPresentationPage />,
    },
    {
        path: '/groups/:groupId/tasks/:taskId/subtasks/:subtaskId/merging',
        element: <DiagramMergingPage />,
    },
];

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <CookiesProvider>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Routes>
                    <Route path='/' element={<LoginPage />} />
                    {routes.map((config) => (
                        <Route
                            key={config.path}
                            path={config.path}
                            element={config.element}
                        />
                    ))}
                </Routes>
            </ThemeProvider>
        </BrowserRouter>
    </CookiesProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

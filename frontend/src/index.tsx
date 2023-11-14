import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LandingPage } from './components/landingPage';
import { LoginPage } from './Login';
import { CookiesProvider } from 'react-cookie';

const routes = [
    {
        path: '/diagrams',
        element: <LandingPage />,
    },
    {
        path: '/diagrams/:diagramId',
        element: <App />,
    },
];

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <CookiesProvider>
        <BrowserRouter>
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
        </BrowserRouter>
    </CookiesProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

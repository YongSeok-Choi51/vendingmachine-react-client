import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import VendingMachineListPage from './pages/vendingmachine/VendingMachineListPage.tsx';
import VendingMachineSalePage from './pages/vendingmachine/VendingMachineSalePage.tsx';


const router = createBrowserRouter([
    {
        path: "/",
        element: <VendingMachineListPage />
    },
    {
        path: "/vm",
        element: <VendingMachineSalePage />
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);

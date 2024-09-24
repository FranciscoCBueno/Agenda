import { createBrowserRouter, Navigate } from "react-router-dom";

import App from '../App'
import { AddContato } from "../components/AddContato/AddContato";
import { Contatos } from "../components/Contatos/Contatos";

export const Rotas = createBrowserRouter([
    {
        path:"/",
        element: <App/>,
        children: [
            {
                index: true,
                element: <Navigate to="/contatos" replace/>
            },
            {
                path: "/contatos",
                element: <Contatos/>
            },
            {
                path: "/addcontato",
                element: <AddContato/>
            }
        ]
    }
]);
import Play from './Navigation/play/Play';

import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";

import RootNavigation from './RootNavigation';
import ErrorPage from './ErrorPage';
import OnlineMatch from './Navigation/play/online/OnlineMatch';
import EngineMatch from './Navigation/play/engine/EngineMatch';

export default function MainRoute(){

    const router = createBrowserRouter([
      {
        path: "/",
        element: <RootNavigation></RootNavigation>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
          {
            path: "",
            element: <h1>All Dashboard Related Information</h1>
          },
          {
            path: "dashboard",
            element: <h1>All Dashboard Related Information</h1>
          },
          {
            path: "play",
            element: <Play/>
          },
          {
            path: "play/online",
            element: <OnlineMatch></OnlineMatch>
          },
          {
            path: "play/engine",
            element: <EngineMatch></EngineMatch>
          },
          {
            path: "analysis",
            element: <h1>Analysis</h1>
          },
          {
            path: "puzzle",
            element: <h1>Puzzle</h1>
          },
          {
            path: "logout",
            element: <h1>Get Out</h1>
          },
        ]
      },
    ]);

    return <RouterProvider router={router} />;

}
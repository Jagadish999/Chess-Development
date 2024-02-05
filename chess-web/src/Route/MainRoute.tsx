import RootNavigation from './RootNavigation';
import ErrorPage from '../ErrorPage';

import Play from '../FrontEndComponents/Play/Play';
import OnlineMatch from '../FrontEndComponents/Online/OnlineMatch';
import EngineMatch from '../FrontEndComponents/Engine/EngineMatch';
import Puzzle from '../FrontEndComponents/Puzzle/Puzzle';
import LoginForm from '../FrontEndComponents/LoginForm/LoginForm';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RegisterForm from '../FrontEndComponents/RegisterForm/RegisterForm';

export default function MainRoute() {

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
          element: <Play />
        },
        {
          path: "play/online",
          element: <OnlineMatch></OnlineMatch>
        },
        {
          path: "play/engine/:color",
          element: <EngineMatch></EngineMatch>
        },
        {
          path: "analysis",
          element: <h1>Analysis</h1>
        },
        {
          path: "puzzle",
          element: <Puzzle></Puzzle>
        },
        {
          path: "login-form",
          element: <LoginForm></LoginForm>
        },
        {
          path: "register-form",
          element: <RegisterForm></RegisterForm>
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
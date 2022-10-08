import { useRoutes } from "react-router-dom";

// 入口
import Title from './Entry/Title';
import SignIn from './Entry/SignIn';
import SignUp from './Entry/SignUp';

// 用户界面
import SuperAdmin from './Company/SuperAdmin';
// 工作区组件
import MainPage from './Company/MainPage';

// 根组件：配置路由
export default function App() {

    const element = useRoutes([
        {
            path: "/",
            element: <Title />,
        },
        {
            path: "/signIn",
            element: <SignIn />,
        },
        {
            path: "/signUp",
            element: <SignUp />,
        },
        {
            path: "/admin",
            element: <SuperAdmin />,
        }
    ]);

    return (
        <div>
            {element}
        </div>
      );
}


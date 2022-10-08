import { useRoutes } from "react-router-dom";

// ���
import Title from './Entry/Title';
import SignIn from './Entry/SignIn';
import SignUp from './Entry/SignUp';

// �û�����
import SuperAdmin from './Company/SuperAdmin';
// ���������
import MainPage from './Company/MainPage';

// �����������·��
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


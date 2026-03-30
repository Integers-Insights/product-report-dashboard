import { Navigate, Outlet } from "react-router-dom";

const PrivateComponent = () => {

    let isAuthenticated = localStorage.getItem("n@xIIktKQXeorj.W*XF5tFrKl");

    return (isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />);
};

export default PrivateComponent;

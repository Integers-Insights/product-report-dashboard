import { Navigate, Outlet } from "react-router-dom";

const PrivateComponent = () => {
  let authToken = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
  return authToken ? <Outlet /> : <Navigate to={"/login"} />;
};
export default PrivateComponent;

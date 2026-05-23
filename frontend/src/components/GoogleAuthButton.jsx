import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const GoogleAuthButton = () => {
  const navigate = useNavigate();

  const base_url = import.meta.env.VITE_BASE_URL;

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(`${base_url}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await response.json();
      // console.log("google: ", data);

      if (data?.success) {
        toast.success(data.message || "successful");
        localStorage.setItem("VZyHRIoNN3m)OXhGwCtC", data.access_token);
        localStorage.setItem("CtKoIC)iR1SP)5mr&R4d", JSON.stringify(data.user));
        navigate("/app");
      }
      if (data.detail) {
        toast.error(data?.detail);
      }
    } catch (error) {
      console.log("Something went wrong: ", error.message);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => {
        console.log("Google Login Failed");
      }}
    />
  );
};

export default GoogleAuthButton;

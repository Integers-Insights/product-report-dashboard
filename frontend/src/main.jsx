// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { HelmetProvider } from "react-helmet-async";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <HelmetProvider>
//       <App />
//     </HelmetProvider>
//   </StrictMode>,
// );




import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HelmetProvider } from "react-helmet-async";

import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <GoogleOAuthProvider clientId="186821146219-uat41cnd1031d7iouab3u7vmkck2bn5e.apps.googleusercontent.com">
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </GoogleOAuthProvider>
  // </StrictMode>,
);
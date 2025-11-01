import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./context/userContext.jsx";
import { AdminContextProvider } from "./context/adminContext.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
   
      <AdminContextProvider>
        <UserProvider>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <RouterProvider router={router}>
            <App />
          </RouterProvider>
        </UserProvider>
      </AdminContextProvider>
   
  </Provider>
);

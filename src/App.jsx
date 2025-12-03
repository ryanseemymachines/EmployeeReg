import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import store from "./redux/store";
import ProtectedRoute from "./components/ProtectedRoute";
import Spinner from "./components/Spinner";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const Auth = lazy(() => import("./pages/Auth"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const Home = lazy(() => import("./pages/Home"));
const EmployeeAddEdit = lazy(() => import("./pages/EmployeeAddEdit"));

const LazyFallback = () => {
  return <Spinner isVisible={true} />;
};

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Suspense fallback={<LazyFallback />}>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/employee/signup"
                element={
                  <ProtectedRoute>
                    <EmployeeAddEdit />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/employee/edit/:id"
                element={
                  <ProtectedRoute>
                    <EmployeeAddEdit />
                  </ProtectedRoute>
                }
              />

              <Route path="/users" element={<Auth />}>
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Register />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Provider>
      <ToastContainer position="top-center"
        autoClose={1500}/>
    </>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import store from "./redux/store";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProtectedRoute from "./components/UserProtectedRoute";
import SpinnerLazy from "./components/SpinnerLazy";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const Auth = lazy(() => import("./pages/Auth"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const Home = lazy(() => import("./pages/Home"));
const EmployeeAddEdit = lazy(() => import("./pages/EmployeeAddEdit"));

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <Suspense fallback={<SpinnerLazy />}>
                <Auth />
              </Suspense>
            }
          >
            <Route
              path="/login"
              element={
                <UserProtectedRoute>
                  <Login />
                </UserProtectedRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <UserProtectedRoute>
                  <Register />
                </UserProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Suspense fallback={<SpinnerLazy />}>
                  <Home />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/signup"
            element={
              <Suspense fallback={<SpinnerLazy />}>
                <ProtectedRoute>
                  <EmployeeAddEdit />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/employee/edit/:id"
            element={
              <ProtectedRoute>
                <Suspense fallback={<SpinnerLazy />}>
                  <EmployeeAddEdit />
                </Suspense>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-center" autoClose={1500} />
    </Provider>
  );
}

export default App;
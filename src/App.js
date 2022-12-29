import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import { AuthProvider } from "./contexts/Auth";
import PrivateRoute from "./components/Auth/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

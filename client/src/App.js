import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Dashboard from "./views/user/Dashboard";
import Profile from "./views/user/Profile";
import "./App.scss";

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/profile/:id" component={Profile} />
    </BrowserRouter>
  );
}

export default App;

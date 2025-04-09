import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom"; 
import Routes from "./routes"; 
import "./assets/css/bootstrap.css";
import "./assets/css/style.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap/dist/css/bootstrap.min.css";


ReactDOM.render(
  <BrowserRouter>
    <Routes />
  </BrowserRouter>,
  document.getElementById("root")
);
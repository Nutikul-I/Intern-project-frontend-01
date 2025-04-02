import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Loading from "./page/loading";
import Login from "./page/login";
import Console from "./page/console";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Loading />} />
      <Route path="/login" element={<Login />} />
      {/* Important: Use /* to allow nested routing inside Console */}
      <Route path="/console/*" element={<Console />} />
  </Routes>
);

export default AppRoutes;

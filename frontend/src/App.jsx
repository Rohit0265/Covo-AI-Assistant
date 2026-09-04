import React, { useEffect } from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import getCurrentUser from "./features/getCurrentUser";

const App = () => {
  useEffect(() => {
    getCurrentUser();
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

// export default App;
export default App
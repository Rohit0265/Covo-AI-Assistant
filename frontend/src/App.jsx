import React, { useEffect } from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import getCurrentUser from "./features/getCurrentUser";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";

const App = () => {

  const dispatch= useDispatch()

  useEffect(async () => {

    await getCurrentUser();
    dispatch(setUserData(data))

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
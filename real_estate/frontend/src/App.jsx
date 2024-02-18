import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import UserProfile from "./pages/UserProfile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateProfile from "./pages/CreateProfile";
import PorfilesList from "./pages/PorfilesList";
import MyFooter from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-w-full min-h-screen bg-[url(https://images.pexels.com/photos/13873241/pexels-photo-13873241.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)]"> 
      <Header></Header>
      <Routes>
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Home />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/viewProfiles" element={<PorfilesList />}></Route>
        </Route>
      </Routes>
      <MyFooter></MyFooter>
      </div>
    </BrowserRouter>
  );
}

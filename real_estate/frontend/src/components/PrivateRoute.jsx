import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  
  return currentUser ? (
    <Outlet />
  ) : (
    <Navigate to={"/sign-in"} />
  );
}

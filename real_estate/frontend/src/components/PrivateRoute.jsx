import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { validateToken } from "../redux/user/userSlice";

export default function PrivateRoute() {
  const { currentUser, isSubmitting, isAuthenticated} = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(validateToken());
  }, [dispatch]);
  
  if(isSubmitting) 
  return <div>Loading...</div>

  return (currentUser && isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={"/sign-in"} />
  ));
}

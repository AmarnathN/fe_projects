import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { validateToken } from "../redux/user/userSlice";
import { FaSpinner } from "react-icons/fa";

export default function PrivateRoute() {
  const { currentUser, isSubmitting, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(validateToken());
  }, [dispatch]);

  if (isSubmitting)
    return (
      <div className="flex flex-row justify-center m-10 p-10">
        <FaSpinner size={10}/>
      </div>
    );

  return currentUser && isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={"/sign-in"} />
  );
}

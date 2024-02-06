import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "@firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess,signInFailure } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const googleRes = await signInWithPopup(auth, provider);
      console.log(googleRes);

      const res = await fetch("/api/auth/signin_google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: googleRes.user.displayName,
          email: googleRes.user.email,
          photo: googleRes.user.photoURL,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
      return;
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-blue-500 text-white p-3 rounded-lg m-1"
    >
      Continue with Google
    </button>
  );
}

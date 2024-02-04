import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";

export default function Signin() {
  const [formData, setFormData] = useState({});
  const { error, isSubmitting} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent refreshing the page
    console.log(formData);
    dispatch(signInStart());

    try {
      if (formData.username.length < 1) {
        dispatch(signInFailure("Username is required"));
        return;
      }
      if (formData.password.length < 1) {
        dispatch(signInFailure("Password is required"));
        return;
      }

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
      console.log(data);
    } catch (err) {
      dispatch(signInSuccess(err.message));
      return;
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-10">Sign In</h1>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg m-1"
          id="username"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg m-1"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={isSubmitting}
          className="bg-slate-700 text-white p-3 rounded-lg m-1 uppercase"
        >
          {isSubmitting ? "Logging..." : "Sign In"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-2">
        <p>Do not have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-500"> Sign Up </span>
        </Link>
      </div>
      {(error === null || error.length > 1 )&& <p className="text-red-500">{error}</p>}
    </div>
  );
}

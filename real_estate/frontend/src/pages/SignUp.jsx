import React from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-10">SignUp</h1>
      <form className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg m-1"
          id="username"
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg m-1"
          id="email"
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg m-1"
          id="password"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg m-1 uppercase">
          Sign Up
        </button>
      </form>
      <div className="flex gap-2 mt-2">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-500"> Sign in </span>
        </Link>
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";

export default function Signin() {
  return (
    <>
      <div>Signin</div>
      
      <Link to={"/sign-up"}>
        <span class="text-blue-600">Sign Up</span>
      </Link>
    </>
  );
}

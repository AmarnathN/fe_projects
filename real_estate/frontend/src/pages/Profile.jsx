import React from "react";
import { useSelector } from "react-redux";


export default function Profile() {
  const currentUser = useSelector((state) => state.user.currentUser);
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-center text-4xl font-bold m-10">Profile</h1>
      <form className="flex flex-col gap-5 ">
        <img src={currentUser.avatar} alt="profile_pic" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center m-2"/>
        <input type="text" placeholder={currentUser.username} className="border p-2 rounded-lg "></input>
        <input type="email" placeholder={currentUser.email} className="border p-2 rounded-lg "></input>
        <input type="password" placeholder={"change password"} className="border p-2 rounded-lg "></input>
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-15">Update</button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-center block text-blue-400" >Delete Account</span>
        <span className="text-center block text-red-500">Sign Out</span>
      </div>
    </div>
  );
}

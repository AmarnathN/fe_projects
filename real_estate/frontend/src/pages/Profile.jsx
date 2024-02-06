import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import moment from "moment";

export default function Profile() {
  const fileRef = useRef(null);
  const currentUser = useSelector((state) => state.user.currentUser);

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName =
      moment(new Date().getDate()).format("YYYYMMDDHHmmss") + file.name;
    const storageRef = ref(storage, `profile_avatars/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleFile = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
    return;
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-center text-4xl font-bold m-10">Profile</h1>
      <form className="flex flex-col gap-5 ">
        <input
          type="file"
          ref={fileRef}
          className="border p-2 rounded-lg"
          hidden
          accept="image/*"
          onChange={handleFile}
        ></input>

        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile_pic"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center m-2"
        />
        {fileUploadError ? (
          <span className="text-center block text-red-400">
            {"Upload failed, please try again"}
          </span>
        ) : progress > 0 && progress < 100 ? (
          <span className="text-center block text-blue-400">
            {"Upload is " + progress + "% done"}
          </span>
        ) : progress === 100 ? (
          <span className="text-center block text-green-400">
            {"Upload is complete"}
          </span>
        ) : null}
        <input
          type="text"
          placeholder={currentUser.username}
          className="border p-2 rounded-lg "
        ></input>
        <input
          type="email"
          placeholder={currentUser.email}
          className="border p-2 rounded-lg "
        ></input>
        <input
          type="password"
          placeholder={"change password"}
          className="border p-2 rounded-lg "
        ></input>
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-15">
          Update
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-center block text-blue-400">Delete Account</span>
        <span className="text-center block text-red-500">Sign Out</span>
      </div>
    </div>
  );
}

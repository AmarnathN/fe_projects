import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import moment from "moment";

import {
  updateUserAtStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserAtStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutAtStart,
  signOutSuccess,
  signOutFailure,
} from "../redux/user/userSlice.js";

export default function UserProfile() {
  const fileRef = useRef(null);
  const { currentUser, error, isSubmitting } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName =
      moment(new Date().getDate()).format("YYYYMMDDHHmmss") + file.name;
    const storageRef = ref(storage, `use_profile_avatars/${fileName}`);
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
  console.log(formData);

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.placeholder]: e.target.value });
    return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserAtStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      return;
    } catch (error) {
      dispatch(updateUserFailure(error));
      return;
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    dispatch(deleteUserAtStart());
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(null));
      return;
    } catch (error) {
      dispatch(deleteUserFailure(error));
      return;
    }
  };

  const handleFile = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
    return;
  };

  return (
    <>
      {currentUser && currentUser._id ? (
        <div className="max-w-lg mx-auto">
          <h1 className="text-center text-4xl font-bold m-10">My Account</h1>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
              placeholder="username"
              defaultValue={currentUser.username}
              className="border p-2 rounded-lg "
              id="username"
              disabled
            ></input>
            <input
              type="email"
              placeholder="email"
              defaultValue={currentUser.email}
              className="border p-2 rounded-lg "
              id="email"
              onChange={handleChange}
            ></input>
            <input
              type="password"
              placeholder={"change password"}
              className="border p-2 rounded-lg "
              id="password"
              onChange={handleChange}
            ></input>
            <button
              disabled={isSubmitting}
              className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-15"
            >
              {isSubmitting ? "Updating" : "Update"}
            </button>
          </form>
          <div className="flex justify-center mt-5">
            <span
              className="text-center block text-blue-400 cursor-pointer hover:underline"
              onClick={handleDeleteUser}
            >
              Delete Account
            </span>
          </div>
          {error && (
            <span className="text-red-500 text-center block">
              Error: {error}
            </span>
          )}
          {updateSuccess && (
            <span className="text-green-500 text-center block">
              Profile updated successfully
            </span>
          )}
        </div>
      ) : null}
    </>
  );
}

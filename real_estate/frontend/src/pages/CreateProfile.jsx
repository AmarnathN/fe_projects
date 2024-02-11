import React from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import moment from "moment";
import {
  ASSETS_ENUM,
  EDUCATION_ENUM,
  PROFESSION_ENUM,
  INCOME_ENUM,
  MARITAL_STATUS_ENUM,
} from "../../config/enums.config";

export default function CreateProfile() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "male",
    phoneNumber: "",
    dob: "",
    age: "",
    bio: "",
    profilePictures: [],
    profession: "",
    assets: [],
    maritalStatus: "",
    education: "",
    income: "",
    height: {
      feet: "5",
      inches: "1",
    },
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [profileUploading, setProfileUploading] = useState(false);
  const [profileUploadError, setProfileUploadError] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    let images = [];
    for (let i = 0; i < e.target.files.length; i++) {
      images.push(e.target.files[i]);
    }
    setImageFiles(images);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (imageFiles.length == 0) {
        setProfileUploadError("Please upload atleast one image");
        return;
      } else if (imageFiles.length > 6) {
        setProfileUploadError("You can only upload 6 images at a time.");
        return;
      } else {
        setProfileUploading(true);
        const promises = [];
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];

          promises.push(uploadImage(file));
        }
        Promise.all(promises)
          .then( async (urls) => {
            formData.profilePictures = urls;
            const res = await fetch(`/api/profile/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            });
            const data = await res.json();
      
            setProfileUploading(false);
            if (data.success === false) {
              setProfileUploadError(data.message);
              return;
            }
      
            navigate(`/profile/${data._id}`);
            return;
          })
          .catch((error) => {
            setProfileUploadError(error.message);
            setProfileUploading(false);
          });
      }
    } catch (error) {
      setProfileUploadError(error);
      setProfileUploading(false);
      return;
    }
  };

  const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName =
        moment(new Date().getDate()).format("YYYYMMDDHHmmss") + file.name;
      const storageRef = ref(storage, `profile_images/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  console.log(formData);
  console.log(imageFiles);

  const handleChange = (e) => {
    switch (e.target.id) {
      case "car":
      case "house":
      case "land":
      case "other":
        let assets = formData.assets;
        if (!assets.includes(e.target.id)) {
          assets.push(e.target.id);
        } else {
          assets = assets.filter((asset) => asset != e.target.id);
        }
        setFormData({ ...formData, assets: assets });
        return;
      case "feet":
        setFormData({
          ...formData,
          height: { inches: formData.height.inches, feet: e.target.value },
        });
        return;
      case "inches":
        setFormData({
          ...formData,
          height: { feet: formData.height.feet, inches: e.target.value },
        });
        return;
      case "female":
      case "male":
        setFormData({ ...formData, gender: e.target.id });
        return;
      default:
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phoneNumber: value });
  };

  return (
    <main className="mx-auto m-4 p-3 max-w-4xl bg-white rounded overflow-hidden shadow-2xl">
      <h1 className="text-3xl text-center font-extrabold m-8">
        Create Profile
      </h1>
      <form
        className="flex flex-col p-5 sm:flex-row m-5 bg-gray-200 rounded justify-between shadow-xl"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col sm:w-2/3">
          <div className="flex flex-col justify-center sm:flex-row sm:justify-between m-2">
            <div className="flex flex-col sm:w-1/2 flex-grow">
              <span className="mx-4">First Name</span>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First Name"
                className="mx-4 p-2 border-2 border-gray-300 rounded-md "
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col sm:w-1/2 flex-grow">
              <span className="mx-4">Last Name</span>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Last Name"
                className="mx-4 p-2 border-2 border-gray-300 rounded-md"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row max-s:flex-col justify-betwen m-2">
            <div className="flex flex-col sm:w-1/2 flex-grow">
              <span className="mx-4">Email</span>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Email"
                className="mx-4 p-2 border-2 border-gray-300 rounded-md flex-grow"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col sm:w-1/2 flex-grow">
              <span className="mx-4">Phone</span>
              <PhoneInput
                type="select"
                id="phonenumber"
                name="phonenumber"
                placeholder="phonenumber"
                className="mx-4 p-2 border-2 border-gray-300 rounded-md flex-grow"
                onChange={handlePhoneChange}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row justify-center m-2">
            <div className="flex flex-row justify-start m-2">
              <div class="flex m-4">
                <input
                  checked={formData.gender === "male"}
                  id="male"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                  onChange={handleChange}
                />
                <label class="mx-2 text-sm font-medium">Male</label>
              </div>
              <div class="flex m-4">
                <input
                  checked={formData.gender === "female"}
                  id="female"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                  onChange={handleChange}
                />
                <label class="mx-2 text-sm">Female</label>
              </div>
            </div>
            <div className="flex flex-row justify-start m-2">
              <div className="flex mx-2 flex-col">
                <label
                  htmlFor="feet"
                  className="block text-sm font-medium text-gray-700"
                >
                  Height (Ft)
                </label>
                <input
                  type="range"
                  id="feet"
                  name="feet"
                  min="4"
                  max="7"
                  step="1"
                  value={formData.height.feet}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <span className="block text-center text-sm text-gray-700">
                  {formData.height.feet} feet
                </span>
              </div>
              <div className="flex mx-2 flex-col">
                <label
                  htmlFor="inches"
                  className="block text-sm font-medium text-gray-700"
                >
                  Height (In)
                </label>
                <input
                  type="range"
                  id="inches"
                  name="inches"
                  min="0"
                  max="11"
                  step="1"
                  value={formData.height.inches}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <span className="block text-center text-sm text-gray-700">
                  {formData.height.inches} inches
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:gap-0  sm:flex-row justify-between m-2">
            <div className="flex flex-col sm:w-1/3 flex-grow">
              <span className="mx-4">Date of Birth</span>
              <input
                type="date"
                id="dob"
                className="mx-4 p-2 border-2 border-gray-300 rounded-md"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col sm:w-1/3 flex-grow">
              <span className="mx-4">Age</span>
              <input
                type="number"
                id="age"
                placeholder="enter age"
                className="mx-4 p-2 border-2 border-gray-300 rounded-md "
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col sm:w-1/3  flex-grow">
              <label class="mx-4">Education</label>
              <select
                id="education"
                name="education"
                class="mx-4 p-2 rounded-md border-2 text-sm border-gray-300 shadow-sm "
                onChange={handleChange}
              >
                <option disabled selected value="">
                  Select an option
                </option>
                {EDUCATION_ENUM.map((education) => {
                  return (
                    <option>
                      <span className="text-sm">{education}</span>
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row justify-between m-2">
            <div className="flex flex-col sm:w-1/3 flex-grow">
              <label class="mx-4">Profession</label>
              <select
                id="profession"
                name="profession"
                class="mx-4 p-2 rounded-md border-2 text-sm border-gray-300 shadow-sm "
                onChange={handleChange}
              >
                <option disabled selected value="">
                  Select an option
                </option>
                {PROFESSION_ENUM.map((profession) => {
                  return (
                    <option>
                      <span className="text-sm">{profession}</span>
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col sm:w-1/3  flex-grow">
              <label class="mx-4 text-nowrap overflow-hidden hover:overflow-visible hover:shadow-md hover:opacity-50">
                Martital Status
              </label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                class="mx-4 p-2 rounded-md border-2 text-sm border-gray-300 shadow-sm "
                onChange={handleChange}
              >
                <option disabled selected value="">
                  Select an option
                </option>
                {MARITAL_STATUS_ENUM.map((ms) => {
                  return (
                    <option>
                      <span className="text-sm">{ms}</span>
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col sm:w-1/3  flex-grow">
              <label class="mx-4 ">Income(PA)</label>
              <select
                id="income"
                name="income"
                class="mx-4 p-2 rounded-md border-2 text-sm border-gray-300 shadow-sm "
                onChange={handleChange}
              >
                <option disabled selected value="">
                  Select an option
                </option>
                {INCOME_ENUM.map((income) => {
                  return (
                    <option>
                      <span className="text-sm">{income}</span>
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:gap-0  justify-between m-2">
            <label class="mx-4">Assets</label>
            <div className=" mx-4 border-2 border-gray-300 rounded">
              <div className="flex flex-row flex-wrap justify-start m-2">
                {ASSETS_ENUM.map((asset) => {
                  return (
                    <div class="flex mx-4">
                      <input
                        checked={formData.assets.includes(asset)}
                        id={asset}
                        type="checkbox"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                        onChange={handleChange}
                      />
                      <label class="mx-2 text-sm">{asset}</label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex m-2 grow">
            <div className="flex flex-col flex-grow">
              <span className="mx-4">About</span>
              <textarea
                id="bio"
                placeholder="write more details ..."
                className="mx-4 h-100 p-2 border-2 border-gray-300 rounded-md grow w-full"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-col grow m-4">
            <span className="mx-4">
              <b>Images : </b>
              <span className="text-sm">
                first one will be profile pic
              </span>{" "}
            </span>
            <input
              type="file"
              id="image"
              className="mx-4 p-2 mr:4 border-2 border-gray-300 rounded-md w-full"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            <div className="flex flex-row flex-wrap">
              {imageFiles.map((image, index) => {
                var url = URL.createObjectURL(image);
                return (
                  <div className="flex flex-row" key={`profile_pic_${index}`}>
                    <img
                      src={url}
                      alt={`profile_pic_${index}`}
                      className="rounded-full h-14 w-14 object-cover cursor-pointer self-center m-2"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex">
            <button className="bg-blue-950 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-full m-4 grow">
              {profileUploading ? "Uploading" : "Upload Profile"}
            </button>
          </div>
        </div>
      </form>
      <span className="text-red-400 text-center block">{
        
      profileUploadError.toString()
      }</span>
    </main>
  );
}

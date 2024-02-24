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
import { app } from "../../firebase";
import moment from "moment";
import {
  ASSETS_ENUM,
  EDUCATION_ENUM,
  PROFESSION_ENUM,
  INCOME_ENUM,
  MARITAL_STATUS_ENUM,
  GENDER_ENUM,
} from "../../../config/enums.config";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../shadcn/components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
} from "../shadcn/components/ui/radio-group";
import { Label } from "../shadcn/components/ui/label";
import { Slider } from "../shadcn/components/ui/slider";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../shadcn/components/ui/popover";
import { FaCalendar } from "react-icons/fa";
import { Calendar } from "../shadcn/components/ui/calendar";
import { Button } from "../shadcn/components/ui/button";
import { cn } from "../shadcn/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn/components/ui/select";
import { Textarea } from "../shadcn/components/ui/textarea";
import { Separator } from "../shadcn/components/ui/separator";

const formSchema = z.object({
  firstName: z.string().min(1),
});

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

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    },
  });

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
          .then(async (urls) => {
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

  const handleChange = (e) => {
    console.log(e.target);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAssetsChnage = (e) => {
    let assets = formData.assets;
    if (!assets.includes(e.target.value)) {
      assets.push(e.target.value);
    } else {
      assets = assets.filter((asset) => asset != e.target.value);
    }
    setFormData({ ...formData, assets });
  };

  const handleEducationChange = (education) => {
    setFormData({ ...formData, education });
  };

  const handleProfessionChange = (profession) => {
    setFormData({ ...formData, profession });
  };

  const handleIncomeChange = (income) => {
    setFormData({ ...formData, income });
  };

  const handleMaritalStatusChange = (maritalStatus) => {
    setFormData({ ...formData, maritalStatus });
  };

  const handleFeetChange = (value) => {
    setFormData({
      ...formData,
      height: { ...formData.height, feet: value[0] },
    });
  };

  const handleInchesChange = (value) => {
    setFormData({
      ...formData,
      height: { ...formData.height, inches: value[0] },
    });
  };

  const handleDobChange = (dob) => {
    setFormData({ ...formData, dob });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phoneNumber: value });
  };

  return (
    <Form className="mx-auto p-3 max-w-6xl items-center" {...form} >
      <form className="flex flex-col p-5 sm:flex-row m-5  rounded justify-between shadow-xl">
        <div className="flex flex-col sm:w-2/3 border-r-2 p-2 ">
          <div className="flex flex-col justify-center sm:flex-row sm:justify-between my-2">
            <div className="flex flex-col sm:w-1/2 flex-grow mx-2">
              <FormField
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="First Name"
                        id="firstName"
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormDescription>{}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col sm:w-1/2 flex-grow mx-2">
              <FormField
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Last Name"
                        id="lastName"
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormDescription>{}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center sm:flex-row sm:justify-betwen my-2">
            <div className="flex flex-col sm:w-1/2 flex-grow mx-2">
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email"
                        id="email"
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormDescription>{}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col sm:w-1/2 flex-grow mx-2">
              <FormField
                name="phonenumber"
                id="phonenumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        type="select"
                        id="phonenumber"
                        placeholder="phonenumber"
                        className="p-2 border-2 rounded-md"
                        onChange={handlePhoneChange}
                      />
                    </FormControl>
                    <FormDescription>{}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row justify-between m-2">
            <RadioGroup
              defaultValue={formData.gender === "male"}
              className="flex flex-row m-2 gap-2 justify-start flex-grow"
            >
              {GENDER_ENUM.map((gender) => {
                return (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={gender}
                      id={"gender"}
                      checked={formData.gender === gender}
                      onClick={handleChange}
                    />
                    <Label htmlFor={gender}>{gender}</Label>
                  </div>
                );
              })}
            </RadioGroup>
            <div className="flex flex-row justify-startn m-2 flex-grow">
              <div className="flex mx-2 flex-col gap-2">
                <FormField
                  name="heightFeet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (Ft)</FormLabel>
                      <FormControl>
                        <Slider
                          id="heightFeet"
                          onValueChange={handleFeetChange}
                          defaultValue={[formData.height.feet]}
                          max={7}
                          step={1}
                          min={4}
                          className="mt-1 w-full rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className="text-center text-sm">
                  {formData.height.feet} feet
                </span>
              </div>
              <div className="flex mx-2 flex-col gap-2">
                <FormField
                  name="heightInches"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (In)</FormLabel>
                      <FormControl>
                        <Slider
                          id="heightInches"
                          onValueChange={handleInchesChange}
                          defaultValue={[formData.height.inches]}
                          max={7}
                          step={1}
                          min={4}
                          className="mt-1 w-full rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-center text-sm">
                  {formData.height.inches} inches
                </p>
              </div>
            </div>
          </div>
          <Separator />
          <div className="grid grid-col-1 sm:grid-cols-3 m-2 gap-4">
            <div className="grid grid-cols-1 gap-2 ">
              <FormField
                onChange={handleChange}
                name="dob"
                id="dob"
                className="w-1/3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.dob && "text-muted-foreground"
                            )}
                          >
                            <FaCalendar className="mr-2 h-4 w-4" />
                            {formData.dob ? (
                              moment(formData.dob).format("YYYY/MM/DD")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={formData.dob}
                            onSelect={handleDobChange}
                            initialFocus
                            {...field}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-2 ">
              <FormField
                name="age"
                id="age"
                className="w-1/3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input placeholder="age"  id="age" onChange={handleChange} />
                    </FormControl>
                    <FormDescription>{}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-2 ">
              <FormField
                onChange={handleChange}
                name="education"
                id="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={handleEducationChange}
                        defaultValue={formData.education}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Education" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {EDUCATION_ENUM.map((education) => {
                              return (
                                <SelectItem value={education}>
                                  {education}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>{}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-col-1 sm:grid-cols-3 m-2 gap-4">
            <div className="grid grid-cols-1 gap-2 ">
              <Label htmlFor="area">Profession</Label>
              <Select
                onValueChange={handleProfessionChange}
                defaultValue={formData.profession}
                className={cn("w-[200px] appearance-none font-normal")}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder="Select profession"
                    className="overflow-hidden"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PROFESSION_ENUM.map((profession) => {
                      return (
                        <SelectItem value={profession}>{profession}</SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label>Marital Status</Label>
              <Select
                onValueChange={handleMaritalStatusChange}
                defaultValue={formData.maritalStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select maritalStatus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {MARITAL_STATUS_ENUM.map((maritalStatus) => {
                      return (
                        <SelectItem value={maritalStatus}>
                          {maritalStatus}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label>Income</Label>
              <Select
                onValueChange={handleIncomeChange}
                defaultValue={formData.profession}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select income range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {INCOME_ENUM.map((income) => {
                      return <SelectItem value={income}>{income}</SelectItem>;
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator />
          <div className="grid col-span-1 sm:col-span-3 m-2 gap-4">
            <div className="grid grid-cols-1 gap-2  ">
              <Label class="text-sm font-medium">Assets</Label>
              <div className="border-2 rounded">
                <div className="flex flex-row flex-wrap justify-start m-1">
                  {ASSETS_ENUM.map((asset) => {
                    return (
                      <div class="flex items-center mx-4">
                        <Input
                          id={asset}
                          type="checkbox"
                          class="w-4 h-4 rounded border-2 border-gray-300"
                          onClick={handleAssetsChnage}
                          value={asset}
                        />
                        <Label class="mx-2 text-sm">{asset}</Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-start p-2">
          <div className="flex flex-col flex-grow">
            <FormField
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Bio..."
                      id="bio"
                      onChange={handleChange}
                      className="resize-y"
                    />
                  </FormControl>
                  <FormDescription>{}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col grow">
            <Label className="my-4">
              <b>Add Images : </b>
              <i className="text-sm text-muted-foreground">
                first one will be profile pic ..
              </i>{" "}
            </Label>
            <Input
              type="file"
              id="image"
              className="mx-2 p-2 mr:4 border-2 rounded-md w-full"
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
            <Button
              className="font-bold py-2 px-4 rounded-full m-4 grow"
              onClick={handleSubmit}
            >
              {profileUploading ? "Uploading" : "Upload Profile"}
            </Button>
          </div>
        </div>
      </form>
      <span className="text-red-400 text-center block">
        {profileUploadError.toString()}
      </span>
    </Form>
  );
}

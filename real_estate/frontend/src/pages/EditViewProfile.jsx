import React from "react";
import "react-phone-number-input/style.css";
import { useParams } from "react-router";
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
  GENDER_ENUM,
} from "../../config/enums.config";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/shadcn/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../components/shadcn/components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
} from "../components/shadcn/components/ui/radio-group";
import { Label } from "../components/shadcn/components/ui/label";
import { Slider } from "../components/shadcn/components/ui/slider";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/shadcn/components/ui/popover";
import { FaCalendar } from "react-icons/fa";
import { Calendar } from "../components/shadcn/components/ui/calendar";
import { Button } from "../components/shadcn/components/ui/button";
import { cn } from "../components/shadcn/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/shadcn/components/ui/select";
import { Textarea } from "../components/shadcn/components/ui/textarea";
import { Separator } from "../components/shadcn/components/ui/separator";
import { Switch } from "../components/shadcn/components/ui/switch";
import { Card } from "flowbite-react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  Autoplay,
  EffectFade,
} from "swiper/modules";
import "swiper/css";

import "swiper/css/bundle";

export default function EditViewProfile({ props }) {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
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
      feet: "",
      inches: "",
    },
  });
  const [enableEdit, setEnableEdit] = useState(false);
  const [imageFiles, setImageFiles] = useState();
  const [profileUploading, setProfileUploading] = useState(false);
  const [profileUploadError, setProfileUploadError] = useState("");
  const navigate = useNavigate();

  const formSchema = z.object({});

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log(props);
        const res = await fetch(`/api/profile/get/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log(data);
        if (data.success === false) {
          setProfileUploadError(data.message);
          return;
        }
        setFormData(data);
      } catch (error) {
        setProfileUploadError(error);
      }
    };
    fetchProfile();
  }, []);

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
            const res = await fetch(`/api/profile/update/${id}`, {
              method: "PUT",
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
    <div className="flex justify-center mx-auto items-center">
      <Card className="m-4 p-3 w-[90vw] gap-2 bg-background opacity-95">
        <Form
          className="flex flex-col mx-auto p-3 max-w-6xl items-center gap-2"
          {...form}
        >
          <div className="flex flex-row justify-center m-4 p-4 gap-2 w-full">
            <Swiper
              modules={[
                Navigation,
                Pagination,
                Scrollbar,
                Autoplay,
                EffectFade,
              ]}
              spaceBetween={20}
              slidesPerView={1}
              effect="fade"
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              className="h-[50vh] rounded-lg shadow-xl"
            >
              {formData.profilePictures.map((picture, index) => {
                return (
                  <SwiperSlide key={`profile_pic_${index}`} 
                  className="flex flex-row justify-center items-center w-full h-[50vh] rounded-lg shadow-xl"
                  >
                    <img
                      src={picture}
                      alt="profile"
                      className="w-[50vw] h-[50vh] rounded-lg border-2"
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          <div className="flex flex-row justify-end m-4 gap-2">
            <Switch onCheckedChange={() => setEnableEdit(!enableEdit)} />
            <Label className="text-lg font-bold"> Edit Profile </Label>
          </div>
          <form className="flex flex-col p-5 sm:flex-row m-5 rounded justify-between shadow-xl">
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
                            defaultValue={formData.firstName}
                            id="firstName"
                            onChange={handleChange}
                            disabled={!enableEdit}
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
                            defaultValue={formData.lastName}
                            id="lastName"
                            onChange={handleChange}
                            disabled={!enableEdit}
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
                            defaultValue={formData.email}
                            id="email"
                            onChange={handleChange}
                            disabled={!enableEdit}
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
                    render={() => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            defaultValue={formData.phoneNumber}
                            id="phonenumber"
                            onChange={handlePhoneChange}
                            disabled={!enableEdit}
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
                  defaultValue={formData.gender}
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
                          disabled={!enableEdit}
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
                              disabled={!enableEdit}
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
                              disabled={!enableEdit}
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
                                disabled={!enableEdit}
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
                                disabled={!enableEdit}
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
                          <Input
                            defaultValue={formData.age}
                            id="age"
                            onChange={handleChange}
                            disabled={!enableEdit}
                          />
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
                            disabled={!enableEdit}
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
                    disabled={!enableEdit}
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
                            <SelectItem value={profession}>
                              {profession}
                            </SelectItem>
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
                    disabled={!enableEdit}
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
                    defaultValue={formData.income}
                    disabled={!enableEdit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {INCOME_ENUM.map((income) => {
                          return (
                            <SelectItem value={income}>{income}</SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="grid col-span-1 sm:col-span-3 m-2 gap-4">
                <div className="grid grid-cols-1 gap-2  ">
                  <Label className="text-sm font-medium">Assets</Label>
                  <div className="border-2 rounded">
                    <div className="flex flex-row flex-wrap justify-start m-1">
                      {ASSETS_ENUM.map((asset) => {
                        return (
                          <div className="flex items-center mx-4">
                            <Input
                              id={asset}
                              type="checkbox"
                              className="w-4 h-4 rounded border-2 border-gray-300"
                              onClick={handleAssetsChnage}
                              value={asset}
                              checked={formData.assets.includes(asset)}
                              disabled={!enableEdit}
                            />
                            <Label className="mx-2 text-sm">{asset}</Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:w-1/3 justify-start p-2">
              <div className="w-full flex-grow">
                <FormField
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About</FormLabel>
                      <FormControl>
                        <Textarea
                          defaultValue={formData.bio}
                          id="bio"
                          onChange={handleChange}
                          className="resize-y h-[20vh]"
                          disabled={!enableEdit}
                        />
                      </FormControl>
                      <FormDescription>{}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {enableEdit && (
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
                    disabled={!enableEdit}
                  />
                  <div className="flex flex-row flex-wrap">
                    {imageFiles
                      ? imageFiles.map((image, index) => {
                          var url = URL.createObjectURL(image);
                          return (
                            <div
                              className="flex flex-row"
                              key={`profile_pic_${index}`}
                            >
                              <img
                                src={url}
                                alt={`profile_pic_${index}`}
                                className="rounded-full h-14 w-14 object-cover cursor-pointer self-center m-2"
                              />
                            </div>
                          );
                        })
                      : formData.profilePictures.map((picture, index) => {
                          return (
                            <div
                              className="flex flex-row"
                              key={`profile_pic_${index}`}
                            >
                              <img
                                src={picture}
                                alt={`profile_pic_${index}`}
                                className="rounded-full h-14 w-14 object-cover cursor-pointer self-center m-2"
                              />
                            </div>
                          );
                        })}
                  </div>
                </div>
              )}
              {enableEdit && (
                <div className="flex">
                  <Button
                    disabled={!enableEdit}
                    className="font-bold py-2 px-4 rounded-full m-4 grow"
                    onClick={handleSubmit}
                  >
                    {profileUploading ? "Uploading" : "Update Profile"}
                  </Button>
                </div>
              )}
            </div>
          </form>
          <span className="text-red-400 text-center block">
            {profileUploadError.toString()}
          </span>
        </Form>
      </Card>
    </div>
  );
}

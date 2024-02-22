import { useEffect, useState } from "react";
import CardPlaceHolder from "../components/core/placeholders/card.placeholder.jsx";
import { Button } from "../components/shadcn/components/ui/button.jsx";
import { useNavigate } from "react-router-dom";
import { Separator } from "../components/shadcn/components/ui/separator.jsx";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/shadcn/components/ui/accordion.jsx";
import { ASSETS_ENUM, PROFESSION_ENUM } from "../../config/enums.config.js";
import { Checkbox } from "../components/shadcn/components/ui/checkbox.jsx";
import DataTable from "../components/shadcn/components/ui/data-table.jsx";
import {
  ScrollArea,
  ScrollBar,
} from "../components/shadcn/components/ui/scroll-area.jsx";
import { Card } from "../components/shadcn/components/ui/card.jsx";
import { FaEdit } from "react-icons/fa";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/shadcn/components/ui/dialog.jsx";
import { Input } from "../components/shadcn/components/ui/input.jsx";
import { Label } from "../components/shadcn/components/ui/label.jsx";
import CreateProfile from "./CreateProfile.jsx";

export default function PorfilesList() {
  const [profiles, setProfiles] = useState([]);
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    profession: [],
    assets: [],
    education: [],
    maritalStatus: [],
    income: [],
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    switch (e.target.id) {
      case "car":
      case "house":
      case "land":
      case "other":
        let assets = filters.assets;
        if (!assets.includes(e.target.id)) {
          assets.push(e.target.id);
        } else {
          assets = assets.filter((asset) => asset != e.target.id);
        }
        setFilters({ ...filters, assets: assets });
        return;
      case "feet":
        setFilters({
          ...filters,
          height: { inches: filters.height.inches, feet: e.target.value },
        });
        return;
      case "inches":
        setFilters({
          ...filters,
          height: { feet: filters.height.feet, inches: e.target.value },
        });
        return;
      case "female":
      case "male":
        setFilters({ ...filters, gender: e.target.id });
        return;
      default:
        setFilters({ ...filters, [e.target.id]: e.target.value });
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      setProfilesLoading(true);
      try {
        const res = await fetch("/api/profile/get_profiles", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.success === false && data.statusCode === 403) {
          setError(data.message);
          navigate("/sign-in");
          return;
        } else if (data.success === false) {
          setError(data.message);
        }

        console.log(data);
        setProfiles(data);
        setProfilesLoading(false);
      } catch (err) {
        console.log(err);
        setProfilesLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  return (
    <div className="flex items-center justify-center border-2 opacity-90">
      <section className="flex z-30 flex-row justify-center m-4 h-lvh  flex-grow">
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl opacity-90 sm:min-w-full ">
          <div className="flex flex-col">
            <div className="flex flex-row justify-end m-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">Create Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl max-h-screen">
                  <DialogHeader>
                    <DialogTitle>Create profile</DialogTitle>
                    <DialogDescription>
                      Create your profile here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>

                  <ScrollArea className="rounded-md border max-h-lvh overflow-scroll">
                    <CreateProfile />
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
            <Separator />

            <div className="grid grid-cols-1  md:grid-cols-4 gap-6">
              <section>
                <div className="flex flex-col p-4 m-2 sm:max-w-2xl rounded-lg shadow-xl">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="filters">
                      <AccordionTrigger>Filters</AccordionTrigger>
                      <AccordionContent>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="profession">
                            <AccordionTrigger>Profession</AccordionTrigger>
                            <AccordionContent>
                              <div className="flex flex-row flex-wrap justify-start m-2">
                                {PROFESSION_ENUM.map((profession) => {
                                  return (
                                    <div className="flex items-center mx-4 ">
                                      <Checkbox
                                        id={profession}
                                        onChange={handleChange}
                                        checked={filters.profession.includes(
                                          profession
                                        )}
                                      />
                                      <label
                                        htmlFor={profession}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed p-2 peer-disabled:opacity-70"
                                      >
                                        {profession}
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="assets">
                            <AccordionTrigger>Assets</AccordionTrigger>
                            <AccordionContent>
                              <div className="flex flex-row flex-wrap justify-start m-2">
                                {ASSETS_ENUM.map((asset) => {
                                  return (
                                    <div className="flex items-center mx-4 ">
                                      <Checkbox
                                        id={asset}
                                        onChange={handleChange}
                                        checked={filters.assets.includes(asset)}
                                      />
                                      <label
                                        htmlFor={asset}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed p-2 peer-disabled:opacity-70"
                                      >
                                        {asset}
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </section>
              <section className="sm:col-span-2 md:col-span-3 items-start">
                <ScrollArea className="rounded-md border max-h-dvh overflow-scroll">
                  <div className="grid grid-cols-1 xl:grid-cols-2 m-4 ">
                    {profilesLoading && (
                      <div className="flex flex-col fle-grow m-2 sm:max-w-2xl  rounded-lg shadow-xl">
                        {[...Array(6).keys()].map((_, i) => (
                          <CardPlaceHolder />
                        ))}
                      </div>
                    )}
                    {[...profiles, ...profiles, ...profiles].map((profile) => (
                      <Card className="col-span-1 rounded-lg shadow-xl m-4 hover:scale-105 hover:shadow-md hover:shadow-primary-foreground opacity-100">
                        <div
                          key={profile._id}
                          className="flex flex-row  rounded-lg justify-between items-center"
                        >
                          {/* <Card className=""> */}
                          <img
                            src={profile.profilePictures[0]}
                            alt="profile"
                            className="w-1/3 h-[150px] rounded-lg object-cover border-4 border-primary-foreground "
                          />
                          {/* </Card> */}
                          <div className="flex flex-col items-center justify-between p-2 m-2 w-2/3 gap-2">
                            <div className="flex flex-row items-center justify-between w-full">
                              <p className="text-lg font-bold text-yellow-600">
                                {profile.firstName + " " + profile.lastName}
                              </p>
                              <p className="text-lg font-bold">
                                <FaEdit />
                              </p>
                            </div>
                            <div className="flex flex-row items-center justify-between w-full">
                              <p className="text-sm font-medium leading-none">
                                {profile.age} years
                              </p>
                            </div>
                            <Separator />
                            <div className="flex flex-row items-center justify-between w-full">
                              <div className="flex flex-col space-y-1 items-start">
                                <p className="text-sm text-muted-foreground">
                                  {"Profession"}
                                </p>
                                <p className="text-sm font-medium leading-none">
                                  {profile.profession.toUpperCase()}
                                </p>
                              </div>
                              <div className="flex flex-col space-y-1 items-end">
                                <p className="text-sm text-muted-foreground">
                                  {"Education"}
                                </p>
                                <p className="text-sm font-medium leading-none">
                                  {profile.education.toUpperCase()}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-row items-center justify-between w-full">
                              <div className="flex flex-col space-y-1 items-start">
                                <p className="text-sm text-muted-foreground">
                                  {"Marital Status"}
                                </p>
                                <p className="text-sm font-medium leading-none">
                                  {profile.maritalStatus.toUpperCase()}
                                </p>
                              </div>
                              <div className="flex flex-col space-y-1 items-end">
                                <p className="text-sm text-muted-foreground">
                                  {"Income"}
                                </p>
                                <p className="text-sm font-medium leading-none">
                                  {profile.income.toUpperCase()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </section>
            </div>
          </div>
        </div>
      </section>
      <section>{error && <p>Error loading profiles : {error}</p>}</section>
    </div>
  );
}

import React from 'react'


import { FaEdit } from "react-icons/fa";
import { Card } from '../shadcn/components/ui/card';
import { ScrollArea, ScrollBar } from '../shadcn/components/ui/scroll-area';
import { Separator } from '../shadcn/components/ui/separator';


export default function ProfileListCard({profile}) {
  return (
    <Card className="col-span-1 rounded-lg p-1 m-1 sm:m-4 sm:p-4 hover:scale-105 hover:shadow-xl hover:shadow-default opacity-100">
    <ScrollArea>

    
    <div
      key={profile._id}
      className="flex flex-row rounded-lg justify-between items-center"
    >
      {/* <Card className=""> */}
      <img
        src={profile.profilePictures[0]}
        loading="lazy"
        alt="profile"
        className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] rounded-lg object-cover border-4 border-primary-foreground bg-[url('../../assets/default_img.png')] "
      />
      {/* </Card> */}
      <div className="flex flex-col items-center justify-between p-2 m-2 w-2/3 gap-2">
        <div className="flex flex-row flex-wrap items-center justify-between w-full">
          <p className="text-lg font-bold text-primary">
            {profile.firstName + " " + profile.lastName}
          </p>
          <p className="text-lg font-bold">
            <FaEdit />
          </p>
        </div>
        <div className="flex flex-row items-center flex-wrap justify-between w-full">
          <p className="text-sm font-medium leading-none">
            {profile.age} years
          </p>
        </div>
        <Separator />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2">
          <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
            <p className="text-2sm text-muted-foreground">
              {"Profession"}
            </p>
            <p className="text-sm font-medium leading-none">
              {profile.profession.toUpperCase()}
            </p>
          </div>
          <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
            <p className="text-2sm text-muted-foreground">
              {"Education"}
            </p>
            <p className="text-sm font-medium leading-none">
              {profile.education.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2">
        <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
            <p className="flex text-2sm text-muted-foreground">
              {"Marital Status"}
            </p>
            <p className="flex text-sm font-medium leading-none">
              {profile.maritalStatus.toUpperCase()}
            </p>
          </div>
          <div className="w-full flex flex-row justify-between items-end gap-2  sm:flex-col sm:gap-0 sm:space-y-1  sm:items-start ">
            <p className="text-2sm text-muted-foreground">
              {"Income"}
            </p>
            <p className="text-sm font-medium leading-none">
              {profile.income.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
    <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </Card>
  )
}

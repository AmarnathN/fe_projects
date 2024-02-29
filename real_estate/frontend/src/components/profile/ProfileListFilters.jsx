import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../shadcn/components/ui/accordion";
import { Checkbox } from "../shadcn/components/ui/checkbox";
import { ASSETS_ENUM, PROFESSION_ENUM } from "../../../config/enums.config";
import { Button } from "../shadcn/components/ui/button";

export default function ProfileListFilters({
  filters,
  setFilters,
  handleFilterApply,
}) {
  const handleChange = (e) => {
    switch (e.target.id) {
      case "assets":
        let assets = filters.assets;
        if (!assets.includes(e.target.value)) {
          assets.push(e.target.value);
        } else {
          assets = assets.filter((asset) => asset != e.target.value);
        }
        setFilters({ ...filters, assets: assets });
        return;
      case "profession":
        let professions = filters.profession;
        if (!professions.includes(e.target.value)) {
          professions.push(e.target.value);
        } else {
          professions = professions.filter(
            (profession) => profession != e.target.value
          );
        }
        setFilters({ ...filters, profession: professions });
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

  console.log(filters);
  return (
    <Accordion type="single" collapsible>
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
                          id={"profession"}
                          value={profession}
                          onClick={handleChange}
                          checked={
                            filters.profession &&
                            filters.profession.includes(profession)
                          }
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
                          id={"assets"}
                          value={asset}
                          onClick={handleChange}
                          checked={
                            filters.assets && filters.assets.includes(asset)
                          }
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
          <div className="flex flex-row flex-wrap justify-center gap-2 m-2">
            <Button className="flex-grow" onClick={handleFilterApply}>
              Apply
            </Button>
            <Button
              className="flex-grow"
              onClick={() => {
                setFilters({});
                handleFilterApply();
              }}
            >
              Clear
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

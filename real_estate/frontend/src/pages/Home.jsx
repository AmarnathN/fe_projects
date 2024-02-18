import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
import PorfilesList from "./PorfilesList.jsx";

export default function Home() {
  return (
    <div className="flex sm:min-w-full sm:min-h-screen">
      <blockquote className="flex-1 sm:min-w-full sm:min-h-full">
        <h1 className="text-2xl font-bold">Welcome to Real Parinaye</h1>
      </blockquote>
    </div>
  );
}

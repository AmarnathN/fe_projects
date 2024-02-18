import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "./shadcn/components/ui/card";
import { Badge } from "./shadcn/components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "./shadcn/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "./shadcn/components/ui/dropdown-menu";

import {
  signOutAtStart,
  signOutSuccess,
  signOutFailure,
} from "../redux/user/userSlice.js";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleSignOut = async (e) => {
    e.preventDefault();
    // sign out logic
    dispatch(signOutAtStart());
    try{
      const res = await fetch(`/api/auth/signout/${currentUser._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(null));
      navigate("/sign-in");
      return;
    }catch(error){
      dispatch(signOutFailure(error));
      return;
    }
  };

  return (
    <div className="bg-secondary shadow-md opacity-85">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Badge variant="default" className={"bg-gradient-to-r z-10 from-primary"}>
          <Link to="/">
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
              <p>Parinaye</p>
            </h1>
          </Link>
        </Badge>
        <ul className="flex items-center gap-4 z-10 opacity-100">
          { currentUser && currentUser.username ? (
            <>
              <Link to="/">
                <li className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  Home
                </li>
              </Link>
              <Link to="/viewProfiles">
                <li className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  Profiles
                </li>
              </Link>
              {/* <img
                  src={currentUser.avatar}
                  alt="profile"
                  className="rounded-full h-7 w-7 object-cover"
                ></img> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>
                      {String(currentUser.username[0]).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link to="/profile">My Account</Link>
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Settings
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleSignOut}>
                      Log out
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/sign-up">
              <li className="transition-colors hover:text-primary">
                <p className="text-sm font-medium ">Sign Up</p>
              </li>
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
}

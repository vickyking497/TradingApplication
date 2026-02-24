import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DragHandleHorizontalIcon } from "@radix-ui/react-icons";
import appLogo from "@/assets/images/App-logo.jpg";
import Sidebar from "./Sidebar"
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";



const Navbar = () => {
  const auth = useSelector((store) => store.auth)
  const navigate = useNavigate();
  const location = useLocation();
  const [searchInput, setSearchInput] = React.useState("");

  React.useEffect(() => {
    const currentQ = new URLSearchParams(location.search).get("q") || "";
    setSearchInput(currentQ);
  }, [location.pathname, location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    const value = searchInput.trim();

    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    const search = params.toString();
    navigate(`${location.pathname}${search ? `?${search}` : ""}`);
  };
  
  return (
    <div className="px-2 py-3 border-b border-[#2b3139] z-50 bg-[#181a20]/95 backdrop-blur sticky top-0 left-0 right-0 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-11 w-11">
              <DragHandleHorizontalIcon className="h-7 w-7" />
            </Button>
          </SheetTrigger>

          <SheetContent
            className="w-72 flex flex-col justify-center"
            side="left"
          >
            <SheetHeader>
              <SheetTitle>
                <div className="text-3xl flex justify-center items-center gap-2">
                  <Avatar>
                    <AvatarImage src={appLogo}  />
                    <AvatarFallback>VT</AvatarFallback>
                  </Avatar>

                  <div>
                    <span className="font-bold text-[#f0b90b]">Vic</span>
                    <span>Trade</span>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>
            <Sidebar/>
          </SheetContent>
        </Sheet>
        <p className="text-sm lg:text-base cursor-pointer">
            Vic Trading
        </p>
        <div className="p-0 ml-9">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search"
              className="w-48 lg:w-64"
            />
          </form>
        </div>
      </div>
      <div>
        <Avatar>
          <AvatarFallback>
            {auth.user?.fullname[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Navbar;

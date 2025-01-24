import React, { useCallback, useState } from "react";
import CalendarComponent from "./CalendarComponent";
import { useScreen } from "@/context/ScreenContext";
import PopUpAddEventForm from "./PopUpAddEventForm";
import PopupHolder from "../Popups/PopupHolder";
import AddEventForm from "./AddEventForm";
import { useSelector } from "react-redux";

function CalendarHome() {
  const { screenWidth } = useScreen();
  const isMobile = screenWidth < 780;
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [formVisible, setFormVisible] = useState(false);

  const handleFormVisibility = useCallback(() => {
    setFormVisible((prev) => !prev);
  }, []);

  return (
    <div className="w-full h-[92.9vh] lg:h-[91vh] flex flex-col gap-2 px-2 lg:px-16">
      <main className={`grid ${ isMobile ?"grid-rows-12" :"grid-cols-12"} gap-4 h-full `}>
        {/* Calendar Section */}
        <section className={`w-full h-full ${isMobile ? "row-span-11" :" col-span-9"} flex flex-col flex-grow overflow-hidden`}>
          <CalendarComponent />
        </section>

        {/* Sidebar Section */}
        <aside
          className={`flex flex-col flex-grow items-center justify-start ${isMobile ? "row-span-1" : "col-span-3" } w-full h-full`}
        >
          {!isMobile && <AddEventForm accessToken={accessToken} />}
          {isMobile && (
            <button
              onClick={handleFormVisibility}
              className="bg-[#39a2ff] text-white p-2 w-full h-full text-2xl font-light rounded-full"
            >
              Add Event
            </button>
          )}
          {formVisible && (
            <PopupHolder>
              <PopUpAddEventForm handleFormVisibility={handleFormVisibility} accessToken={accessToken} />
            </PopupHolder>
          )}
        </aside>
      </main>
      <h1 className="text-[#39a2ff] font-light text-3xl text-center border-t-[3px] border-t-[#39a2ff]">
        Calendar - Actionote
      </h1>
    </div>
  );
}

export default CalendarHome;
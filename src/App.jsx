import React, { useEffect, useState } from "react";

import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="dark:bg-[#1a1a1a] bg-[#ffffff] text-[#1b1b1b] min-h-screen w-full flex flex-col items-center justify-center dark:text-white ">
      <Outlet />
    </div>
  );
}

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-gray-100 text-gray-800">

      {/* Subtle background gradients */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-red-100 blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-red-50 blur-[120px]" />
      </div>

      <div className="relative z-10 flex h-screen overflow-hidden">

        {/* Sidebar */}
        <Sidebar open={openSidebar} setOpen={setOpenSidebar} />

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Header */}
          <Header setOpen={setOpenSidebar} />

          {/* Page Content */}
          <main className="min-w-0 flex-1 overflow-y-auto px-3 pb-6 pt-3 sm:px-6 sm:pt-4 lg:px-8">

            {/* Page container */}
            <div className="mx-auto w-full min-w-0 max-w-[1600px]">

              {/* Page card */}
              <div className="rounded-[22px] border border-gray-200 bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-8">

                <Outlet />

              </div>

            </div>

          </main>

        </div>
      </div>
    </div>
  );
};

export default Layout;

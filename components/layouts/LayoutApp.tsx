"use client"

import React from "react"

import SidebarMenu from "./Header"

const LayoutApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="h-screen">
        <SidebarMenu />
      </div>
      <div className="w-full">
        <div
          className="h-[100px] w-full flex items-center px-5"
          style={{
            background: "linear-gradient(90deg, #36989D 0%, #3C5F60 100%)",
          }}
        >
          <p className="text-white text-3xl font-bold">
            CÔNG TY CP PHÁT TRIỂN BĐS PHÁT ĐẠT
          </p>
        </div>
        <div className="p-6 text-black">{children}</div>
      </div>
    </div>
  )
}

export default LayoutApp

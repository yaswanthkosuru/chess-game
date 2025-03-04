"use client";
import { realtime } from "@/constants";
import { AblyProvider } from "ably/react";
import React from "react";

const Ablyprovider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AblyProvider client={realtime}>
      <div>{children}</div>
    </AblyProvider>
  );
};

export default Ablyprovider;

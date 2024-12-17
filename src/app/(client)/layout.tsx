import React from "react";
import Navbar from "./_conponents/Navbar";

export default function PageClient({ children }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

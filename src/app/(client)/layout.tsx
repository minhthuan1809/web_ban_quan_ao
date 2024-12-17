import React from "react";
import Navbar from './_conponents/Navbar';
import Footer from "./_conponents/Footer";

export default function PageClient({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

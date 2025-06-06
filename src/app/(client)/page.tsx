import React from "react";
import Slide from "../components/Slide";
import ChooseCategoryHeader from "../components/category/ChooseCategoryHeader";
import CardProduct from "./_conponents/CardProduct";

export default function HomePage() {
const data = [
  {
    id: 1,
    name: "Product 1",
    price: 100000,
    image: "https://plus.unsplash.com/premium_photo-1687686676757-9d849a16e4ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc2lvbnxlbnwwfHwwfHx8MA%3D%3D",
    description: "Description 1",
    status: "active",
    Evaluate : 5
  },
];  

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Slide />
      <ChooseCategoryHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-primary mb-2">Sản phẩm mới nhất</h2>
            <div className="w-[3rem] mx-auto h-[2px] bg-primary/60"></div>
            <CardProduct data={data} />
          </div>
        </section>
      </div>
    </main>
  );
}

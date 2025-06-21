"use client"
import React, { useEffect, useState } from "react";
import Slide from "../components/Slide";
import ChooseCategoryHeader from "../components/category/ChooseCategoryHeader";
import { getProducts_API } from "../_service/products";
import ProductCarousel from "../components/category/ProductCarousel";

export default function HomePage() {
  const [data, setData] = useState([]);

useEffect(() => {
  const fetchReviews = async () => {
    const response = await getProducts_API('', 1, 10, {});
    setData(response.data.data);
  }
  fetchReviews();
}, []);


  return (
    <main className="min-h-screen bg-background text-foreground">
      <Slide />
      <ChooseCategoryHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-primary mb-2">Sản phẩm mới nhất</h2>
            <div className="w-[3rem] mx-auto h-[2px] bg-primary/60"></div>
            <ProductCarousel title="" data={data} productsPerRow = {4} rows = {2}/>
          </div>
        </section>
      </div>
    </main>
  );
}

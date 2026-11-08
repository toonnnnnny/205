"use client";
import { useEffect } from "react";
import { useGlobalsData } from "../layout";
import { Product } from "../data/products";
import Image from "next/image";
import Link from "next/link";
import { checkLogin } from "@/utils/login";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  useEffect(() => checkLogin(router, "/products"), [router]);

  const { products, setProducts, carts, setCarts } = useGlobalsData();

  const addToCarts = (product: Product) => {
    setProducts(products.filter((p: Product) => p.id !== product.id));
    setCarts([...carts, product]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">สินค้าทั้งหมด</h1>
          <p className="text-sm text-gray-500 mt-1">
            พบ {products.length} รายการ
          </p>
        </div>
        <Link
          href="/carts"
          className="text-sm font-medium text-cyan-700 hover:text-cyan-900 transition"
        >
          ไปที่ตะกร้า ({carts.length}) →
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product: Product) => (
          <div
            key={product.id}
            className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <Image
                src={product.thumbnailUrl}
                alt={product.title}
                width={300}
                height={300}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-2 py-1 rounded-full shadow">
                ${product.price}
              </span>
            </div>

            <div className="flex flex-col flex-1 p-3 gap-3">
              <h3 className="text-sm text-gray-700 line-clamp-2 min-h-10">
                {product.title}
              </h3>
              <button
                onClick={() => addToCarts(product)}
                className="mt-auto w-full rounded-xl bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white text-sm font-medium py-2 transition"
              >
                + เพิ่มลงตะกร้า
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {products.length === 0 && (
        <div className="text-center py-24 text-gray-500">
          <div className="text-5xl mb-3">🛍️</div>
          <p className="font-medium">ไม่มีสินค้าเหลือแล้ว</p>
          <p className="text-sm mt-1">สินค้าทั้งหมดอยู่ในตะกร้าของคุณ</p>
        </div>
      )}
    </div>
  );
}
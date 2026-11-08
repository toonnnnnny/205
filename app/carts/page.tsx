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
  useEffect(() => checkLogin(router, "/carts"), [router]);

  const { products, setProducts, carts, setCarts } = useGlobalsData();

  const removeFromCarts = (product: Product) => {
    setCarts(carts.filter((p: Product) => p.id !== product.id));
    setProducts([...products, product]);
  };

  const totalCount = carts.length;
  const totalPrice = carts.reduce((sum: number, p: Product) => sum + p.price, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        ตะกร้าสินค้า
        <span className="ml-2 text-base font-normal text-gray-500">
          ({totalCount} รายการ)
        </span>
      </h1>

      {carts.length === 0 ? (
        /* Empty state */
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl text-center py-24">
          <div className="text-5xl mb-3">🛒</div>
          <p className="font-medium text-gray-700">ตะกร้าของคุณยังว่างอยู่</p>
          <Link
            href="/products"
            className="inline-block mt-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium px-5 py-2 transition"
          >
            เลือกซื้อสินค้า
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Item list */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {carts.map((product: Product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-3 shadow-sm hover:shadow-md transition"
              >
                <Image
                  src={product.thumbnailUrl}
                  alt={product.title}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-xl object-cover bg-gray-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-gray-800 line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="mt-1 font-semibold text-cyan-700">
                    ${product.price}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCarts(product)}
                  className="shrink-0 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 active:scale-95 text-sm px-3 py-1.5 transition"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm lg:sticky lg:top-4">
            <h2 className="font-semibold text-gray-900 mb-4">สรุปคำสั่งซื้อ</h2>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>จำนวนสินค้า</span>
              <span>{totalCount} ชิ้น</span>
            </div>
            <div className="border-t border-gray-100 my-3" />
            <div className="flex justify-between items-baseline">
              <span className="text-gray-700">ราคารวม</span>
              <span className="text-2xl font-bold text-gray-900">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              className="mt-5 w-full rounded-xl bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-medium py-2.5 transition"
            >
              ชำระเงิน
            </button>
            <Link
              href="/products"
              className="block text-center mt-3 text-sm text-gray-500 hover:text-gray-800 transition"
            >
              ← เลือกซื้อสินค้าต่อ
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
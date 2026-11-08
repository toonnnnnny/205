"use client";

import Header from "@/component_front/Header";
import UserInfo from "@/component_front/UserInfo";
import "./globals.css";
import Footer from "@/component_front/Footer";
import Link from "next/link";
import { Button, buttonStyles } from "@/components/tailgrids/core/button";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { fetchProducts, Product } from "./data/products";
import { Badge } from "@/components/tailgrids/core/badge";
import { doLogout } from "@/utils/login";

export type GlobalsData = {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  carts: Product[];
  setCarts: Dispatch<SetStateAction<Product[]>>;
};

export const globalsDataContext = createContext<GlobalsData | null>(null);

// ใช้ hook นี้ในคอมโพเนนต์อื่นแทน useContext(globalsDataContext) ตรง ๆ
export function useGlobalsData() {
  const ctx = useContext(globalsDataContext);
  if (!ctx) {
    throw new Error("useGlobalsData must be used within RootLayout");
  }
  return ctx;
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const pathname = usePathname();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [carts, setCarts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data as Product[]))
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      });
  }, []);

  useEffect(() => {
    console.log(products);
  }, [products]);

  const handleLogout = () => {
    doLogout(router, "/login");
  };

  return (
    <globalsDataContext.Provider
      value={{ products, setProducts, carts, setCarts }}
    >
      <html>
        <body>
          <Header />
          <UserInfo />
          <nav className="flex gap-4 justify-center mt-4">
            <Link
              href="/"
              className={buttonStyles({
                appearance: pathname === "/" ? "fill" : "outline",
                variant: "primary",
              })}
            >
              Home
            </Link>

            <Link
              href="/animetions"
              className={buttonStyles({
                appearance: pathname === "/animetions" ? "fill" : "outline",
                variant: "primary",
              })}
            >
              Animetion
            </Link>

            <Link
              href="/calculator"
              className={buttonStyles({
                appearance: pathname === "/calculator" ? "fill" : "outline",
                variant: "primary",
              })}
            >
              Calculator
            </Link>

            <Link
              href="/todos"
              className={buttonStyles({
                appearance: pathname === "/todos" ? "fill" : "outline",
                variant: "primary",
              })}
            >
              Todos
            </Link>

            <div className="relative">
              <Link
                href="/products"
                className={buttonStyles({
                  appearance: pathname === "/products" ? "fill" : "outline",
                  variant: "primary",
                })}
              >
                Products
              </Link>
              <Badge
                size={"sm"}
                className="absolute -right-2 -top-2 bg-red-600 text-white"
              >
                {products.length}
              </Badge>
            </div>

            <div className="relative">
              <Link
                href="/carts"
                className={buttonStyles({
                  appearance: pathname === "/carts" ? "fill" : "outline",
                  variant: "primary",
                })}
              >
                Carts
              </Link>
              <Badge
                size={"sm"}
                className="absolute -right-2 -top-2 bg-red-600 text-white"
              >
                {carts.length}
              </Badge>
            </div>

            <Button
              appearance={"outline"}
              variant="danger"
              className="ml-1"
              onClick={() => handleLogout()}
            >
              Logout
            </Button>
          </nav>
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </globalsDataContext.Provider>
  );
}

"use client";

import Header from "@/component_front/Header";
import UserInfo from "@/component_front/UserInfo";
import "./globals.css";
import Footer from "@/component_front/Footer";
import Link from "next/link";
import { buttonStyles } from "@/components/tailgrids/core/button";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { fetchProducts, Product } from "./data/products";
import { Badge } from "@/components/tailgrids/core/badge";

export type GlobalsData = {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  carts: Product[];
  setCarts: Dispatch<SetStateAction<Product[]>>;
};

export const globalsDataContext =
  createContext<GlobalsData | null>(null);

export function useGlobalsData() {
  const ctx = useContext(globalsDataContext);

  if (!ctx) {
    throw new Error(
      "useGlobalsData must be used within RootLayout"
    );
  }

  return ctx;
}

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
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

  const value = useMemo(
    () => ({
      products,
      setProducts,
      carts,
      setCarts,
    }),
    [products, carts]
  );

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Animation", href: "/animations" },
    { name: "Calculator", href: "/calculator" },
    { name: "Todos", href: "/todos" },
    { name: "Products", href: "/products" },
    { name: "Carts", href: "/carts" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("credential");
    window.dispatchEvent(new Event("credential:updated"));
    router.push("/");
    router.refresh();
  };

  return (
    <globalsDataContext.Provider value={value}>
      <html lang="en">
        <body>
          <Header />

          <UserInfo />

          <nav className="mt-4 flex flex-wrap justify-center items-center gap-4 px-4">
            {menuItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(item.href + "/");

              return (
                <div
                  key={item.name}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    className={buttonStyles({
                      appearance: isActive
                        ? "fill"
                        : "outline",
                      variant: "primary",
                    })}
                  >
                    {item.name}
                  </Link>

                  {item.name === "Products" && (
                    <Badge
                      size="sm"
                      className="absolute -right-2 -top-2 bg-red-600 text-white"
                    >
                      {products.length}
                    </Badge>
                  )}

                  {item.name === "Carts" && (
                    <Badge
                      size="sm"
                      className="absolute -right-2 -top-2 bg-red-600 text-white"
                    >
                      {carts.length}
                    </Badge>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-red-400 px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </nav>

          <main>{children}</main>

          <Footer />
        </body>
      </html>
    </globalsDataContext.Provider>
  );
}

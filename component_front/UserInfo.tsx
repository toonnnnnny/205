"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type CredentialState = {
  role: string;
  name: string;
  email: string;
};

const getCredentialState = (): CredentialState => {
  if (typeof window === "undefined") {
    return { role: "", name: "", email: "" };
  }

  try {
    const credentialString = window.localStorage.getItem("credential");
    if (!credentialString) {
      return { role: "", name: "", email: "" };
    }

    const credential = JSON.parse(credentialString) as Partial<CredentialState>;
    return {
      role: credential.role ?? "",
      name: credential.name ?? "",
      email: credential.email ?? "",
    };
  } catch {
    return { role: "", name: "", email: "" };
  }
};

export default function UserInfo() {
  const pathname = usePathname();
  const [credential, setCredential] = useState<CredentialState>(getCredentialState);

  useEffect(() => {
    const syncCredential = () => setCredential(getCredentialState());

    syncCredential();
    window.addEventListener("credential:updated", syncCredential);
    window.addEventListener("storage", syncCredential);

    return () => {
      window.removeEventListener("credential:updated", syncCredential);
      window.removeEventListener("storage", syncCredential);
    };
  }, [pathname]);

  const { role, name, email } = credential;

  return (
    <>
      <div className="flex justify-center gap-6 mt-4 font-bold">
        <div>
          ROLE: <span className="text-red-600">{role.toUpperCase()}</span>
        </div>
        <div>
          NAME: <span className="text-green-600">{name}</span>
        </div>
        <div>
          EMAIL:<span className="font-normal bg-gray-100 rounded-lg px-2">{email}</span>
        </div>
      </div>
    </>
  );
}
"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useRouter();
  const [isauth, setisauth] = useState(false);

  useEffect(() => {
    const isauthenticated = localStorage.getItem("token");

    if (isauthenticated) {
      setisauth(true);
    } else {
      setisauth(false);
      navigate.push("/auth");
    }
  }, [navigate]);

  if (!isauth) return null;

  return <>{children}</>;
};

export default ProtectedRoute;

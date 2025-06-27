import React from "react";
import Canvapage from "../../../componentpages/Canvapage";
import ProtectedRoute from "../../../componentpages/wrapper/Protectionroute";

export default async function Page({ params }: { params: { id: string } }) {
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <ProtectedRoute>
      <Canvapage roomid={id} />
    </ProtectedRoute>
  );
}

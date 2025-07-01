import Canvapage from "../../../componentpages/Canvapage";
import ProtectedRoute from "../../../componentpages/wrapper/Protectionroute";

export default function Page(props: any) {
  const  id  = props.params.id;
  return (
    <ProtectedRoute>
      <Canvapage roomid={id} />
    </ProtectedRoute>
  );
}

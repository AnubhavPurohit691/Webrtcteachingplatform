import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import Canvapage from "../components/Canvapage";
import { CookiesProvider } from "react-cookie";
import ProtectedRoute from "../components/Protectionroute";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  return (
    <div >
      <ProtectedRoute>
      <Canvapage/>
      </ProtectedRoute>
     
    </div>
  );
}

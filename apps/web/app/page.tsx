import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import Canvapage from "../componentpages/Canvapage";
import { CookiesProvider } from "react-cookie";
import ProtectedRoute from "../componentpages/wrapper/Protectionroute";
import InputBox from "../componentpages/InputBox";
import Dashboard from "../componentpages/Dashboard";
import LandingPage from "../componentpages/LandingPage";

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
    <div>
      <LandingPage />
    </div>
  );
}

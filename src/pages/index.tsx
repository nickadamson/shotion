import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import ActivePage from "@/components/ActivePage";
import Menu from "@/components/Menu/index";

const Home: NextPage = () => {
  return (
    <>
      <Menu />
      <ActivePage />
    </>
  );
};

export default Home;

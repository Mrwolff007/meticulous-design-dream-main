import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import PageTransition from "./PageTransition";

interface LayoutProps {
  children: ReactNode;
  transparentNav?: boolean;
}

const Layout = ({ children, transparentNav = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transparent={transparentNav} />
      <main className={`flex-1 ${transparentNav ? "pt-0" : "pt-16 md:pt-20"}`}>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;

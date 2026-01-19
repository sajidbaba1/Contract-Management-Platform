import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ContractFlow | Admin Platform",
  description: "Enterprise Contract Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen text-zinc-100 bg-black`}>
        <AuthGuard>
          {children}
        </AuthGuard>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{
            zIndex: 99999,
          }}
        />
      </body>
    </html>
  );
}

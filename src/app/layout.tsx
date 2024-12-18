import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Letterboxd Doppelgangers",
  description: "Find other Letterboxd users with the same favorites as you!",
  icons: [
    {
      url: "/favicon.png",
      sizes: "64x64",
      type: "image/png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 2,
            opacity: 0.1,
            width: "100vw",
            height: "100vh",
            background: "url('moon.png') no-repeat",
            backgroundSize: "contain",
            backgroundPositionY: "top",
            backgroundPositionX: "center",
            backgroundAttachment: "fixed",
            pointerEvents: "none",
            // fontFamily: "sans-serif",
          }}
        ></div>

        <div
          style={{
            minHeight: "60vh",
          }}
        >
          {children}
        </div>

        <footer>
          <div className="my-12 mx-2 text-shark-300 text-sm">
            <div className="flex flex-col md:flex-row gap-5 justify-center items-center">
              <div>
                Created by&nbsp;
                <a
                  href="https://www.timcieplowski.com/"
                  target="blank"
                  className="text-blue-300 hover:text-blue-200"
                >
                  Tim Cieplowski
                </a>
              </div>

              <div>
                <a
                  className="bg-blue-300 hover:bg-blue-200 rounded p-2 flex text-blue-800"
                  target="_blank"
                  href="https://ko-fi.com/timciep"
                >
                  ☕ Buy me a coffee
                </a>
              </div>

              <div>
                <a
                  className="bg-apple-200 hover:bg-apple-300 text-apple-900 rounded p-2 flex items-center justify-center gap-2"
                  target="_blank"
                  href="https://letterboxd.com/timciep"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="lb.png"
                    alt="Letterboxd logo"
                    className="w-4 inline"
                  />
                  Follow me on Letterboxd
                </a>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                className="inline-block w-6"
                href="https://github.com/timciep/letterboxd-doppelgangers-cf"
                target="_blank"
              >
                <svg
                  aria-label="GitHub"
                  viewBox="0 0 98 96"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                    fill="#9eb6c2"
                  />
                </svg>
              </a>
            </div>
          </div>
        </footer>

        <GoogleAnalytics gaId="G-6ENCB6TNZG" />
      </body>
    </html>
  );
}

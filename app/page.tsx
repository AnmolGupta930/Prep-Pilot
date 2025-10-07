"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Magnet from "./components/magnet";
import Image from "next/image";
import {
  IconChevronCompactDown,
  IconLoader,
  IconPlus,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useSession } from "./utils/session-provider";
import Logo from "./components/logo";
import ThemeButton from "./components/theme-button";
import AnimatedText from "./components/animated-text";
import { motion } from "motion/react";

export default function Home() {
  const [nav, setNav] = useState(true);
  const router = useRouter();
  const { session, loading } = useSession();
  const text = "Move from endless planning to focused preparation.";

  useEffect(() => {
    if (!loading && session) {
      router.push("/todo");
    }
  }, [loading, session, router]);

  if (loading) {
    return (
      <div className="text-muted bg-background absolute flex h-screen w-screen items-center justify-center">
        <IconLoader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-background absolute top-0 left-0 z-50 flex min-h-screen w-full flex-col items-center">
        <nav className="bg-card/20 border-border fixed z-50 flex w-full flex-col gap-4 border-b px-8 py-4 backdrop-blur-3xl max-md:px-3">
          <div className="flex flex-row items-center justify-between max-sm:flex-col">
            <div className="flex w-full justify-between">
              <Link href={"/"} className="flex items-center gap-2">
                <Logo />
                <h2 className="text-foreground tracking-tight">Prep Pilot</h2>
              </Link>
              <button
                onClick={() => setNav(!nav)}
                className={`hidden max-sm:block ${nav ? "" : "rotate-180"}`}
              >
                <IconChevronCompactDown className="text-muted-foreground" />
              </button>
            </div>

            <div
              className={`flex items-center gap-2 ${nav ? "max-sm:hidden" : "pt-4 max-sm:flex"}`}
            >
              <ThemeButton />
              <Link
                href={"/login"}
                target="_self"
                className="border-border text-foreground bg-background hover:bg-active cursor-pointer rounded-lg border px-4 py-2"
              >
                <p>Login</p>
              </Link>
              <Link
                href={
                  "https://mail.google.com/mail/?view=cm&fs=1&to=anmolgupta30may@gmail.com"
                }
                target="_blank"
                className="border-border text-foreground bg-background hover:bg-active cursor-pointer rounded-lg border px-4 py-2"
              >
                <p>Contact</p>
              </Link>
              <Link
                href={"/signup"}
                target="_self"
                className="border-border text-background bg-foreground hover:bg-muted-foreground cursor-pointer rounded-lg border px-4 py-2 whitespace-nowrap"
              >
                <p>Sign Up</p>
              </Link>
            </div>
          </div>
        </nav>

        <div className="text-foreground border-border mt-18 flex flex-col items-center justify-start gap-5 border-x py-35 text-center max-lg:border-0 max-sm:mt-16 max-sm:gap-3 max-sm:px-2 max-sm:py-25 md:px-2 lg:min-w-[1280px]">
          <motion.p
            animate={{
              backgroundPosition: ["200%", "-200%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "linear",
            }}
            className="from-muted-foreground via-foreground to-muted-foreground bg-gradient-to-r bg-[length:200%_auto] bg-clip-text text-transparent"
          >
            For the smart JEE aspirant.
          </motion.p>
          <h1 className="text-foreground max-w-4xl leading-15 tracking-tighter max-sm:leading-10">
            <AnimatedText text={text} />
          </h1>

          <h3 className="mt-4 max-sm:mt-1">
            Visually organize your mock tests, subjects, and revision,
            <br className="max-md:hidden" /> turning procrastination into
            powerful progress.
          </h3>
          <div className="flex gap-5 max-sm:gap-2">
            <Link
              href={"/signup"}
              className="border-border text-background bg-foreground hover:bg-muted-foreground cursor-pointer rounded-lg border px-4 py-2"
            >
              <p>Get Started</p>
            </Link>
            <Link
              href={"/demo"}
              className="border-border text-foreground bg-background hover:bg-active cursor-pointer rounded-lg border px-4 py-2"
            >
              <p>View Demo</p>
            </Link>
          </div>
        </div>
        <div className="border-border text-foreground w-full border-y">
          <div className="border-border text-muted-foreground bgpattern relative mx-auto max-w-[1280px] border-x">
            <Magnet>
              <Image
                draggable={false}
                className="border-border shadow-popover z-30 h-full w-full rounded-2xl border-5 object-cover max-sm:border-2"
                alt="hero image"
                width={1000}
                height={1000}
                src={"/hero.png"}
              ></Image>
            </Magnet>
            <div className="absolute -top-3 -left-3">
              <IconPlus />
            </div>
            <div className="absolute -top-3 -right-3">
              <IconPlus />
            </div>
            <div className="absolute -right-3 -bottom-3">
              <IconPlus />
            </div>
            <div className="absolute -bottom-3 -left-3">
              <IconPlus />
            </div>
          </div>
        </div>
        <div className="text-foreground border-border flex flex-col items-center justify-start gap-5 border-x py-15 max-lg:border-0 max-sm:gap-3 max-sm:py-10 lg:min-w-[1280px]">
          <motion.p
            animate={{
              backgroundPosition: ["200%", "-200%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "linear",
            }}
            className="from-muted-foreground via-foreground to-muted-foreground bg-gradient-to-r bg-[length:200%_auto] bg-clip-text text-transparent"
          >
            Benefits
          </motion.p>
          <h2 className="text-center">For a clear path to success.</h2>
          <div className="text-center">
            <p>• Visually map your syllabus and know what to study next.</p>
            <p>• Replace messy notebooks with a dynamic, adaptive board.</p>
            <p>• See real-time progress to build confidence for a top rank.</p>
          </div>
        </div>
        <div className="border-border text-foreground w-full border-y">
          <div className="border-border px-8 py-4 max-md:px-3 max-md:py-4">
            <p>© 2025 Prep Pilot. Made by Anmol.</p>
          </div>
        </div>
      </div>
    </>
  );
}

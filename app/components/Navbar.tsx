"use client";
import {
  IconAlarm,
  IconChevronCompactDown,
  IconDragDrop,
  IconFlask,
  IconHelpCircle,
  IconLink,
  IconLogout,
  IconMath,
  IconPrismLight,
  IconSquareRoundedCheck,
  IconTablePlus,
  IconTrash,
} from "@tabler/icons-react";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import ThemeButton from "./theme-button";
import Logo from "./logo";
import useOutsideClick from "../utils/useOutsideClick";
import { time } from "../utils/countdown";
import { supabase } from "@/client/supabaseClient";
import { useSession } from "../utils/session-provider";

export default function Navbar() {
  const [option, setoption] = useState("");
  const [nav, setNav] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const { session } = useSession();

  console.log(session);
  // @ts-expect-error user not defined
  const userName = session?.user?.user_metadata?.name;
  console.log(userName);

  useOutsideClick(modalRef, () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    }
  });

  const handelLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="border-border bg-card/20 z-40 flex w-full flex-col gap-2 rounded-2xl border px-4 pt-4 backdrop-blur-[1px] max-md:px-2">
      {isModalOpen && (
        <div
          ref={modalRef}
          className="border-border bg-card shadow-popover text-foreground absolute top-15 right-5 z-50 flex w-fit flex-col gap-2 rounded-2xl border p-4 max-md:top-55 max-sm:top-40 max-sm:right-2 max-sm:max-w-[340px]"
        >
          <p className="flex items-center gap-2">
            <IconDragDrop className="size-5" /> Drag chapters from the sidebar
            to any column.
          </p>
          <p className="flex items-center gap-2">
            <IconSquareRoundedCheck className="size-5" /> Mark a task as
            completed by dragging its card to the &quot;Completed&quot; column.
          </p>
          <p className="flex items-center gap-2">
            <IconTablePlus className="size-5" /> Create custom columns to
            organize your tasks.
          </p>
          <p className="flex items-center gap-2">
            <IconTrash className="size-5" /> Delete custom columns by clicking
            the trash icon.
          </p>
          <p className="flex items-center gap-2">
            <IconLink className="size-5" /> Go to
            <span>
              <Link href={"/demo"} className="underline">
                demo page
              </Link>
              .
            </span>
          </p>
        </div>
      )}
      <div className="flex flex-row items-start justify-between max-md:flex-col max-md:items-center max-md:gap-2">
        <Link
          onClick={() => setoption(" ")}
          className="flex items-center gap-2 px-4"
          href={"/todo"}
        >
          <Logo />
          <h2 className="text-foreground tracking-tight">Prep Pilot</h2>
        </Link>

        <div className="flex max-sm:pt-2">
          <div className="size-5 max-md:hidden"></div>
          <p className="text-foreground flex items-center justify-center gap-1 max-md:text-center">
            <span>
              <IconAlarm className="size-5 max-[391px]:hidden" />
            </span>
            {time}
          </p>
        </div>

        <button
          onClick={() => setNav(!nav)}
          className={`hidden max-sm:block ${nav ? "" : "rotate-180"}`}
        >
          <IconChevronCompactDown className="text-muted-foreground" />
        </button>

        <div
          className={`flex items-center justify-center gap-4 max-sm:${nav ? "hidden" : "flex"}`}
        >
          <div className="group flex grow gap-2">
            <div className="size-5 opacity-0 group-hover:hidden max-md:hidden"></div>
            {userName ? (
              <p className="text-foreground mb-0.5 underline">Hi, {userName}</p>
            ) : (
              <p className="text-foreground mb-0.5 underline">Hi, User</p>
            )}
            <button
              onClick={() => handelLogout()}
              className="text-muted-foreground hover:text-foreground hidden cursor-pointer group-hover:block max-md:block"
            >
              <IconLogout className="size-5" />
            </button>
          </div>
          <ThemeButton />
          <button
            onClick={() => setIsModalOpen(true)}
            className={`hover:text-foreground ${isModalOpen ? "text-foreground" : "text-muted-foreground"}`}
          >
            <IconHelpCircle className="size-5" />
          </button>
        </div>
      </div>

      <div className="flex w-full max-md:justify-center">
        <motion.div
          className={`group border-foreground pb-1 ${option === "p" ? "text-foreground border-b-2" : "text-muted-foreground"} `}
          onClick={() => setoption("p")}
        >
          <Link target="_self" href={"/physics"} className="">
            <p
              className={`group-hover:bg-active group-hover:text-foreground flex items-center gap-1 rounded px-4 py-1`}
            >
              <IconPrismLight className="size-4" /> Physics
            </p>
          </Link>
        </motion.div>
        <motion.div
          className={`group border-foreground pb-1 ${option === "c" ? "text-foreground border-b-2" : "text-muted-foreground"} `}
          onClick={() => setoption("c")}
        >
          <Link target="_self" href={"/chemistry"} className="">
            <p
              className={`group-hover:bg-active group-hover:text-foreground flex items-center gap-1 rounded px-4 py-1`}
            >
              <IconFlask className="size-4" /> Chemistry
            </p>
          </Link>
        </motion.div>
        <motion.div
          className={`group border-foreground pb-1 ${option === "m" ? "text-foreground border-b-2" : "text-muted-foreground"} `}
          onClick={() => setoption("m")}
        >
          <Link target="_self" href={"/maths"} className="">
            <p
              className={`group-hover:bg-active group-hover:text-foreground flex items-center gap-1 rounded px-4 py-1`}
            >
              <IconMath className="size-4" /> Maths
            </p>
          </Link>
        </motion.div>
      </div>
    </nav>
  );
}

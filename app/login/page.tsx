"use client";
import React from "react";
import Logo from "../components/logo";
import Link from "next/link";
import { IconMail } from "@tabler/icons-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { supabase } from "@/client/supabaseClient";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  //signin form---------------------------------
  type signInFormfeilds = {
    email: string;
    password: string;
  };
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<signInFormfeilds>();
  const submit: SubmitHandler<signInFormfeilds> = async (data) => {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (authError) {
        setError("root", {
          message: authError.message,
        });
        return;
      }

      if (authData.session) {
        router.push("/todo");
      } else {
        setError("root", {
          message: "No active session returned",
        });
      }
    } catch (error) {
      setError("root", {
        message: "Either email or password is wrong",
      });
    }
  };
  //signin form---------------------------------

  return (
    <div className="bg-background bgpattern absolute top-0 left-0 z-50 flex h-screen w-screen flex-col">
      <nav className="bg-card/20 border-border flex w-full flex-col gap-4 border-b px-8 py-4 backdrop-blur-[1px] max-md:px-3">
        <div className="flex flex-row items-center justify-between">
          <Link href={"/"} className="flex items-center gap-2">
            <Logo />
            <h2 className="text-foreground tracking-tight">Prep Pilot</h2>
          </Link>
          <Link
            href={"/signup"}
            target="_self"
            className="border-border text-foreground bg-background hover:bg-active cursor-pointer rounded-lg border px-4 py-2"
          >
            <p>Sign Up</p>
          </Link>
        </div>
      </nav>

      <div className="h-full w-full p-4">
        <div className="bg-card/20 text-foreground border-border mx-auto flex max-w-[550px] flex-col flex-wrap items-center justify-center gap-6 rounded-lg border p-12 backdrop-blur-[1px] max-md:p-4">
          <h2 className="text-center leading-8.5">Login to Prep Pilot</h2>

          <form
            className="flex w-full flex-col gap-4"
            onSubmit={handleSubmit(submit)}
          >
            <div className="text-muted-foreground flex w-full flex-col gap-1 text-[12px]">
              <label htmlFor="email" className="ml-1">
                {errors.email ? (
                  <div className="text-red-700">{errors.email.message}</div>
                ) : (
                  <div> Enter email* </div>
                )}
              </label>
              <input
                type="text"
                id="email"
                {...register("email", { required: "Cannot be empty" })}
                placeholder="Example@gmail.com"
                className="border-border bg-muted text-foreground hover:border-muted-foreground placeholder-muted-foreground focus:outline-foreground/50 w-full rounded-lg border p-2 font-sans text-sm focus:outline-2"
              />
            </div>
            <div className="text-muted-foreground flex w-full flex-col gap-1 text-[12px]">
              <label htmlFor="password" className="ml-1">
                {errors.password ? (
                  <div className="text-red-700">{errors.password.message}</div>
                ) : (
                  <div> Enter password* </div>
                )}
              </label>
              <input
                type="text"
                id="password"
                {...register("password", { required: "Cannot be empty" })}
                placeholder="Password@123"
                className="border-border bg-muted text-foreground hover:border-muted-foreground placeholder-muted-foreground focus:outline-foreground/50 w-full rounded-lg border p-2 font-sans text-sm focus:outline-2"
              />
            </div>
            {errors.root && (
              <p className="text-red-700">{errors.root.message}</p>
            )}

            <button
              className="bg-foreground disabled:bg-muted-foreground hover:bg-foreground/90 text-background mt-4 mb-1 flex cursor-pointer items-center justify-center gap-2 rounded-lg p-2 font-sans text-sm font-semibold disabled:cursor-not-allowed"
              type="submit"
              // @ts-ignore
              disabled={errors.email || errors.password || isSubmitting}
            >
              <IconMail className="size-5" />
              Continue with mail
            </button>
          </form>

          {/* <h3 className="w-full text-center"> OR</h3>
          <button className="bg-muted text-foreground hover:bg-active border-border mb-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border p-2 font-sans text-sm font-semibold">
            <IconBrandGoogleFilled className="size-5" /> Continue with Google
          </button> */}

          <h4 className="text-foreground flex gap-2 font-sans text-sm font-medium">
            Don't have an account?
            <Link
              href={"/signup"}
              target="_self"
              className="cursor-pointer text-blue-400 hover:underline"
            >
              Sign Up
            </Link>
          </h4>
        </div>
      </div>
    </div>
  );
}

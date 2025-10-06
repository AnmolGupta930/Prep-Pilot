"use client";
import React, { useState } from "react";
import Logo from "../components/logo";
import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../../client/supabaseClient";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const SignupFormSchema = z.object({
    email: z.email({ message: "Please enter a valid email." }).trim(),
    password: z
      .string()
      .min(8, { message: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    name: z.string().min(1, { message: "Cannot be empty" }).trim(),
    coach: z.string().min(1, { message: "Cannot be empty" }).trim(),
    city: z.string().min(1, { message: "Cannot be empty" }).trim(),
    academic: z.string().min(1, { message: "Cannot be empty" }).trim(),
  });

  //signup form---------------------------------
  type signupFormfeilds = z.infer<typeof SignupFormSchema>;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<signupFormfeilds>({
    resolver: zodResolver(SignupFormSchema),
    mode: "onBlur",
  });

  const submit: SubmitHandler<signupFormfeilds> = async (data) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            city: data.city,
            academic: data.academic,
            coach: data.coach,
          },
        },
      });

      if (authError) {
        setError("root", {
          message: authError.message,
        });
        return;
      }

      if (!authData) {
        setError("root", {
          message: "Sign-up failed for an unknown reason.",
        });
        return;
      }

      if (!authData.user || !authData.session) {
        setError("root", {
          message:
            "Please check your email for a confirmation link. If you already have an account, please log in.",
        });
        return;
      }
      router.push("/todo");
    } catch (error) {
      setError("root", {
        message: "Something went wrong",
      });
    }
  };

  //signup form---------------------------------

  const [show, setShow] = useState(false); //radio button form

  const [signBlock, setSignBlock] = useState(false); //singup form

  const [academic, setAcademic] = useState(""); //academic status

  const students = [{ value: "11th" }, { value: "12th" }, { value: "Dropper" }];

  // @ts-expect-error ts any 
  const onRadioChange = (e) => {
    setAcademic(e.target.value);
    setShow(true);
  };

  return (
    <div className="bg-background bgpattern absolute top-0 left-0 z-50 flex h-screen w-screen flex-col">
      <nav className="bg-card/20 border-border flex w-full flex-col gap-4 border-b px-8 py-4 backdrop-blur-[1px] max-md:px-3">
        <div className="flex flex-row items-center justify-between">
          <Link href={"/"} className="flex items-center gap-2">
            <Logo />
            <h2 className="text-foreground tracking-tight">Prep Pilot</h2>
          </Link>
          <Link
            href={"/login"}
            target="_self"
            className="border-border text-foreground bg-background hover:bg-active cursor-pointer rounded-lg border px-4 py-2"
          >
            <p>Login</p>
          </Link>
        </div>
      </nav>

      <form onSubmit={handleSubmit(submit)} className="h-full w-full p-4">
        {signBlock ? (
          <div className="bg-card/20 text-foreground border-border mx-auto flex max-w-[550px] flex-col flex-wrap items-center justify-center gap-6 rounded-lg border p-12 backdrop-blur-[1px] max-md:p-4">
            <button
              className="flex w-full cursor-pointer justify-start"
              onClick={() => setSignBlock(false)}
            >
              <IconChevronLeft />
            </button>
            <div className="flex w-full flex-col gap-4">
              <div className="text-muted-foreground flex w-full flex-col gap-1 text-[12px]">
                <label htmlFor="email" className="ml-1">
                  {errors.email ? (
                    <div className="text-red-700">{errors.email.message}</div>
                  ) : (
                    <div> Enter email*</div>
                  )}
                </label>
                <input
                  {...register("email")}
                  type="text"
                  id="email"
                  placeholder="Example@gmail.com"
                  className="border-border bg-muted text-foreground hover:border-muted-foreground placeholder-muted-foreground focus:outline-foreground/50 w-full rounded-lg border p-2 font-sans text-sm focus:outline-2"
                />
              </div>
              <div className="text-muted-foreground flex w-full flex-col gap-1 text-[12px]">
                <label htmlFor="password" className="ml-1">
                  {errors.password ? (
                    <div className="text-red-700">
                      {errors.password.message}
                    </div>
                  ) : (
                    <div> Enter password* </div>
                  )}
                </label>
                <input
                  {...register("password")}
                  type="text"
                  id="password"
                  placeholder="Password@123"
                  className="border-border bg-muted text-foreground hover:border-muted-foreground placeholder-muted-foreground focus:outline-foreground/50 w-full rounded-lg border p-2 font-sans text-sm focus:outline-2"
                />
              </div>
              {errors.root && (
                <p className="text-red-700">{errors.root.message}</p>
              )}
              <button
                // @ts-expect-error disable expects boolean
                disabled={errors.email || errors.password || isSubmitting}
                className="bg-foreground disabled:bg-muted-foreground hover:bg-foreground/90 text-background mt-4 mb-1 cursor-pointer rounded-lg p-2 font-sans text-sm font-semibold disabled:cursor-not-allowed"
                type="submit"
              >
                {isSubmitting ? "Submitting" : "Submit"}
                {isSubmitSuccessful ? "ed" : ""}
              </button>

              {isSubmitSuccessful && (
                <div className="text-foreground text-center font-sans text-sm">
                  Check your email for the verification link.
                </div>
              )}
            </div>

            {/* <h3 className="w-full text-center">OR</h3>
            <button className="bg-muted text-foreground hover:bg-active border-border mb-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border p-2 font-sans text-sm font-semibold">
              <IconBrandGoogleFilled className="size-5" /> Continue with Google
            </button> */}
          </div>
        ) : (
          <div className="bg-card/20 text-foreground border-border mx-auto flex max-w-[550px] flex-col flex-wrap items-center justify-center gap-6 rounded-lg border p-12 backdrop-blur-[1px] max-md:p-4">
            <h2 className="text-center leading-8.5">
              Ace your exam, start with a simple sign-up.
            </h2>

            <div className="flex w-full flex-col gap-1">
              <p className="text-muted-foreground ml-1">Academic Status :</p>
              <div className="text-foreground border-border divide-border flex w-full justify-center divide-x overflow-hidden rounded-md border font-sans text-sm">
                {students.map((student) => (
                  <label
                    htmlFor={student.value}
                    className="w-full cursor-pointer"
                    key={student.value}
                  >
                    <input
                      type="radio"
                      {...register("academic")}
                      value={student.value}
                      id={student.value}
                      className="peer sr-only"
                      onChange={onRadioChange}
                    />
                    <div className="peer-checked:bg-foreground hover:bg-muted hover:text-foreground peer-checked:text-background w-full p-2 text-center">
                      {student.value}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex w-full flex-col gap-4">
              {show && (
                <>
                  <div className="text-muted-foreground flex w-full flex-col gap-1 text-[12px]">
                    <label htmlFor="name" className="ml-1">
                      {errors.name ? (
                        <div className="text-red-700">
                          {errors.name.message}
                        </div>
                      ) : (
                        <div>Enter your name* </div>
                      )}
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register("name")}
                      placeholder="Anmol Gupta"
                      className="border-border bg-muted text-foreground hover:border-muted-foreground placeholder-muted-foreground focus:outline-foreground/50 w-full rounded-lg border p-2 font-sans text-sm focus:outline-2"
                    />
                  </div>

                  <div className="flex w-full items-end gap-3">
                    <div className="text-muted-foreground flex w-[65%] flex-col gap-1 text-[12px]">
                      <label htmlFor="coach" className="ml-1">
                        {errors.coach ? (
                          <div className="text-red-700">
                            {errors.coach.message}
                          </div>
                        ) : (
                          <div>Enter coaching institute name* </div>
                        )}
                      </label>
                      <input
                        type="text"
                        id="coach"
                        {...register("coach")}
                        placeholder="Allen"
                        className="border-border bg-muted text-foreground hover:border-muted-foreground placeholder-muted-foreground focus:outline-foreground/50 w-full rounded-lg border p-2 font-sans text-sm focus:outline-2"
                      />
                    </div>

                    <div className="text-muted-foreground flex flex-col gap-1 text-[12px]">
                      <label htmlFor="city" className="ml-1">
                        {errors.city ? (
                          <div className="text-red-700">
                            {errors.city.message}
                          </div>
                        ) : (
                          <div>Enter city name* </div>
                        )}
                      </label>
                      <input
                        type="text"
                        id="city"
                        {...register("city")}
                        placeholder="Bangalore"
                        className="border-border bg-muted text-foreground hover:border-muted-foreground placeholder-muted-foreground focus:outline-foreground/50 w-full rounded-lg border p-2 font-sans text-sm focus:outline-2"
                      />
                    </div>
                  </div>
                  <button
                    // @ts-expect-error disable expects boolean
                    disabled={
                      errors.city ||
                      errors.coach ||
                      errors.name ||
                      errors.academic
                    }
                    onClick={() => setSignBlock(true)}
                    className={`text-background bg-foreground hover:bg-foreground/90 disabled:bg-muted-foreground mt-4 mb-1 cursor-pointer rounded-lg p-2 font-sans text-sm font-semibold disabled:cursor-not-allowed`}
                  >
                    Continue
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

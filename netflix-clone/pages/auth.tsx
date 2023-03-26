import Input from "@/components/input";
import { useCallback, useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { validateLogin, validateRegister } from "../helpers";
import { useRouter } from "next/router";
import { Oval } from "react-loader-spinner";
import { set } from "lodash";
import Nextauth from "./api/auth/[...nextauth]";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [nextAuthErrors, setNextAuthErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [variant, setVariant] = useState("login");

  const router = useRouter();

  const toggleVariant = useCallback(() => {
    setValidationErrors([]);
    setNextAuthErrors([]);
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login"
    );
  }, []);

  const handleLogin = () => {
    const loginErrors = validateLogin(email, password);

    setValidationErrors(loginErrors);
    setNextAuthErrors([]);
    loginErrors.length === 0 && login();
  };

  const handleRegister = () => {
    const registerErrors = validateRegister(name, email, password);
    setValidationErrors(registerErrors);
    setNextAuthErrors([]);
    registerErrors.length === 0 && register();
  };

  const login = useCallback(async () => {
    setIsLoading(true);
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
      .then((res) => {
        setIsLoading(false);
        if (!res?.ok) {
          setNextAuthErrors([res?.error || ""]);
        } else {
          router.push("/profiles");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [email, password, router]);

  const register = useCallback(async () => {
    await axios
      .post("/api/register", {
        email,
        name,
        password,
        redirect: false,
        checkEmailExists: true,
      })
      .then((res) => {
        login();
      })
      .catch((err) => {
        console.log(err);
        setNextAuthErrors([err.response.data.error]);
      });
  }, [login, email, name, password, nextAuthErrors]);

  return (
    <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <img src="./images/mattflix.png" alt="Logo" className="h-13" />
        </nav>
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-white text-4xl mb-8 font-semibold">
              {variant === "login" ? "Sign in" : "Register"}
            </h2>
            <div className="text-white grid w-full place-items-center">
              <Oval
                height={80}
                width={80}
                color="#4fa94d"
                wrapperStyle={{}}
                wrapperClass=""
                visible={isLoading}
                ariaLabel="oval-loading"
                secondaryColor="#4fa94d"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </div>

            {!isLoading && (
              <>
                <div className="flex flex-col gap-4">
                  {validationErrors.map((error, index) => (
                    <p key={index} className="text-red-500">
                      {error}
                    </p>
                  ))}
                  {nextAuthErrors.map((error, index) => (
                    <p key={index} className="text-red-500">
                      {error}
                    </p>
                  ))}
                  {variant === "register" && (
                    <Input
                      label="Username"
                      onChange={(e: any) => {
                        setName(e.target.value);
                      }}
                      id="name"
                      value={name}
                    />
                  )}
                  <Input
                    label="Email"
                    onChange={(e: any) => {
                      setEmail(e.target.value);
                    }}
                    id="email"
                    type="email"
                    value={email}
                  />
                  <Input
                    label="Password"
                    onChange={(e: any) => {
                      setPassword(e.target.value);
                    }}
                    id="password"
                    type="password"
                    value={password}
                  />
                </div>

                <button
                  onClick={variant === "login" ? handleLogin : handleRegister}
                  className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition"
                >
                  {variant === "login" ? "Login" : "Sign up"}
                </button>
                <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                  <div
                    onClick={() =>
                      signIn("google", { callbackUrl: "/profiles" })
                    }
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                  >
                    <FcGoogle size={30} />
                  </div>
                  <div
                    onClick={() =>
                      signIn("github", { callbackUrl: "/profiles" })
                    }
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                  >
                    <FaGithub size={30} />
                  </div>
                </div>

                <p className="text-neutral-500 mt-12">
                  {variant === "login"
                    ? "First time using Mattflix?"
                    : "Already have an account?"}
                  <span
                    onClick={toggleVariant}
                    className="text-white ml-1 hover:underline cursor-pointer"
                  >
                    {variant === "login" ? "Create an account" : "Log in"}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

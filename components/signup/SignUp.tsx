"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect, useState } from "react";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnDisable, setBtnDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signup = async () => {
    setLoading(true);
    const response = await axios.post("/api/users/signup", {
      username,
      email,
      password,
    });

    const data = await response.data;
    router.push("/login");
    console.log(data);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    signup();
  };

  useEffect(() => {
    if (username.length > 0 && email.length > 0 && password.length > 0) {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  }, [username, email, password]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full flex flex-col max-w-md">
        <h1 className="text-center">{loading ? "Processing" : "Signup"}</h1>
        <hr />
        <label className="text-[16px] pt-3" htmlFor="name">
          Username
        </label>
        <input
          className="p-2 border border-gray-300 rounded-md mb-4 bg-white text-black"
          id="name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="name"
          type="text"
        />
        <label htmlFor="email">Email</label>
        <input
          className="p-2 border border-gray-300 rounded-md mb-4 bg-white text-black"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          type="email"
        />
        <label htmlFor="password">Password</label>
        <input
          className="p-2 border border-gray-300 rounded-md mb-4 bg-white text-black"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
        />
        <button
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition"
          onClick={handleSubmit}
        >
          {btnDisable ? "No Sign Up" : "Sign Up"}
        </button>
        <div className="flex justify-center items-center">
          <Link
            href="/login"
            className="pt-7 text-blue-500 hover:underline text-center"
          >
            Visit Login Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnDisable, setBtnDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");
  const router = useRouter();

  const login = async () => {
    setLoading(true);
    const response = await axios.post("/api/users/login", {
      email,
      password,
    });

    const data = await response.data;
    router.push("/generate-tasks");
    console.log(data);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    //  if (email === email) {
    //   setError("Incorrect email")
    // } 
    
    login();
  };

  useEffect(() => {
    if (email.length > 0 && password.length > 0) {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
   
  }, [email, password]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full flex flex-col max-w-md">
        <h1 className="text-center">{loading ? "Processing" : "Login"}</h1>
        {/* <div className="text-[10px] text-green-600 text-center">{error}</div> */}
        <hr />
        <label className="text-[16px] pt-3" htmlFor="email">
          Email :
        </label>
        <input
          className="p-2 border border-gray-300 rounded-md mb-4 bg-white text-black"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          type="email"
          />
        <label htmlFor="password">Password :</label>
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
          {btnDisable ? "No Login" : "Login"}
        </button>
        <div className="flex justify-center items-center">
          <Link
            href="/signup"
            className="pt-7 text-blue-500 hover:underline text-center"
          >
            Visit SignUp Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

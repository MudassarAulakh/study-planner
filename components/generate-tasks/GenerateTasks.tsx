"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const GenerateTasks = (e: any) => {
  const [subject, setSubject] = useState("");
  const [time, setTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const router = useRouter();

  const logout = async () => {
    await axios.get("/api/users/logout");
    router.push("/login");
  };

  

  const handleYesClick = async () => {
    const response = await axios.post("/api/users/generate-tasks", {
      subject,
      time,
      difficulty,
    });

    const tasks = await response.data.tasks;
    console.log(tasks);

    console.log("Button clicked");
    router.push(
      `/dashboard?tasks=${encodeURIComponent(JSON.stringify(tasks))}`
    );
  };

  const handleClick = () => {
    logout();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full flex flex-col max-w-md">
        <h1 className="text-2xl font-semibold text-center py-5">
          {" "}
          Generate Tasks
        </h1>
        <div className="flex flex-col py-4">
          <label htmlFor="">Enter Subject:</label>
          <select
            name=""
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full mt-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="select">-- Select --</option>
            <option value="Math">Math </option>
            <option value="English">English</option>
            <option value="History">History</option>
            <option value="Science">Science</option>
          </select>
          <label htmlFor="">Enter Time:</label>
          <input
            type="number"
            id="time"
            min="1"
            max="24"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="block text-sm font-medium text-gray-700 border p-2 rounded-lg"
          />
          <label htmlFor="">Difficulty Level:</label>
          <select
            name=""
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full mt-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="select">-- Select --</option>
            <option value="Easy">Easy </option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <button
          onClick={handleYesClick}
          className="text-center mb-3 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition"
        >
          Generate Tasks
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition"
          onClick={handleClick}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default GenerateTasks;

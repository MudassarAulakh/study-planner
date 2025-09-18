"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const Dashboard = () => {
  const searchParams = useSearchParams();
  const tasksParams = searchParams.get("tasks");
  // const status = searchParams.get("status");
  // const TaskIndexParams = searchParams.get("taskIndex");

  let tasksToShow: {
    _id?: string;
    title: string;
    description?: string;
    duration?: number;
    priority?: string;
    status?: string;
    dueDate?: string;
    value?: number;
    completed?: boolean;
    paid?: boolean;
  }[] = [];

  try {
    if (tasksParams) {
      const parsedTasks = JSON.parse(tasksParams);
      if (Array.isArray(parsedTasks)) {
        tasksToShow = parsedTasks;
      } else {
        console.log("Task data ak array ni ha ");
      }
    }
  } catch (error: any) {
    console.error("koe task found ni ho raha ha", error);
  }

  // const [tasks, setTasks] = useState(tasksParams);
  const [tasks, setTasks] = useState(tasksToShow);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editDesc, setEditDesc] = useState("");
  // const [payment, setPayment] = useState(false);

  const handleEditClick = (index: number) => {
    setEditIndex(index);
    setEditDesc(tasks[index].description || "");
  };

  const handleSaveClick = (index: number) => {
    if (editIndex === null) return;
    const updateTasks = [...tasks];
    updateTasks[index].description = editDesc;
    setTasks(updateTasks);
    setEditIndex(null);
  };

  const handleDeleteClick = (index: number) => {
    const ramainingTasks = tasks.filter((_, i) => i !== index);
    setTasks(ramainingTasks);
  };

  const handlePayClick = async (index: number) => {
    try {
      const response = await axios.post("api/users/checkout", {
        taskIndex: tasks[index].value,
        returnTasks: tasks,
      });

      const data = await response.data;
      console.log(data);
      
      window.location.href = data.url;
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen py-2">
      <div className="bg-gray-100 shadow-lg rounded-2xl p-8 w-full flex flex-col max-w-1/2">
        <h1 className="text-2xl font-semibold text-center py-5"> Dashboard</h1>
        <div className="flex flex-col gap-3">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 p-3 bg-white rounded-lg shadow-xl"
            >
              <div className="text-xl font-bold">Title: {task.title}</div>
              <div className="flex justify-between items-center text-white text-center">
                <span className="text-blue-500">Description:</span>
                <button
                  onClick={() => handlePayClick(index)}
                  className="px-3 py-1 cursor-pointer bg-blue-500 font-bold hover:bg-blue-600 rounded"
                >
                  <span className="font-bold pr-2">&#36;{task.value}</span>
                  Pay
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className="w-[100%]">
                  {editIndex === index ? (
                    <input
                      className="border p-2 w-full rounded"
                      type="text"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                    />
                  ) : (
                    task.description
                  )}
                </div>
                <div className="flex justify-between items-center gap-2">
                  <button
                    onClick={() => handleEditClick(index)}
                    className="bg-green-500 cursor-pointer hover:bg-green-600 px-3 py-1 rounded text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleSaveClick(index)}
                    className="bg-red-500 hover:bg-red-600 cursor-pointer px-3 py-1 rounded text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleDeleteClick(index)}
                    className="bg-red-500 hover:bg-red-600 cursor-pointer px-3 py-1 rounded text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <ul className="list-disc list-inside grid grid-cols-2 gap-2">
                <li>Due Date: 
                   {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "N/A"}
                </li>
                <li>Priority: {task.priority}</li>
                <li>Status: {task.status}</li>
                <li>Duration: {task.duration} mins</li>
              </ul>
              <div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

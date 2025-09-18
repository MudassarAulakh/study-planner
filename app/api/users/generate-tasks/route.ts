import { connect } from "@/dbConfig/dbConfig";
import Task from "@/models/taskModel";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log(reqBody);
    const { subject, time, difficulty } = reqBody;

    const prompt = `
    You are a study planner AI.
    Generate 4–6 study tasks for the subject: "${subject}".
    Each task should be achievable within the given daily study time: "${time}" hours.
    The difficulty should be adjusted to: "${difficulty}".
      
    Return ONLY valid JSON.
    Do not include explanations, markdown, or extra text.
    Always use double quotes for keys and string values.
    note: after dueDate add a price field with value.
      
    The format should be:
      
    {
      "tasks": [
        {
          "title": "string",
          "description": "string",
          "duration": number,
          "priority": "low|medium|high",
          "status": "pending|completed",
          "dueDate": "YYYY-MM-DD"
          "value": "number" 
        }
      ]
    }`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const user = await response.data?.candidates[0].content.parts[0].text;
    console.log({ user });

    const clean = user
      .replace(/^```json\s*/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "");

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (err) {
      console.error("Invalid JSON from Gemini:", clean);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 500 });
    }
    // console.log({ parsed });

    const newTask = new Task({
      subject,
      time,
      difficulty,
      tasks: parsed.tasks || [],
    });

    const savedTasks = await newTask.save();

    return NextResponse.json({
      message: "Tasks generated successfully",
      success: true,
      data: savedTasks,
      tasks: savedTasks.tasks,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

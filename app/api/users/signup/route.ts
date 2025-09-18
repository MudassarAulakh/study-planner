import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";


connect();

export async function POST(request: NextRequest) {


  try {
    const reqBody = await request.json();
    console.log(reqBody);
    const { username, email, password } = reqBody;

    const user = await User.findOne({ email });
    if (user) {
      // Return proper error response with status code
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const NewUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await NewUser.save();
    console.log(savedUser);

    return NextResponse.json({
      message: "User registered successfully",
      success: true,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import dbConnect from "@/lib/dbConnect";
import User from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Establish database connection
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Check if a verified user with the same username already exists
    const existingUserVerifiedByUsername = await User.findOne({
      username,
      isVerified: true, // Only check for verified users
    });

    if (existingUserVerifiedByUsername) {
      // If the username is taken by a verified user, return an error response
      return NextResponse.json(
        {
          success: true,
          message: "Username already existed",
        },
        {
          status: 400,
        }
      );
    }

    // Check if a user with the same email already exists
    const existingUserByEmail = await User.findOne({ email });

    // Generate a random 6-digit verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        // If the email is already associated with a verified account, return an error response
        return NextResponse.json(
          {
            success: true,
            message: "User already exists with this email",
          },
          {
            status: 400,
          }
        );
      } else {
        // Update the unverified user's details
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
        const expiryDate = new Date(Date.now() + 3600000); // Set verification code expiry to 1 hour from now
        existingUserByEmail.password = hashedPassword; // Update password
        existingUserByEmail.verifyCode = verifyCode; // Update verification code
        existingUserByEmail.verifyCodeExpiry = expiryDate; // Update expiry date
        await existingUserByEmail.save(); // Save changes to the database
      }
    } else {
      // If the email is not found, create a new user
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // Set verification code expiry to 1 hour

      // Create a new user object
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false, // New users are not verified by default
        isAcceptingMessage: true, // Default behavior for accepting messages
        messages: [], // Initialize with an empty messages array
      });
      await newUser.save(); // Save the new user to the database
    }

    // Send a verification email with the code
    const verifyEmail = await sendVerificationEmail(email, username, verifyCode);
    console.log("Verify email>>>", verifyEmail);

    if (!verifyEmail.success) {
      // If sending the email fails, return a server error response
      return NextResponse.json(
        {
          success: false,
          message: verifyEmail.message,
        },
        {
          status: 500,
        }
      );
    }

    // If everything is successful, return a success response
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully, please verify your email",
      },
      {
        status: 201,
      }
    );
  } catch (error:any) {
    console.log("Error registering user:", error.message, error.stack);
 // Log the error to the server console
    return NextResponse.json(
      {
        success: false,
        message: "Error registering user", // Send an error message to the client
      },
      {
        status: 500,
      }
    );
  }
}

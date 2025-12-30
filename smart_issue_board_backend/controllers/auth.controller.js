import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { auth, db, FieldValue } from "../src/config/firebase.js";

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;


/**
 * SIGN UP
 */
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await auth.createUser({
      email,
      password,
    });

    // Optional: store user profile
    await db.collection("users").doc(user.uid).set({
      email,
      createdAt: FieldValue.serverTimestamp(),
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Firebase REST API for login
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    return res.json({
      success: true,
      token: response.data.idToken,
      user: {
        email: response.data.email,
        uid: response.data.localId,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.response?.data || error.message);

    return res.status(401).json({
      success: false,
      message: error.response?.data?.error?.message || "Login failed",
    });
  }
};

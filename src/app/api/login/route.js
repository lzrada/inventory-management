import { signInWithEmailAndPassword } from "firebase/auth";
import jwt from "jsonwebtoken";
import { auth } from "../../services/firebase"; // Pastikan auth sudah diimpor dengan benar

export async function POST(req) {
  // Ambil email dan password dari body request
  const { email, password } = await req.json();

  // Pastikan nilai email dan password tidak kosong
  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    // Login menggunakan Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generate JWT token
    const token = jwt.sign(
      { uid: user.uid, email: user.email }, // Payload
      process.env.NEXT_PUBLIC_JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration
    );

    // console.log("Generated Token:", token); // Debugging token creation

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: error.message || "Invalid email or password." }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
}

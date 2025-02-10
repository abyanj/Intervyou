import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import IntroSection from "../components/IntroSection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign-up states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  useEffect(() => {
    document.title = "IntervYOU"; // Set the title dynamically
  }, []);
  // Redirect to dashboard if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  // Login handler
  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) {
        toast.error("Invalid login credentials. Please try again.");
        console.error("Login error:", error.message);
        return;
      }
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Unexpected login error:", err);
    }
  };

  // Sign-up handler
  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
      });
      if (error) {
        toast.error("Sign-up failed. User may already exist.");
        console.error("Sign-up error:", error.message);
        return;
      }
      const user = data?.user;
      if (user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          credits: 0,
          plan: "starter",
        });
        if (profileError) {
          toast.error("Failed to create profile. Please try again.");
          console.error("Profile insert error:", profileError.message);
        }
      }
      toast.success("Sign-up successful! Redirecting...");
      navigate("/dashboard");
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Unexpected sign-up error:", err);
    }
  };

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh" }}>
      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="home-container">
        <IntroSection
          isSignUp={isSignUp}
          toggleSignUp={() => setIsSignUp(!isSignUp)}
        />
        <div className="right-container">
          <div className="rounded-bg">
            <div className="form-box">
              {!isSignUp ? (
                <LoginForm
                  email={loginEmail}
                  setEmail={setLoginEmail}
                  password={loginPassword}
                  setPassword={setLoginPassword}
                  onSubmit={handleLogin}
                />
              ) : (
                <SignupForm
                  firstName={firstName}
                  setFirstName={setFirstName}
                  lastName={lastName}
                  setLastName={setLastName}
                  email={signupEmail}
                  setEmail={setSignupEmail}
                  password={signupPassword}
                  setPassword={setSignupPassword}
                  onSubmit={handleSignUp}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

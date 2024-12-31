import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import IntroSection from "../components/IntroSection";

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
        console.error("Login error:", error.message);
        return;
      }
      navigate("/dashboard");
    } catch (err) {
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
        console.error("Sign-up error:", error.message);
        return;
      }
      const user = data?.user;
      if (user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
        });
        if (profileError) {
          console.error("Profile insert error:", profileError.message);
        }
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Unexpected sign-up error:", err);
    }
  };

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh" }}>
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

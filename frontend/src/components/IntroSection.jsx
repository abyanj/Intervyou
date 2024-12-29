import React from 'react';

export default function IntroSection({ isSignUp, toggleSignUp }) {
  return (
    <div className="left-column">
      <div className="left-top">
        <div className="header">
          <div className="top-box">
            <h1 className="platform-name">IntervYOU</h1>
            <h2 className="big-heading">
              AI-Powered Interviews that are just. for. YOU.
            </h2>
          </div>
          <div className="auth-box">
            <p className="subtitle">
              {isSignUp ? 'Already have an account?' : 'Don’t have an account?'}
            </p>
            <button onClick={toggleSignUp} className="toggle-link">
              {isSignUp ? 'Log In →' : 'Create account →'}
            </button>
          </div>
        </div>
        <div className="about-box">
          <h3>About Us</h3>
          <p>
            Our application utilizes artificial intelligence to generate
            realistic interview scenarios and provide personalized feedback.
            Experience a virtual interview environment that helps you practice
            and improve your skills, guided by insights to take your
            preparation to the next level!
          </p>
        </div>
      </div>
    </div>
  );
}

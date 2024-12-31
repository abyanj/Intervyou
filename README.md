# IntervYOU

IntervYOU is a cutting-edge web platform designed to help users prepare for job interviews through realistic simulations. It empowers job seekers with personalized mock interviews, AI-driven feedback, and a seamless user experience.

---

## Features

1. **Create Mock Interviews**
   - Specify:
     - Job Position (e.g., Software Engineer, Marketing Manager).
     - Experience Level (Intern, Junior, Senior, etc.).
     - Job Description (Detailed role requirements).
   - Generate realistic interview questions tailored to inputs.

2. **Answer Interview Questions**
   - Simulate a real interview environment with timed preparation and response phases.

3. **AI-Powered Feedback**
   - Receive detailed feedback including:
     - Suggestions for improvement.
     - Ratings (out of 5).

4. **Manage Mock Interviews**
   - Dashboard to view all created interviews.
   - Option to delete interviews after completion.

5. **Future Enhancements**
   - AI-powered resume builder using interview insights.
   - Advanced feedback with video analysis.

---

### Technical Overview

#### **Backend**
- **Azure Functions**: Serverless architecture for:
  - Question generation.
  - Feedback generation.
- **Azure OpenAI**:
  - Generates questions based on job descriptions.
  - Provides feedback and ratings for answers.

#### **Frontend**
- **React.js**: Interactive and dynamic UI.
- **Material-UI**: Styling and responsive design.

#### **Database**
- **Supabase**: Hosted PostgreSQL database with row-level security.
  - Stores user data, interview questions, and feedback.

---
### Usage

1. **Sign Up or Log In**: Start by creating an account.
2. **Create a Mock Interview**: Use the dashboard to create interviews.
3. **Simulate Interview**: Answer questions in a timed environment.
4. **View Feedback**: Access detailed feedback to improve.

---
### Screenshots

1. **Dashboard**
   ![Dashboard Screenshot](assets/screenshots/dashboard.png)

2. **Mock Interview Creation**
   ![Mock Interview Creation Screenshot](assets/screenshots/interview_creation.png)

3. **Interview Setup**
   ![Interview Setup Screenshot](assets/screenshots/interview_setup.png)

4. **Interview Process**
   ![Interview Process Screenshot](assets/screenshots/interview_process.png)

5. **Feedback Page**
   ![Feedback Page Screenshot](assets/screenshots/feedback_page.png)


---

### Testing Instructions

1. Clone the repository.
   ```bash
      git clone https://github.com/abyanj/Intervyou.git
3. Navigate to the project folder and ensure the `.env` file is present.
4. Run the development server using:
   ```bash
   npm run dev
---

### About the Developer

**Abyan Jaigirdar**
- **Email**: [abyanjaigirdar@hotmail.com](mailto:abyanjaigirdar@hotmail.com)
- **Role**: Solo Full-Stack Developer

IntervYOU was created to empower job seekers with AI-driven tools to excel in their interviews.

---
### License

This project is licensed under the MIT License. See the LICENSE file for details.





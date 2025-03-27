import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import user_icon from "../../assets/person.png";
import email_icon from "../../assets/email.png";
import password_icon from "../../assets/password.png";
import { toast } from "react-toastify";
import { addHr, loginHr } from "../../services/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import '../../styles/LoginSignup.css'; // Import the new CSS


const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Name must contain only letters and spaces")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .matches(
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/,
      "Only Gmail, Yahoo, Outlook, and Hotmail are allowed"
    )
    .required("Email is required"),
  password: Yup.string()
    .min(1, "Password must be at least 8 characters long")
    .required("Password is required"),
});

// Separate schema for login (without name field)
const loginValidationSchema = validationSchema.pick(["email", "password"]);

const LoginSignup = ({ initialAction = "Login" }) => {
  const [action, setAction] = useState(initialAction);
  const { setHrId,setRole,isLoggedIn } = useAuth();
  const navigate = useNavigate();
 
  useEffect(() => {
    if (isLoggedIn && action === "Login") {
      console.log("isLoggedIn changed to true, navigating to home");
      navigate("/hr");
    }
  }, [isLoggedIn, action, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("Submitted Data:", values);

      if (action === "Sign Up") {
        const response = await addHr(values);
        const success = response.data.data !== undefined ? response.data.data : response.data;

        if (success === false) {
          toast.error("Email already exists. Please try another email.");
        } else {
          console.log("Action is", action);
          setRole('hr');
          toast.success("Registration successful! Please log in again using your created account.");
          setAction("Login");
          console.log("Action is", action);
          navigate("/hr/login");
          localStorage.setItem('hrDetails', JSON.stringify({
            id: success,
            name: values.name,
            email: values.email
          }));
        }
      } else {
        const response = await loginHr(values);
        const hrId = response.data.data !== undefined ? response.data.data.id : response.data.id;
        if (hrId === 0) {
          toast.error("Invalid email or password.");
        } else {
          setHrId(hrId);
          setRole('hr');
          toast.success("Login successful!");
          console.log("Login here, hrId set to: ", hrId);
          // Remove navigate("/") from here; let useEffect handle it
          localStorage.setItem("hrId", response.data.id);
          localStorage.setItem('hrDetails', JSON.stringify({
            id: hrId,
            email: values.email,
            name: response.data.name || values.name,
          }));
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || 'Authentication failed.');
    }
    setSubmitting(false);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={action === "Sign Up" ? validationSchema : loginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="inputs">
            {action !== "Login" && (
              <div className="input">
                <img src={user_icon} alt="User Icon" />
                <Field type="text" name="name" placeholder="Name" />
                <ErrorMessage name="name" component="div" className="error" />
              </div>
            )}

            <div className="input">
              <img src={email_icon} alt="Email Icon" />
              <Field type="email" name="email" placeholder="Email ID" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="input">
              <img src={password_icon} alt="Password Icon" />
              <Field type="password" name="password" placeholder="Password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            {action === "Login" && (
              <div className="forgot-password">
                Lost Password? <span>Click Here!</span>
              </div>
            )}

            <div className="submit-container">
              <button
                type="button"
                className={action === "Login" ? "submit gray" : "submit"}
                onClick={() => setAction("Sign Up")}
              >
                Sign up
              </button>
              <button
                type="button"
                className={action === "Sign Up" ? "submit gray" : "submit"}
                onClick={() => setAction("Login")}
              >
                Login
              </button>
            </div>

            <button type="submit" className="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default LoginSignup;
import  { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Add Link for navigation
import { useAuth } from "../../context/AuthContext";
import user_icon from "../../assets/person.png";
import email_icon from "../../assets/email.png";
import password_icon from "../../assets/password.png";
import { toast } from "react-toastify";
import { addHr, loginHr } from "../../services/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import '../../styles/LoginSignup.css';

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

const loginValidationSchema = validationSchema.pick(["email", "password"]);

const LoginSignup = ({ initialAction = "Login" }) => {
  const { setHrId, setRole, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Remove the action state since we're using routes to determine the mode
  const action = initialAction; // Use the prop directly

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
        } 
        else {
          setRole('hr');
          toast.success("Registration successful! Please log in using your created account.");
          navigate("/hr/login"); // Redirect to login after signup
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
            {action === "Sign Up" && (
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

            {/* {action === "Login" && (
              <div className="forgot-password">
                Lost Password? <span>Click Here!</span>
              </div>
            )} */}

            {/* Add the redirect link based on the current mode */}
            <div className="redirect-link">
              {action === "Login" ? (
                <>
                  Don't have an account?{' '}
                  <Link to="/hr/create" className="link">Sign up here!</Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link to="/hr/login" className="link">Login here!</Link>
                </>
              )}
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

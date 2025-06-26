import { useFormik } from "formik";
import * as Yup from "yup";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import { submitApplication } from "../../services/api";
// import '../styles/ApplicationForm.css';
import '../../styles/ApplicationForm.css'

function App() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get('jobId');

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      gender: "",
      contact: "",
      degree: "",
      cv: null,
    },
    validationSchema: Yup.object({
      firstname: Yup.string()
        .matches(/^[A-Za-z]+$/, "Only letters are allowed")
        .required("First name is required"),
      lastname: Yup.string()
        .matches(/^[A-Za-z]+$/, "Only letters are allowed")
        .required("Last name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      contact: Yup.string()
        .matches(/^\d+$/, "Only numbers are allowed")
        .required("Contact number is required"),
      gender: Yup.string().required("Gender is required"),
      degree: Yup.string().required("Degree is required"),
      cv: Yup.mixed()
        .required("CV is required")
        .test("fileFormat", "Only PDF files are allowed", (value) => value && value.type === "application/pdf"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!jobId) {
        toast.error('Invalid job ID. Please start the application process again.');
        navigate('/');
        return;
      }

      try {
        const applicationData = {
          jobId: parseInt(jobId),
          firstName: values.firstname,
          lastName: values.lastname,
          email: values.email,
          phoneNumber: values.contact,
          gender: values.gender,
          education: values.degree,
          cv: values.cv,
        };

    
        const { userId, cvResponse } = await submitApplication(applicationData);
        // Store userId in localStorage
        localStorage.setItem('userId', userId);
        localStorage.setItem('jobId', jobId);

        toast.success("Form submitted successfully!");
        resetForm();
        navigate('/');
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(error.message || "Failed to submit the form.");
      }
    },
  });

  return (
    <div className="application-form-container">
      <div className="application-form">
        <h1>Job Application Form</h1>
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="firstname">First Name <span style={{ color: 'red' }}>*</span></label>
          <input type="text" name="firstname" placeholder="Enter First Name" value={formik.values.firstname} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.firstname && formik.errors.firstname && <p className="error">{formik.errors.firstname}</p>}

          <label htmlFor="lastname">Last Name <span style={{ color: 'red' }}>*</span> </label>
          <input type="text" name="lastname" placeholder="Enter Last Name" value={formik.values.lastname} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.lastname && formik.errors.lastname && <p className="error">{formik.errors.lastname}</p>}

          <label htmlFor="email">Email <span style={{ color: 'red' }}>*</span></label>
          <input type="email" name="email" placeholder="Enter Email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.email && formik.errors.email && <p className="error">{formik.errors.email}</p>}

          <label htmlFor="contact">Contact <span style={{ color: 'red' }}>*</span></label>
          <input type="text" name="contact" placeholder="Enter Phone Number" value={formik.values.contact} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.contact && formik.errors.contact && <p className="error">{formik.errors.contact}</p>}

          <label htmlFor="gender">Gender <span style={{ color: 'red' }}>*</span></label>
          <div className="radio-group">
            <input type="radio" name="gender" value="Male" onChange={formik.handleChange} checked={formik.values.gender === "Male"} /> Male
            <input type="radio" name="gender" value="Female" onChange={formik.handleChange} checked={formik.values.gender === "Female"} /> Female
          </div>
          {formik.touched.gender && formik.errors.gender && <p className="error">{formik.errors.gender}</p>}

          <label htmlFor="degree">Degree <span style={{ color: 'red' }}>*</span></label>
          <select name="degree" onChange={formik.handleChange} value={formik.values.degree}>
            <option value="" disabled>Select Degree</option>
            <option value="bachelor">Bachelor's Degree</option>
            <option value="master">Master's Degree</option>
            <option value="doctorate">Doctorate Degree</option>
          </select>
          {formik.touched.degree && formik.errors.degree && <p className="error">{formik.errors.degree}</p>}

          <label htmlFor="cv">CV <span style={{ color: 'red' }}>*</span></label>
          <div className="file-upload">
            <label className="upload-button">
              <MdCloudUpload size={26} className="upload-icon" /> 
              <input type="file" name="cv" accept="application/pdf" hidden onChange={(event) => formik.setFieldValue("cv", event.currentTarget.files[0])} />
            </label>
            {formik.values.cv && (
              <div className="file-info">
                <AiFillFileImage size={20} /> {formik.values.cv.name}
                <MdDelete size={20} className="delete-icon" onClick={() => formik.setFieldValue("cv", null)} />
              </div>
            )}
          </div>
          {formik.touched.cv && formik.errors.cv && <p className="error">{formik.errors.cv}</p>}

          {/* <button type="reset" onClick={formik.handleReset}>Reset</button> */}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default App;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { getUsersByJobId, updateStatus } from '../../services/api';
import { toast } from 'react-toastify';
import { DEFAULT_STATUS, INTERVIEW_PROCESS_STATUS } from '../../utilities/constants';
import '../../styles/Applicants.css'
// import { UPDATED_STATUS } from '../../utilities/constants';

const ApplicantsPage = () => {
  const { id } = useParams();
  // console.log(id)
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await getUsersByJobId(id, DEFAULT_STATUS);
        console.log('Pending Applicants:', response.data);
        setApplicants(response.data);
      }
      catch (err) {
        const message = err.response?.data?.error || 'Failed to fetch applicants. Please try again.';
        setError(message);
        toast.error(message);
      }
      finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [id]);

  const handleExportLink = async (userId) => {
    try {
      console.log('Exporting interview link for userId:', userId, 'jobId:', id);
      const response = await updateStatus({ userId, jobId: id, status: INTERVIEW_PROCESS_STATUS });
      console.log('Update status response:', response.data);

  
      console.log('Update status response:', response.data);
      // const { interviewLink } = response.data;

      const interviewLink = `http://localhost:3000/question/1?userId=${userId}&jobId=${id}`;
      console.log('Frontend-generated interview link:', interviewLink);

      navigator.clipboard.writeText(interviewLink)
        .then(() => {
          toast.success('Interview link copied to clipboard! You can now paste it into an email.');
          // Remove the applicant from the list
          setApplicants(applicants.filter(applicant => applicant.userId !== userId));
        })
        .catch(() => {
          toast.error('Failed to copy link');
        });
    }
    catch (err) {
      const message = err.response?.data?.error || 'Failed to generate interview link. Please try again.';
      console.error('Error exporting link:', err);
      toast.error(message);
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;

  return (
  <Container className="applicants-table-container">
    <h2 className="applicants-heading">List of Job Applicants</h2>

    {applicants.length === 0 ? (
      <Alert variant="info" className="no-applicants-alert">
        There are currently no applicants for this job. Please check back later or share the job posting.
      </Alert>
    ) : (
      <Table striped bordered hover responsive className="applicants-table">
        <thead className="applicants-table-header">
          <tr>
            <th className="applicants-table-header-cell">First Name</th>
            <th className="applicants-table-header-cell">Last Name</th>
            <th className="applicants-table-header-cell">Email</th>
            <th className="applicants-table-header-cell">Phone Number</th>
            <th className="applicants-table-header-cell">Gender</th>
            <th className="applicants-table-header-cell">Education</th>
            <th className="applicants-table-header-cell">CV URL</th>
            <th className="applicants-table-header-cell">Status</th>
            <th className="applicants-table-header-cell">Action</th>
          </tr>
        </thead>
        <tbody className="applicants-table-body">
          {applicants.map(applicant => (
            <tr key={applicant.userId} className="applicant-row">
              <td className="applicant-cell">{applicant.first_name}</td>
              <td className="applicant-cell">{applicant.last_name}</td>
              <td className="applicant-cell">{applicant.email || 'N/A'}</td>
              <td className="applicant-cell">{applicant.phone || 'N/A'}</td>
              <td className="applicant-cell">{applicant.gender || 'N/A'}</td>
           <td className="applicant-cell">
            {applicant.degree 
              ? applicant.degree.charAt(0).toUpperCase() + applicant.degree.slice(1) 
              : 'N/A'}
          </td>
              <td className="applicant-cell">
                {applicant.CV_FilePath ? (
                  <a
                    href={`http://localhost:8000/${applicant.CV_FilePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cv-link"
                  >
                    View CV
                  </a>
                ) : (
                  'N/A'
                )}
              </td>
              {/* <td className="applicant-cell">{applicant.status}</td> */}
              <td className="applicant-cell">
                {applicant.status 
                  ? applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1) 
                  : 'N/A'} </td>
                          <td className="applicant-cell">
                <Button
                 className="export-button"
                  variant="primary"
                  size="sm"
                  onClick={() => handleExportLink(applicant.userId)}
                  
                >
                  Export Interview Link
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}

    <div className="text-center mt-4 back-button-container">
      <Button
        variant="secondary"
        onClick={() => navigate(`/hr/jobs/${id}`)}
        className="back-button"
      >
        Back to Job Details
      </Button>
    </div>
  </Container>
);


  // return (
  //   <Container className="applicants-table-container">
  //     <h2 className="text-center mb-4">Pending Applicants </h2>
  //     {applicants.length === 0 ? (
  //       <Alert variant="info">No Applicants has applied for this job currently .</Alert>
  //     ) : (
  //       <Table striped bordered hover responsive className='applicants-table'>
  //         <thead>
  //           <tr>
  //             <th>First Name</th>
  //             <th>Last Name</th>
  //             <th>Email</th>
  //             <th>Phone Number</th>
  //             <th>Gender</th>
  //             <th>Education</th>
  //             <th>CV URL</th>
  //             <th>Status</th>
  //             <th>Action</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {applicants.map(applicant => (
  //             <tr key={applicant.userId}>
  //               <td>{applicant.first_name}</td>
  //               <td>{applicant.last_name}</td>
  //               <td>{applicant.email || 'N/A'}</td>
  //               <td>{applicant.phone || 'N/A'}</td>
  //               <td>{applicant.gender || 'N/A'}</td>
  //               <td>{applicant.degree || 'N/A'}</td>
  //               <td>
  //                 {applicant.CV_FilePath ? (
  //                   <a href={`http://localhost:8000/${applicant.CV_FilePath}`} target="_blank" rel="noopener noreferrer">
  //                     View CV
  //                   </a>
  //                 ) : (
  //                   'N/A'
  //                 )}
  //               </td>
  //               <td>{applicant.status}</td>
  //               <td>
  //                 <Button
  //                   variant="primary" className='export-button'
  //                   size="sm"
  //                   onClick={() => handleExportLink(applicant.userId)}
  //                 >
  //                   Export Interview Link
  //                 </Button>
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </Table>
  //     )}
  //     <div className="text-center mt-4">
  //       <Button variant="secondary" className='back-button' onClick={() => navigate(`/hr/jobs/${id}`)}>
  //         Back to Job Details
  //       </Button>
  //     </div>
  //   </Container>
  // );
};

export default ApplicantsPage;
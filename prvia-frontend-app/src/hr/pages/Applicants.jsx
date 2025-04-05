import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { getUsersByJobId, updateStatus } from '../../services/api';
import { toast } from 'react-toastify';
import { DEFAULT_STATUS, INTERVIEW_PROCESS_STATUS } from '../../utilities/constants';
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
        const response = await getUsersByJobId(id);
        // Filter applicants with status: PENDING
        const pendingApplicants = response.data.filter(
          applicant => applicant.status.toLowerCase() === DEFAULT_STATUS.toLowerCase()
        );
        console.log('Pending Applicants:', pendingApplicants);
        setApplicants(pendingApplicants);
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
      if (response.data.response !== "success") {
       toast.error('Failed to update status');
       return
      }
      console.log('Update status response:', response.data);
      const { interviewLink } = response.data;
      
      // Alternative approach (commented out): Generate the interview link on the frontend
      /*
      const interviewLink = `http://localhost:3000/question/1?userId=${userId}&jobId=${id}`;
      console.log('Frontend-generated interview link:', interviewLink);
      */

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
    <Container className="mt-5">
      <h2 className="text-center mb-4">Pending Applicants for Job ID: {id}</h2>
      {applicants.length === 0 ? (
        <Alert variant="info">No pending applicants for this job.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Gender</th>
              <th>Education</th>
              <th>CV URL</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map(applicant => (
              <tr key={applicant.userId}>
                <td>{applicant.firstName}</td>
                <td>{applicant.lastName}</td>
                <td>{applicant.email || 'N/A'}</td>
                <td>{applicant.phoneNumber || 'N/A'}</td>
                <td>{applicant.gender || 'N/A'}</td>
                <td>{applicant.education || 'N/A'}</td>
                <td>
                  {applicant.cv ? (
                    <a href={applicant.cv} target="_blank" rel="noopener noreferrer">
                      View CV
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td>{applicant.status}</td>
                <td>
                  <Button
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
      <div className="text-center mt-4">
        <Button variant="secondary" onClick={() => navigate(`/hr/jobs/${id}`)}>
          Back to Job Details
        </Button>
      </div>
    </Container>
  );
};

export default ApplicantsPage;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { getUsersByJobId } from '../../services/api';
import { toast } from 'react-toastify';
import { UPDATED_STATUS } from '../../utilities/constants';
import UserModal from '../../components/UserModal'
import '../../styles/Applicants.css'

const PassedApplicantsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await getUsersByJobId(id, UPDATED_STATUS);
        setApplicants(response.data);
      }
      catch (err) {
        const message = err.response?.data?.error || 'Failed to fetch passed applicants. Please try again.';
        console.error('Error fetching passed applicants:', err);
        setError(message);
        toast.error(message);
      }
      finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [id]);

  const handleViewDetails = (userId) => {
    setSelectedUserId(userId);
    setModalShow(true);
  };

  const handleStatusUpdate = (userId) => {
    setApplicants(applicants.filter(applicant => applicant.userId !== userId));
    setModalShow(false);
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;

  return (
    <Container className="applicants-table-container">
      <h2 className="applicants-heading">List of Interviewed Candidates</h2>

    {applicants.length === 0 ? (
      <Alert variant="info" className="no-applicants-alert">
        There are currently no applicants who have completed the interview. Please check back soon for updates.
      </Alert>
    ) : (
      <>
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
              <th className="applicants-table-header-cell">Total Score</th>
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
                <td className="applicant-cell">
                  {applicant.status
                    ? applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)
                    : 'N/A'}
                </td>
                <td className="applicant-cell">{applicant.total_score || 'N/A'}</td>
                <td className="applicant-cell">
                  <Button
                    variant="info"
                    size="sm"
                    className="view-details-button"
                    onClick={() => handleViewDetails(applicant.userId)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

          <UserModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            userId={selectedUserId}
            jobId={id}
            onStatusUpdate={handleStatusUpdate}
          />
        </>
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


};

export default PassedApplicantsPage;

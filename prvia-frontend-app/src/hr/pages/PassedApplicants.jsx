import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { getUsersByJobId } from '../../services/api';
import { toast } from 'react-toastify';
import { UPDATED_STATUS } from '../../utilities/constants';
import UserModal from '../../components/UserModal'

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
        console.log('Passed Applicants:', response.data);
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
    <Container className="mt-5">
      <h2 className="text-center mb-4">Passed Applicants</h2>
      {applicants.length === 0 ? (
        <Alert variant="info">No applicants has passed interviews for this job yet.</Alert>
      ) : (
        <>
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
                <th>Total Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map(applicant => (
                <tr key={applicant.userId}>
                  <td>{applicant.first_name}</td>
                  <td>{applicant.last_name}</td>
                  <td>{applicant.email || 'N/A'}</td>
                  <td>{applicant.phone || 'N/A'}</td>
                  <td>{applicant.gender || 'N/A'}</td>
                  <td>{applicant.degree || 'N/A'}</td>


                  <td>
                    {applicant.CV_FilePath ? (
                      <a href={`http://localhost:8000/${applicant.CV_FilePath}`} target="_blank" rel="noopener noreferrer">
                        View CV
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{applicant.status}</td>
                  <td>{applicant.total_score || 'N/A'}</td>

                  <td>
                    <Button
                      variant="info"
                      size="sm"
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
      <div className="text-center mt-4">
        <Button variant="secondary" onClick={() => navigate(`/hr/jobs/${id}`)}>
          Back to Job Details
        </Button>
      </div>
    </Container>
  );
};

export default PassedApplicantsPage;

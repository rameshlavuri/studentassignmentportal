import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

function StudentAssignmentForm() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [viewingSubmission, setViewingSubmission] = useState(null);
  const [editAnswer, setEditAnswer] = useState('');
  const navigate = useNavigate();

  // Use dynamic logic for student roll number in production
  const studentRollNo = localStorage.getItem('studentRollNo') || '24505a0510';

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/assignments');
      setAssignments(res.data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/submissions');
      setSubmissions(res.data.filter(sub => sub.rollNo === studentRollNo));
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  // --------- Edit logic -----------
  const openEditModal = (submission) => {
    setEditingSubmission(submission);
    setEditAnswer(submission.answer);
  };

  const closeEditModal = () => {
    setEditingSubmission(null);
    setEditAnswer('');
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/submissions/${editingSubmission._id}`, {
        ...editingSubmission,
        answer: editAnswer,
      });
      closeEditModal();
      fetchSubmissions();
      alert('Submission updated!');
    } catch (err) {
      alert('Failed to update submission.');
    }
  };

  // --------- View logic -----------
  const openViewModal = (submission) => {
    setViewingSubmission(submission);
  };

  const closeViewModal = () => {
    setViewingSubmission(null);
  };

  // --------- Render table ----------
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>📘 Student Assignments</h2>
      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}
      >
        <thead style={{ backgroundColor: '#40b02fff' }}>
          <tr>
            <th>S.No</th>
            <th>Assignment Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Submit</th>
            <th>Edit</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {assignments.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>No assignments found</td>
            </tr>
          ) : (
            assignments.map((a, index) => {
              const submission = submissions.find(sub =>
                (sub.assignmentId._id ? sub.assignmentId._id : sub.assignmentId) === a._id
              );
              const isSubmitted = !!submission;

              return (
                <tr key={a._id}>
                  <td>{index + 1}</td>
                  <td>{a.title}</td>
                  <td>{a.description}</td>
                  <td>
                    {isSubmitted ? (
                      <span style={{ color: 'green' }}>✅ Submitted</span>
                    ) : (
                      <span style={{ color: 'red' }}>❌ Unsubmitted</span>
                    )}
                  </td>
                  <td>
                    {isSubmitted ? (
                      <span style={{ color: 'gray' }}>Done</span>
                    ) : (
                      <button
                        onClick={() => navigate(`/submit/${a._id}`)}
                        style={{ padding: '4px 8px', cursor: 'pointer' }}
                      >
                        Submit
                      </button>
                    )}
                  </td>
                  <td>
                    {isSubmitted ? (
                      <button
                        onClick={() => openEditModal(submission)}
                        style={{ padding: '4px 8px' }}
                      >
                        Edit
                      </button>
                    ) : (
                      <span style={{ color: 'gray' }}>--</span>
                    )}
                  </td>
                  <td>
                    {isSubmitted ? (
                      <button
                        onClick={() => openViewModal(submission)}
                        style={{ padding: '4px 8px' }}
                      >
                        View
                      </button>
                    ) : (
                      <span style={{ color: 'gray' }}>--</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* -------- Edit Modal -------- */}
      {editingSubmission && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,.3)", display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999
          }}
        >
          <div style={{
            background: "white", padding: "24px", borderRadius: "8px", minWidth: "300px"
          }}>
            <h3>Edit Submission</h3>
            <textarea
              rows={8}
              value={editAnswer}
              onChange={e => setEditAnswer(e.target.value)}
              style={{ width: "100%", marginBottom: 16 }}
            />
            <div>
              <button onClick={handleEditSave} style={{ marginRight: 8, background: "#4CAF50", color: "white" }}>Save</button>
              <button onClick={closeEditModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* -------- View Modal -------- */}
      {viewingSubmission && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,.3)", display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999
          }}
        >
          <div style={{
            background: "white", padding: "24px", borderRadius: "8px", minWidth: "300px"
          }}>
            <h3>View Submission</h3>
            <p><b>Assignment:</b> {viewingSubmission.assignmentId.title || '--'}</p>
            <p><b>Answer:</b></p>
            <div style={{
              border: "1px solid #ccc", padding: "12px", borderRadius: "6px", minHeight: "70px"
            }}>
              {viewingSubmission.answer}
            </div>
            <button onClick={closeViewModal} style={{ marginTop: 16 }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentAssignmentForm;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminAssignmentForm.css';
import AdminAssignmentManage from './AdminAssignmentManage';

function AdminAssignmentForm() {
  const [showForm, setShowForm] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // Fetch assignments & submissions
  const fetchData = async () => {
    try {
      const [assignRes, submitRes] = await Promise.all([
        axios.get('http://localhost:5000/api/assignments'),
        axios.get('http://localhost:5000/api/submissions'),
      ]);
      setAssignments(assignRes.data);
      setSubmissions(submitRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add new assignment
  const handleAddAssignment = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/assignments', {
        title,
        description,
        dueDate,
      });
      alert('✅ Assignment added!');
      setShowForm(false);
      setTitle('');
      setDescription('');
      setDueDate('');
      fetchData();
    } catch (err) {
      alert('❌ Failed to add assignment');
    }
  };

  return (
    <div className="assignment-page">
      <div className="top-button" style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {!showForm && (
          <button onClick={() => setShowForm(true)}>Add New Assignment</button>
        )}
        <button onClick={() => setShowManage(true)}>Manage Assignments</button>
      </div>

      {/* Assignment Form */}
      {showForm && (
        <div className="form-container">
          <form onSubmit={handleAddAssignment}>
            <h2>Add New Assignment</h2>
            <input
              type="text"
              placeholder="Assignment Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Assignment Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <button type="submit">Submit</button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Student Submissions Table */}
      <h2>📄 Student Submissions</h2>
      <table className="table table-bordered table-hover">
        <thead className="table-dark text-center">
          <tr>
            <th>S.No</th>
            <th>Assignment Title</th>
            <th>Student Name</th>
            <th>Roll No</th>
            <th>Answer</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {submissions.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No submissions yet.
              </td>
            </tr>
          ) : (
            submissions.map((sub, index) => (
              <tr key={sub._id}>
                <td>{index + 1}</td>
                <td>{sub.assignmentId ? sub.assignmentId.title : 'Deleted Assignment'}</td>
                <td>{sub.name}</td>
                <td>{sub.rollNo}</td>
                <td>
                  {sub.answer
                    ? <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          alert(
                            `📘 Answer from ${sub.name || 'Unknown'}:\n\n${sub.answer}`
                          )
                        }
                      >View</button>
                    : <span style={{ color: 'gray' }}>No Answer</span>
                  }
                </td>
                <td>
                  {sub.submittedAt
                    ? new Date(sub.submittedAt).toLocaleString()
                    : '-'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Manage Assignments Modal */}
      {showManage && (
        <div className="modal-backdrop" style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.2)",
          zIndex: 99,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "white", padding: "35px", borderRadius: "10px",
            maxWidth: "700px", width: "80%", boxShadow: "0 4px 14px rgba(0,0,0,0.15)", position: "relative"
          }}>
            <button
              style={{
                position: "absolute", right: 10, top: 10, background: "#ccc",
                border: 0, borderRadius: "5px", padding: "3px 10px", cursor: "pointer"
              }}
              onClick={() => setShowManage(false)}
            >Close</button>
            <AdminAssignmentManage />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAssignmentForm;

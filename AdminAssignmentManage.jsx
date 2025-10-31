import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminAssignmentManage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit states
  const [editOpen, setEditOpen] = useState(false);
  const [editAssignment, setEditAssignment] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assignments");
      setAssignments(res.data);
    } catch (err) {
      alert("Error fetching assignments!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/assignments/${id}`);
      alert("Assignment deleted!");
      fetchAssignments();
    } catch (err) {
      alert("Error deleting assignment!");
    }
  };

  const openEdit = (assignment) => {
    setEditAssignment(assignment);
    setEditTitle(assignment.title);
    setEditDescription(assignment.description || '');
    setEditOpen(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/assignments/${editAssignment._id}`, {
        title: editTitle,
        description: editDescription,
      });
      alert('Assignment updated!');
      setEditOpen(false);
      setEditAssignment(null);
      fetchAssignments();
    } catch (err) {
      alert("Error updating assignment!");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>📚 Manage Assignments</h2>
      {loading ? (
        <p>Loading...</p>
      ) : assignments.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }} border={1}>
          <thead>
            <tr style={{ background: "#f2f2f2" }}>
              <th>Title</th>
              <th>Description</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a._id}>
                <td>{a.title}</td>
                <td>{a.description}</td>
                <td>
                  <button
                    style={{ background: "red", color: "white" }}
                    onClick={() => handleDelete(a._id)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    style={{ background: "orange", color: "white" }}
                    onClick={() => openEdit(a)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {editOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.3)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "#fff", borderRadius: "10px", padding: "28px", minWidth: "350px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.18)", position: "relative"
          }}>
            <button
              style={{
                position: "absolute", right: 10, top: 10, background: "#ccc",
                border: 0, borderRadius: "5px", padding: "3px 10px", cursor: "pointer"
              }}
              onClick={() => setEditOpen(false)}
            >Close</button>
            <form onSubmit={handleEditSave}>
              <h3>Edit Assignment</h3>
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                placeholder="Title"
                style={{ width: "100%", marginBottom: 12, padding: 8, fontSize: 15 }}
                required
              />
              <textarea
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                placeholder="Description"
                rows={3}
                style={{ width: "100%", marginBottom: 15, padding: 8, fontSize: 15 }}
                required
              />
              <button
                type="submit"
                style={{
                  background: "green", color: "white", padding: "7px 22px",
                  border: "none", borderRadius: "5px", fontSize: 16, cursor: "pointer"
                }}
              >Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAssignmentManage;

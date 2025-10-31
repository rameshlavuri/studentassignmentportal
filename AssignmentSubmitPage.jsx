import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

function AssignmentSubmitPage() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [answer, setAnswer] = useState("");
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/assignments/${id}`);
        setAssignment(res.data);
      } catch (err) {
        console.error("Error fetching assignment:", err);
        alert("❌ Failed to load assignment details.");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rollNo || !name || !answer.trim()) {
      alert("⚠️ Please fill in all fields before submitting.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/submissions", {
        assignmentId: id,
        rollNo,
        name,
        answer,
        submitted: true,
      });

      alert("✅ Assignment submitted successfully!");
       navigate("/student/assignments"); 
    } catch (err) {
      console.error("Error submitting assignment:", err);
      alert("❌ Submission failed. Try again.");
    }
  };

  if (loading) return <p>⏳ Loading assignment...</p>;
  if (!assignment) return <p>❌ Assignment not found.</p>;

  return (
    <div className="assignment-page" style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>📘 {assignment.title}</h2>
      <p style={{ marginBottom: "15px" }}>{assignment.description}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Roll Number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          required
        />
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          required
        />
        <textarea
          placeholder="Write your answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows="8"
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          required
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#c88942ff",
            color: "white",
            padding: "10px 16px",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Submit Assignment
        </button>
      </form>
    </div>
  );
}

export default AssignmentSubmitPage;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dash-table.css";

const MainDashboard = () => {
  const [user, setUser] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const navigate = useNavigate();
  const server_api = import.meta.env.VITE_SERVER_API;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) return navigate("/");

      try {
        const res = await fetch(`${server_api}users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
        else navigate("/");
      } catch (err) {
        console.error("Error fetching user:", err);
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (!user || user.role !== "manager") return;

    const fetchTeam = async () => {
      try {
        const res = await fetch(`${server_api}users/team`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) setTeamMembers(data);
      } catch (err) {
        console.error("Failed to load team members:", err);
      }
    };

    fetchTeam();
  }, [user]);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(
          `${server_api}feedback/history/${selectedUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) setFeedbacks(data);
      } catch (err) {
        console.error("Failed to fetch feedbacks:", err);
      }
    };

    fetchFeedbacks();
  }, [selectedUser]);

  useEffect(() => {
    if (!user || user.role !== "employee") return;

    const fetchMyFeedbacks = async () => {
      try {
        const res = await fetch(
          `${server_api}feedback/history/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) setMyFeedbacks(data);
      } catch (err) {
        console.error("Failed to fetch your feedbacks:", err);
      }
    };

    fetchMyFeedbacks();
  }, [user]);

  const handleAcknowledge = async (fid) => {
    try {
      const res = await fetch(
        `${server_api}feedback/ack/${fid}`,
        { 
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }
      );
      if (res.ok) {
        setMyFeedbacks((prev) =>
          prev.map((f) => (f.id === fid ? { ...f, acknowledged: 1 } : f))
        );
      }
    } catch (err) {
      console.error("Acknowledge error:", err);
    }
  };

  if (!user) return <p>Loading dashboard...</p>;

  return (
    <div className="glass-back">
      <h2>Welcome, {user.name}</h2>
      <h4>Role: {user.role}</h4>
      <h4>Team: {user.team}</h4>

      {user.role === "manager" ? (
        <div>
          <h3>Manager Dashboard</h3>

          <h4>Team Members</h4>
          {teamMembers.length === 0 ? (
            <p>No team members found.</p>
            ) : (
              <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member) => (
                    <tr key={member.id}>
                      <td>{member.name}</td>
                      <td>{member.username}</td>
                      <td>
                        <button onClick={() => setSelectedUser(member)}>View Feedback</button>
                        <button
                          onClick={() => navigate(`/create-feedback/${member.id}`)}
                          style={{ marginLeft: "8px" }}
                        >
                          Create Feedback
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}


          {selectedUser && (
            <div>
              <h4>Feedback for {selectedUser.name}</h4>
              {feedbacks.length === 0 ? (
                <p>No feedback yet.</p>
              ) : (
                <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th>Sentiment</th>
                      <th>Strengths</th>
                      <th>Improvements</th>
                      <th>Timestamp</th>
                      <th>Acknowledment</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.map((fb) => (
                      <tr key={fb.id}>
                        <td>{fb.sentiment}</td>
                        <td>{fb.strengths}</td>
                        <td>{fb.improvements}</td>
                        <td>{new Date(fb.timestamp).toLocaleString()}</td>
                        <td>
                          {fb.acknowledged ? (
                            <span className="ack-chk" style={{ backgroundColor: "green" }}>Acknowledged</span>
                          ) : (
                            <span className="ack-chk" style={{ backgroundColor: "red" }}>Not Acknowledged</span>
                          )}
                        </td>
                        <td>
                          <button onClick={() => navigate(`/edit-feedback/${fb.id}`)} style={{ marginTop: "6px" }}>
                            Edit Feedback
                          </button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h3>Employee Dashboard</h3>
            {myFeedbacks.length === 0 ? (
              <p>No feedback received yet.</p>
            ) : (
              <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr>
                    <th>Sentiment</th>
                    <th>Strengths</th>
                    <th>Improvements</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myFeedbacks.map((fb) => (
                    <tr key={fb.id}>
                      <td style={{color:"#333"}} >{fb.sentiment.toUpperCase()}</td>
                      <td>{fb.strengths}</td>
                      <td>{fb.improvements}</td>
                      <td>{new Date(fb.timestamp).toLocaleString()}</td>
                      <td>
                        {fb.acknowledged ? (
                          <em className="ack-chk">Acknowledged</em>
                        ) : (
                          <button onClick={() => handleAcknowledge(fb.id)}>
                            Acknowledge
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

        </div>
      )}
    </div>
  );
};

export default MainDashboard;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LongForm } from "../components/LongForm";
import PositionSelect from "../components/PositionSelect";
import "../App.css";
import "../styles/feedback-form.css";

const EditFeedback = () => {
  const { feedbackId } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [employeeName, setEmployeeName] = useState("Loading...");
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [sentiment, setSentiment] = useState("positive");
  const navigate = useNavigate();
  const server_api = import.meta.env.VITE_SERVER_API;

  useEffect(() => {
    const fetchFeedbackAndName = async () => {
      try {
        const res = await fetch(`${server_api}feedback/single/${feedbackId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Failed to fetch feedback");

        setFeedback(data);
        setStrengths(data.strengths);
        setImprovements(data.improvements);
        setSentiment(data.sentiment);

        const teamRes = await fetch(`${server_api}users/team`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        });

        const team = await teamRes.json();
        const found = team.find((emp) => emp.id === data.employeeId);
        setEmployeeName(found?.name || `Employee #${data.employeeId}`);
      } catch (err) {
        console.error("Error loading feedback:", err);
        alert("Something went wrong");
        navigate("/dashboard");
      }
    };

    fetchFeedbackAndName();
  }, [feedbackId, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${server_api}feedback/${feedbackId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify({ strengths, improvements, sentiment }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Feedback updated!");
        navigate("/dashboard");
      } else {
        alert(data.msg || "Update failed");
      }
    } catch (err) {
      console.error("Error updating feedback:", err);
      alert("Update failed");
    }
  };

  if (!feedback) return <p>Loading...</p>;

  const sentimentOptions = [
    { value: "positive", label: "Positive" },
    { value: "neutral", label: "Neutral" },
    { value: "negative", label: "Negative" },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      <form onSubmit={handleUpdate} className="fd-form">
        <h3>Edit Feedback for {employeeName}</h3>

        <LongForm
          label="Strengths"
          id="fd-long-st"
          value={strengths}
          lng={(e) => setStrengths(e.target.value)}
        />
        <LongForm
          label="Areas to Improve"
          id="fd-long-imp"
          value={improvements}
          lng={(e) => setImprovements(e.target.value)}
        />
        <PositionSelect
          label="Sentiment"
          id="fd-sentiment"
          value={sentiment}
          onChange={(e) => setSentiment(e.target.value)}
          optionList={sentimentOptions}
        />

        <button type="submit">Update Feedback</button>
      </form>
    </div>
  );
};

export default EditFeedback;

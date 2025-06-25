import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LongForm } from "../components/LongForm";
import PositionSelect from "../components/PositionSelect";
import "../App.css";
import "../styles/feedback-form.css";

export const FeedbackForm = () => {
  const { employeeId } = useParams(); // from route /create-feedback/:employeeId
  const navigate = useNavigate();
  const [employeeName, setEmployeeName] = useState("Loading...");
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [sentiment, setSentiment] = useState("positive");
  const server_api = import.meta.env.VITE_SERVER_API;

  // Get employee name using the employeeId param
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`${server_api}users/team`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        });

        const data = await res.json();
        const found = data.find((emp) => emp.id.toString() === employeeId);
        setEmployeeName(found?.name || "Employee");
      } catch (err) {
        console.error("Failed to fetch employee name:", err);
        setEmployeeName("Unknown Employee");
      }
    };

    fetchEmployee();
  }, [employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!strengths || !improvements || !sentiment) {
      return alert("Please fill in all fields.");
    }

    try {
      const res = await fetch(`${server_api}feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify({
          employeeId: parseInt(employeeId),
          strengths,
          improvements,
          sentiment,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Feedback submitted successfully");
        navigate("/dashboard");
      } else {
        alert(data.msg || data.error || "Error submitting feedback");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong.");
    }
  };

  const sentimentOptions = [
    { value: "positive", label: "Positive" },
    { value: "neutral", label: "Neutral" },
    { value: "negative", label: "Negative" },
  ];

  return (
    <div>
      <form onSubmit={handleSubmit} className="fd-form">
        <h3>Feedback for {employeeName}</h3>

        <LongForm
          label="Strengths"
          id="fd-long-st"
          lng={(e) => setStrengths(e.target.value)}
        />
        <LongForm
          label="Areas to Improve"
          id="fd-long-imp"
          lng={(e) => setImprovements(e.target.value)}
        />

        <PositionSelect
          label="Sentiment"
          id="fd-sentiment"
          onChange={(e) => setSentiment(e.target.value)}
          optionList={sentimentOptions}
        />

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackForm;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SingleInpForm from "../components/SingleInpForm";
import PositionSelect from "../components/PositionSelect";
import "../styles/login-form.css";

export const RegisterUser = () => {
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [userPswd, setUserPswd] = useState("");
  const [userPos, setUserPos] = useState("");
  const [teamName, setTeamName] = useState("");
  const navigate = useNavigate();
  const server_api = import.meta.env.VITE_SERVER_API;

  const posOptions = [
    { value: "manager", label: "Manager" },
    { value: "employee", label: "Employee" },
  ];

  const teamOptions = [
    { value: "dev", label: "Development" },
    { value: "ops", label: "Operations" },
    { value: "sec", label: "Security" },
    { value: "spt", label: "Support" },
  ];

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!userName || !userPswd || !userPos || !teamName) {
      return alert("Please fill all fields");
    }

    const payload = {
      username: userName,
      name: fullName || userName,
      password: userPswd,
      role: userPos,
      teamName: teamName,
    };

    try {
      const res = await fetch(`${server_api}users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Successfully created ${payload.role}`);
        navigate("/");
      } else {
        alert(`Error: ${data.msg || data.error}`);
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("Failed to create user");
    }
  };

  return (
    <form className="fd-form" onSubmit={handleRegister}>
      <h3>Register</h3>
      <SingleInpForm
        label="Username"
        type="text"
        name="lg-usr"
        id="lg-username"
        placeholder="Enter Username..."
        onChange={(e) => setUserName(e.target.value)}
      />
      <SingleInpForm
        label="Full Name"
        type="text"
        name="lg-name"
        id="lg-name"
        placeholder="Enter Full Name..."
        onChange={(e) => setFullName(e.target.value)}
      />
      <SingleInpForm
        label="Password"
        type="password"
        name="lg-ps"
        id="lg-passwd"
        placeholder="Enter Password..."
        onChange={(e) => setUserPswd(e.target.value)}
      />
      <PositionSelect
        label="Position"
        id="lg-pos"
        onChange={(e) => setUserPos(e.target.value)}
        optionList={posOptions}
      />
      <PositionSelect
        label="Team"
        id="lg-tm"
        onChange={(e) => setTeamName(e.target.value)}
        optionList={teamOptions}
      />
      <center className="fd-brk">
        <Link className="lg-link" to="/">
          Already have an account?
        </Link>
      </center>
      <button className="fd-brk" type="submit">
        Create User
      </button>
    </form>
  );
};

export default RegisterUser;

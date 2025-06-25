import { useState } from "react";
import SingleInpForm from "../components/SingleInpForm";
import PositionSelect from "../components/PositionSelect";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/login-form.css";

export const LoginForm = () => {
  const [userName, setUserName] = useState("");
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
    { value: "Development", label: "Development", teamid: "dev" },
    { value: "Operations", label: "Operations", teamid: "ops" },
    { value: "Security", label: "Security", teamid: "sec" },
    { value: "Support", label: "Support", teamid: "spt" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userName || !userPswd || !userPos || !teamName) {
      return alert("All fields are required.");
    }

    try {
      const response = await fetch(`${server_api}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userName,
          password: userPswd,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        localStorage.setItem("jwt_token", token);

        const decoded = jwtDecode(token);
        const role = decoded.role;
        const teamId = decoded.teamId;

        localStorage.setItem("user_team", teamId);
        localStorage.setItem("user_position", role);
        localStorage.setItem("user_name", userName);
        navigate("/dashboard")
      } else {
        alert(data.msg || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <form className="fd-form" onSubmit={handleLogin}>
      <h3>Login</h3>

      <SingleInpForm
        label={"Username"}
        type="text"
        name="lg-usr"
        id="lg-username"
        placeholder="Enter Username..."
        onChange={(e) => setUserName(e.target.value)}
      />

      <SingleInpForm
        label={"Password"}
        type="password"
        name="lg-ps"
        id="lg-passwd"
        placeholder="Enter Password..."
        onChange={(e) => setUserPswd(e.target.value)}
      />

      <PositionSelect
        label={"Position"}
        id="lg-pos"
        onChange={(e) => setUserPos(e.target.value)}
        optionList={posOptions}
      />

      <PositionSelect
        label={"Team"}
        id="lg-tm"
        onChange={(e) => setTeamName(e.target.value)}
        optionList={teamOptions}
      />

      <center className="fd-brk">
        <Link className="lg-link" to="/register">
          New User?
        </Link>
      </center>

      <button className="fd-brk" type="submit">
        Login
      </button>
    </form>
  );
};

export default LoginForm;

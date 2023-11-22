import axios from "axios";
import "./NewPassword.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Prop {
  email: string;
}

const NewPassword = ({ email }: Prop) => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);

  const handleNewPasswordChange = (e: any) => {
    setNewPassword(e.target.value);
    if (passwordMatch) {
      setPasswordMatch(e.target.value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e: any) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(newPassword === e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (newPassword === confirmPassword) {
      // Passwords match, you can implement your password change logic here
      try {
        await axios.put(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/user/update-password/${email}`,
          {
            password: newPassword,
          }
        );
        setLoading(false);
        alert("Password changed successfully!");
        navigate("/login");
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      setLoading(false);
      // Passwords don't match
      alert("Passwords do not match. Please try again.");
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      <div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </div>
        {!passwordMatch && (
          <p className="error-message">Passwords do not match.</p>
        )}
        <button className="newpassword-btn" onClick={handleSubmit}>
          {loading ? "Please wait.." : "Change Password"}
        </button>
      </div>
    </div>
  );
};

export default NewPassword;

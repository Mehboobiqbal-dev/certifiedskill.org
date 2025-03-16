// pages/SignUp.tsx

import { useState } from "react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/auth/register", { // use your API endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    alert(data.message);
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <div>
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default SignUp;

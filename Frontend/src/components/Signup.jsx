import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const userData = { name, email, company, role, password };

    try {
      const response = await fetch('https://team-task-tracker-pink.vercel.app/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Signup successful! You can now login.');
        setErrorMessage('');

        // Store userId in localStorage
        localStorage.setItem('userId', data.userId);

        setTimeout(() => navigate('/login'), 2000); // Redirect to login after success
      } else {
        setErrorMessage(data.message);
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Error occurred, please try again!');
      setSuccessMessage('');
    }
  };

  return (
    <div className="auth-container">
      <h1>Signup</h1>
      {errorMessage && <div className="error">{errorMessage}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Role (e.g., Manager, Developer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
}

export default Signup;

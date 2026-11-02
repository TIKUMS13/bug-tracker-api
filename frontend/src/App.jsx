import { useState } from 'react';
import BugList from './components/BugList';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return (
      <div className="app">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="user-header">
        <span>👤 {user.email} ({user.role})</span>
        <button onClick={handleLogout} className="btn-logout">Выйти</button>
      </div>
      <BugList user={user} />
    </div>
  );
}

export default App;
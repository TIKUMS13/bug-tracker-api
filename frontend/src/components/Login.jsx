import { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const url = isRegister 
        ? 'http://localhost:3000/auth/register' 
        : 'http://localhost:3000/auth/login';
      
      const response = await axios.post(url, { email, password });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegister ? '📝 Регистрация' : '🔐 Вход в Bug Tracker'}</h2>
      
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : (isRegister ? 'Зарегистрироваться' : 'Войти')}
        </button>
      </form>

      <p className="toggle-auth">
        {isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}
        <button type="button" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Войти' : 'Создать'}
        </button>
      </p>

      {!isRegister && (
        <div className="login-hint">
          <p>Тестовые аккаунты:</p>
          <p>👑 Admin: admin@bugtracker.com / admin123</p>
          <p>👤 User: user@bugtracker.com / user123</p>
        </div>
      )}
    </div>
  );
}

export default Login;
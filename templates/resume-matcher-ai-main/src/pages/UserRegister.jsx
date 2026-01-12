import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect to UserLogin which has flip-style register
const UserRegister = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/user/login', { state: { showRegister: true } });
  }, [navigate]);

  return null;
};

export default UserRegister;

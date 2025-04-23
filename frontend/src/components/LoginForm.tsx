import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
  error: string | null;
  switchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, error, switchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onLogin(username, password);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="card mt-4">
      <div className="card-header bg-primary text-white">
        Iniciar Sesión
      </div>
      <div className="card-body">
        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Nombre de Usuario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese su nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isLoading}
            className="w-100 mb-3"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
          
          <Button 
            variant="link" 
            onClick={switchToRegister}
            className="w-100"
          >
            ¿No tienes una cuenta? Regístrate
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm; 
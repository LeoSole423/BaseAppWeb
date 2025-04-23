import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';

interface RegisterFormProps {
  onRegister: (username: string, email: string, password: string) => Promise<boolean>;
  error: string | null;
  switchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, error, switchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden');
      return;
    }
    
    setIsLoading(true);
    setFormError(null);
    
    try {
      await onRegister(username, email, password);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="card mt-4">
      <div className="card-header bg-success text-white">
        Registrar Nuevo Usuario
      </div>
      <div className="card-body">
        {(error || formError) && (
          <Alert variant="danger">
            {error || formError}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Nombre de Usuario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Elija un nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese su correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Elija una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirme su contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          
          <Button 
            variant="success" 
            type="submit" 
            disabled={isLoading}
            className="w-100 mb-3"
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </Button>
          
          <Button 
            variant="link" 
            onClick={switchToLogin}
            className="w-100"
          >
            ¿Ya tienes una cuenta? Iniciar sesión
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm; 
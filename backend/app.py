from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import mysql.connector
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# Configuración JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'clave_secreta_por_defecto')
jwt = JWTManager(app)

# Configuración de la base de datos
db_config = {
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'user': os.getenv('MYSQL_USER', 'user'),
    'password': os.getenv('MYSQL_PASSWORD', 'password'),
    'database': os.getenv('MYSQL_DB', 'appdb')
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

def check_db_connection():
    try:
        conn = get_db_connection()
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute('SELECT 1')
            cursor.fetchone()
            cursor.close()
            conn.close()
            return True
    except Exception as e:
        print(f"Error de conexión a la base de datos: {e}")
        return False
    return False

def init_db():
    # Intentar conectar con reintentos
    max_retries = 10
    retry_interval = 5  # segundos
    
    for attempt in range(max_retries):
        try:
            # Intentar crear la base de datos si no existe
            conn = mysql.connector.connect(
                host=db_config['host'],
                user=db_config['user'],
                password=db_config['password']
            )
            
            cursor = conn.cursor()
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_config['database']}")
            cursor.close()
            conn.close()
            
            # Ahora intentar conectarse a la base de datos
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Crear tabla de usuarios si no existe
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
            cursor.close()
            conn.close()
            print("Base de datos inicializada correctamente")
            return True
        except Exception as e:
            print(f"Intento {attempt+1}/{max_retries}: Error al inicializar la base de datos: {e}")
            if attempt < max_retries - 1:
                print(f"Reintentando en {retry_interval} segundos...")
                import time
                time.sleep(retry_interval)
            else:
                print("Se alcanzó el número máximo de reintentos. No se pudo inicializar la base de datos.")
                return False

@app.route('/api/health', methods=['GET'])
def health_check():
    db_status = "conectada" if check_db_connection() else "desconectada"
    return jsonify({
        "status": "healthy",
        "servicios": {
            "backend": "funcionando",
            "database": db_status
        }
    })

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        
        # Validación básica
        if not username or not password or not email:
            return jsonify({"error": "Todos los campos son obligatorios"}), 400
        
        # Verificar conexión a la base de datos
        if not check_db_connection():
            return jsonify({"error": "No se puede conectar a la base de datos. Por favor, inténtelo más tarde."}), 503
        
        # Encriptar contraseña
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            # Insertar usuario
            cursor.execute(
                "INSERT INTO usuarios (username, password, email) VALUES (%s, %s, %s)",
                (username, hashed_password, email)
            )
            conn.commit()
            return jsonify({"message": "Usuario registrado exitosamente"}), 201
        except mysql.connector.Error as err:
            if err.errno == 1062:  # Error de duplicidad
                return jsonify({"error": "El nombre de usuario o correo ya existe"}), 409
            else:
                return jsonify({"error": f"Error de base de datos: {err}"}), 500
        finally:
            cursor.close()
            conn.close()
            
    except Exception as e:
        return jsonify({"error": f"Error al registrar usuario: {str(e)}"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        # Validación básica
        if not username or not password:
            return jsonify({"error": "Usuario y contraseña son obligatorios"}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Buscar usuario
        cursor.execute("SELECT * FROM usuarios WHERE username = %s", (username,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not user or not bcrypt.check_password_hash(user['password'], password):
            return jsonify({"error": "Credenciales inválidas"}), 401
        
        # Convertir el ID a cadena para JWT
        user_id = str(user['id'])
        
        # Generar token JWT
        access_token = create_access_token(identity=user_id)
        
        return jsonify({
            "message": "Inicio de sesión exitoso",
            "token": access_token,
            "user_id": user['id'],
            "username": user['username']
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Error al iniciar sesión: {str(e)}"}), 500

@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user_profile():
    try:
        # Obtener el ID del usuario del token JWT
        user_id = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT id, username, email, created_at FROM usuarios WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
            
        return jsonify(user), 200
        
    except Exception as e:
        return jsonify({"error": f"Error al obtener perfil: {str(e)}"}), 500

# Inicialización de la base de datos al iniciar la aplicación
init_db()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 
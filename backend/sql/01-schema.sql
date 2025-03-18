

-- == USUARIOS == --
CREATE TABLE IF NOT EXISTS usuario(
    id_user SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT NOW(),
    avatar VARCHAR(100) DEFAULT 'default.png',
    rol VARCHAR(20) DEFAULT 'user',
    peso DECIMAL(6,2) CHECK (peso >= 0), -- Evitar valores negativos
    altura DECIMAL(6,2) CHECK (altura >= 0), -- Evitar valores negativos
    edad INT CHECK (edad >= 0), -- Evitar valores negativos
    sexo VARCHAR(1) CHECK (sexo IN ('M', 'F')), -- Solo permitir M o F
    CONSTRAINT check_rol CHECK (rol IN ('user', 'admin'))
    
);

-- == DIETA == --
CREATE TABLE IF NOT EXISTS dieta(
    id_dieta SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    nombre_dieta VARCHAR(50) NOT NULL,
    descripcion TEXT,
    tipo_dieta VARCHAR(20) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    fecha_inicio DATE NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES usuario(id_user)
        ON DELETE CASCADE
);

-- == ALIMENTO == --
CREATE TABLE IF NOT EXISTS alimento(
    id_alimento SERIAL PRIMARY KEY,
    nombre_alimento VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    supermercado VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0), -- Evitar precios negativos
    calorias INT NOT NULL CHECK (calorias >= 0), -- Evitar valores negativos
    CONSTRAINT unique_alimento_supermercado UNIQUE (nombre_alimento, supermercado)
);

-- Agregar última actualización después de la creación de la tabla
ALTER TABLE alimento ADD ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP;


-- == NUTRIENTE == --
CREATE TABLE IF NOT EXISTS nutriente(
    id_nutriente SERIAL PRIMARY KEY,
    nombre_nutriente VARCHAR(50) NOT NULL UNIQUE, -- Evita nombres duplicados
    unidad VARCHAR(20) NOT NULL
);

-- == ALIMENTO_NUTRIENTE == --
CREATE TABLE IF NOT EXISTS alimento_nutriente(
    id_alimento INT NOT NULL,
    id_nutriente INT NOT NULL,
    cantidad DECIMAL(6,2) CHECK (cantidad >= 0), -- No permitir cantidades negativas
    PRIMARY KEY (id_alimento, id_nutriente),
    FOREIGN KEY (id_alimento) REFERENCES alimento(id_alimento) ON DELETE CASCADE,
    FOREIGN KEY (id_nutriente) REFERENCES nutriente(id_nutriente) ON DELETE CASCADE
);

-- == DIETA_ALIMENTO == --
CREATE TABLE IF NOT EXISTS dieta_alimento(
    id_dieta INT NOT NULL,
    id_alimento INT NOT NULL,
    dia VARCHAR(10) NOT NULL CHECK (dia IN ('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')), -- Compatible con MySQL/PostgreSQL
    comida VARCHAR(10) NOT NULL CHECK (comida IN ('Desayuno', 'Almuerzo', 'Cena', 'Merienda')), -- Compatible con MySQL/PostgreSQL
    cantidad DECIMAL(6,2) CHECK (cantidad >= 0), -- Evitar valores negativos
    PRIMARY KEY (id_dieta, id_alimento, dia, comida),
    FOREIGN KEY (id_dieta) REFERENCES dieta(id_dieta) ON DELETE CASCADE,
    FOREIGN KEY (id_alimento) REFERENCES alimento(id_alimento) ON DELETE CASCADE
);

-- == RECETAS == --
CREATE TABLE IF NOT EXISTS receta(
    id_receta SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    instrucciones TEXT,
    tiempo_preparacion INT CHECK (tiempo_preparacion >= 0), -- en minutos
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES usuario(id_user) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS receta_alimento(
    id_receta INT NOT NULL,
    id_alimento INT NOT NULL,
    cantidad DECIMAL(6,2) CHECK (cantidad >= 0),
    unidad VARCHAR(20),
    PRIMARY KEY (id_receta, id_alimento),
    FOREIGN KEY (id_receta) REFERENCES receta(id_receta) ON DELETE CASCADE,
    FOREIGN KEY (id_alimento) REFERENCES alimento(id_alimento) ON DELETE CASCADE
);

-- == HISTORIAL DE CONSUMO == --
CREATE TABLE IF NOT EXISTS historial_consumo(
    id_consumo SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    id_alimento INT NOT NULL,
    fecha TIMESTAMP DEFAULT NOW(),
    comida VARCHAR(10) NOT NULL CHECK (comida IN ('Desayuno', 'Almuerzo', 'Cena', 'Merienda')),
    cantidad DECIMAL(6,2) CHECK (cantidad >= 0),
    FOREIGN KEY (id_user) REFERENCES usuario(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_alimento) REFERENCES alimento(id_alimento) ON DELETE CASCADE
);

-- == LISTA DE COMPRA == --
CREATE TABLE IF NOT EXISTS lista_compra(
    id_lista SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    estado VARCHAR(10) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Comprado', 'Cancelado')),
    FOREIGN KEY (id_user) REFERENCES usuario(id_user) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lista_compra_alimento(
    id_lista INT NOT NULL,
    id_alimento INT NOT NULL,
    cantidad DECIMAL(6,2) CHECK (cantidad >= 0),
    FOREIGN KEY (id_lista) REFERENCES lista_compra(id_lista) ON DELETE CASCADE,
    FOREIGN KEY (id_alimento) REFERENCES alimento(id_alimento) ON DELETE CASCADE
);


-- == TRIGGERS == --
CREATE OR REPLACE TRIGGER trigger_update_ultima_actualizacion
BEFORE UPDATE ON alimento
FOR EACH ROW
BEGIN
    :NEW.ultima_actualizacion := SYSDATE;
END;
/

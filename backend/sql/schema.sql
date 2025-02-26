-- CREACION DE TABLAS --


-- == USUARIOS == --
CREATE TABLE IF NOT EXISTS usuario(
    id_user SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT NOW(),
    avatar VARCHAR(100) DEFAULT 'default.png'
    rol VARCHAR(20) DEFAULT 'user'
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
        REFFERENCES usuario(id_user)
        ON DELETE CASCADE
);

-- == ALIMENTO == --
CREATE TABLE IF NOT EXISTS alimento(
    id_alimento SERIAL PRIMARY KEY,
    nombre_alimento VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    calorias INT NOT NULL,
);

-- == NUTRIENTE == --
CREATE TABLE IF NOT EXISTS nutriente(
    id_nutriente SERIAL PRIMARY KEY,
    nombre_nutriente VARCHAR(50) NOT NULL,
    unidad VARCHAR(20) NOT NULL,
);

-- == ALIMENTO_NUTRIENTE == --
CREATE TABLE IF NOT EXISTS alimento_nutriente(
    id_alimento INT NOT NULL,
    id_nutriente INT NOT NULL,
    cantidad DECIMAL(6,2),
    PRIMARY KEY (id_alimento, id_nutriente),
    FOREIGN KEY (id_alimento) REFFERENCES alimento(id_alimento),
    FOREIGN KEY (id_nutriente) REFFERENCES nutriente(id_nutriente)
);

-- == DIETA_ALIMENTO == --
CREATE TABLE IF NOT EXISTS dieta_alimento(
    id_dieta INT NOT NULL,
    id_alimento INT NOT NULL,
    dia VARCHAR(50),
    comida VARCHAR(50),
    cantidad DECIMAL(6,2),
    PRIMARY KEY (id_dieta, id_alimento, dia, comida),
    FOREIGN KEY (id_dieta) REFFERENCES dieta(id_dieta),
    FOREIGN KEY (id_alimento) REFFERENCES alimento(id_alimento)
);
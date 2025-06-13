-- Tabla para los nodos del organigrama
CREATE TABLE IF NOT EXISTS organigrama_nodos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL COMMENT 'Título del cargo',
    nombre VARCHAR(100) NOT NULL COMMENT 'Nombre de la persona en el cargo',
    padre_id BIGINT NULL COMMENT 'ID del nodo padre (NULL para el nodo raíz)',
    es_raiz BOOLEAN DEFAULT FALSE COMMENT 'Indica si es el nodo raíz',
    orden INT DEFAULT 0 COMMENT 'Orden de visualización entre hermanos',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE COMMENT 'Indica si el nodo está activo',
    empresa_id BIGINT NOT NULL COMMENT 'ID de la empresa a la que pertenece el organigrama',
    FOREIGN KEY (padre_id) REFERENCES organigrama_nodos(id) ON DELETE RESTRICT,
    INDEX idx_padre (padre_id),
    INDEX idx_empresa (empresa_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para el historial de cambios
CREATE TABLE IF NOT EXISTS organigrama_historial (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nodo_id BIGINT NOT NULL,
    tipo_cambio ENUM('CREACION', 'EDICION', 'ELIMINACION') NOT NULL,
    titulo_anterior VARCHAR(100),
    nombre_anterior VARCHAR(100),
    padre_id_anterior BIGINT,
    titulo_nuevo VARCHAR(100),
    nombre_nuevo VARCHAR(100),
    padre_id_nuevo BIGINT,
    usuario_id BIGINT NOT NULL COMMENT 'ID del usuario que realizó el cambio',
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nodo_id) REFERENCES organigrama_nodos(id),
    INDEX idx_nodo (nodo_id),
    INDEX idx_fecha (fecha_cambio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para metadatos adicionales de los nodos
CREATE TABLE IF NOT EXISTS organigrama_metadatos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nodo_id BIGINT NOT NULL,
    clave VARCHAR(50) NOT NULL COMMENT 'Nombre del campo adicional',
    valor TEXT NOT NULL COMMENT 'Valor del campo adicional',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (nodo_id) REFERENCES organigrama_nodos(id) ON DELETE CASCADE,
    UNIQUE KEY uk_nodo_clave (nodo_id, clave),
    INDEX idx_nodo (nodo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 
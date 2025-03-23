---

## **Reportes Detallados**

### 1. **Inventario Completo de Libros**

**Propósito:** Control físico y gestión de stock  
**SQL:**
```sql
SELECT 
  id AS "ID Libro",
  nombre AS "Nombre",
  categoria AS "Categoría",
  cantidad AS "Cantidad",
  estado AS "Estado",
  creadoEn AS "Fecha Ingreso"
FROM sistema-bibliotecario_libro
WHERE DATE_TRUNC('month', creadoEn) = '2024-04-01';
```
| ID | Nombre | Categoría | Cantidad | Estado
|-----|----------------------------|-------------|----------|----------------
| 101 | Cien años de soledad | Literatura | 8 | Disponible |
| 102 | Física Cuántica | Ciencia | 3 | Mantenimiento |
| 105 | Historia de Roma | Historia | 6 | Prestado |

---

### 2. **Multas Pendientes**
**SQL:**
```sql
SELECT 
  m.id AS "Multa ID",
  u.email AS "Usuario",
  l.nombre AS "Libro",
  m.monto AS "Monto",
  (CURRENT_DATE - p.fechaVencimiento) AS "Días Retraso"
FROM sistema-bibliotecario_multa m
JOIN sistema-bibliotecario_prestamo p ON m.prestamoId = p.id
JOIN sistema-bibliotecario_reservacion r ON p.reservaId = r.id
JOIN sistema-bibliotecario_libro l ON r.libroId = l.id
JOIN sistema-bibliotecario_usuario u ON m.usuarioId = u.id
WHERE m.estado = 'pendiente'
  AND DATE_TRUNC('month', m.creadoEn) = '2024-03-01';
```
**Propósito:** Seguimiento de deudas activas  
| Multa ID | Usuario | Libro | Monto | Días Retraso |  
|----------|-----------------|---------------|--------|--------------|  
| 3321 | maria@uni.edu | El Principito | $12.50 | 23 |  
| 3323 | ana@mail.net | Dune | $9.75 | 15 |

---

### 3. **Historial de Préstamos por Usuario**
**Propósito:** Análisis de comportamiento individual  
**SQL:**
```sql
SELECT 
  p.id AS "Préstamo ID",
  l.nombre AS "Libro",
  p.fechaPrestamo AS "Fecha Préstamo",
  p.estado AS "Estado",
  (p.fechaDevolucion - p.fechaPrestamo) AS "Días Utilizados"
FROM sistema-bibliotecario_prestamo p
JOIN sistema-bibliotecario_reservacion r ON p.reservaId = r.id
JOIN sistema-bibliotecario_libro l ON r.libroId = l.id
WHERE r.usuarioId = 'USR-8891'
  AND DATE_TRUNC('month', p.fechaPrestamo) = '2024-03-01';
```
| Préstamo ID | Libro | Fecha Préstamo | Estado |  
|-------------|--------------------|----------------|----------|  
| 5621 | Código Da Vinci | 2024-03-10 | Vencido |  
| 5645 | Breve Historia... | 2024-03-25 | Devuelto |

---

### 4. **Registro de Movimientos de Libros**

**Propósito:** Trazabilidad completa de ejemplares  

**SQL:**
```sql
SELECT 
  r.fechaInicio AS "Fecha",
  'Reserva' AS "Tipo",
  u.email AS "Usuario",
  CONCAT('Duración: ', (r.fechaFin - r.fechaInicio), ' días') AS "Detalle"
FROM sistema-bibliotecario_reservacion r
JOIN sistema-bibliotecario_usuario u ON r.usuarioId = u.id
WHERE r.libroId = 101
  AND DATE_TRUNC('year', r.fechaInicio) = '2023-01-01'
UNION ALL
SELECT 
  p.fechaPrestamo,
  'Préstamo',
  u.email,
  CONCAT('Responsable: ', (SELECT email FROM sistema-bibliotecario_usuario WHERE id = p.personalId))
FROM sistema-bibliotecario_prestamo p
JOIN sistema-bibliotecario_reservacion r ON p.reservaId = r.id
WHERE r.libroId = 101;
```


| Fecha | Tipo Movimiento | Usuario |
|-------------|-----------------|-----------------|
| 2023-12-03 | Préstamo | luis@mail.com |
| 2023-12-17 | Devolución | luis@mail.com |

---

## **Reportes Sintetizados**

_(Métricas estratégicas para toma de decisiones)_

### 1. **Tendencias de Préstamos**

**Visualización:** Gráfico de líneas con comparativo anual  
**SQL:**
```sql
SELECT 
  TO_CHAR(DATE_TRUNC('month', p.fechaPrestamo), 'Month') AS "Mes",
  COUNT(*) FILTER (WHERE EXTRACT(year FROM p.fechaPrestamo) = 2023) AS "2023",
  COUNT(*) FILTER (WHERE EXTRACT(year FROM p.fechaPrestamo) = 2022) AS "2022",
  ROUND(
    ((COUNT(*) FILTER (WHERE EXTRACT(year FROM p.fechaPrestamo) = 2023) * 100.0 / 
      NULLIF(COUNT(*) FILTER (WHERE EXTRACT(year FROM p.fechaPrestamo) = 2022), 0)) - 100),
    1
  ) AS "% Crecimiento"
FROM sistema-bibliotecario_prestamo p
GROUP BY DATE_TRUNC('month', p.fechaPrestamo)
ORDER BY DATE_TRUNC('month', p.fechaPrestamo);
```
| Mes | 2023 | 2022 | % Crecimiento |  
|-----------|-------|-------|---------------|  
| Enero | 420 | 380 | +10.5% |  
| Diciembre | 615 | 550 | +11.8% |

---

### 2. **Estadísticas por Categoría**

**Visualización:** Mapa de calor por franjas horarias  

**SQL:**
```sql
WITH prestamos_por_hora AS (
  SELECT 
    l.categoria,
    CASE 
      WHEN EXTRACT(hour FROM p.fechaPrestamo) BETWEEN 8 AND 11 THEN 'Mañana'
      WHEN EXTRACT(hour FROM p.fechaPrestamo) BETWEEN 12 AND 17 THEN 'Tarde'
      WHEN EXTRACT(hour FROM p.fechaPrestamo) BETWEEN 18 AND 21 THEN 'Noche'
    END AS franja_horaria,
    COUNT(*) as cantidad
  FROM sistema-bibliotecario_prestamo p
  JOIN sistema-bibliotecario_reservacion r ON p.reservaId = r.id
  JOIN sistema-bibliotecario_libro l ON r.libroId = l.id
  WHERE DATE_TRUNC('quarter', p.fechaPrestamo) = '2024-01-01'
  GROUP BY l.categoria, franja_horaria
)
SELECT 
  categoria AS "Categoría",
  SUM(CASE WHEN franja_horaria = 'Mañana' THEN cantidad ELSE 0 END) AS "Mañana (8-12h)",
  SUM(CASE WHEN franja_horaria = 'Tarde' THEN cantidad ELSE 0 END) AS "Tarde (12-18h)",
  SUM(CASE WHEN franja_horaria = 'Noche' THEN cantidad ELSE 0 END) AS "Noche (18-22h)"
FROM prestamos_por_hora
GROUP BY categoria;
```

| Categoría | Mañana (8-12h) | Tarde (12-18h) | Noche (18-22h) |  
|-------------|----------------|----------------|----------------|  
| Tecnología | 120 | 85 | 45 |  
| Literatura | 95 | 110 | 30 |

---

### 3. **Rendimiento en Devoluciones**

**SQL:**
```sql
SELECT 
  u.nombre AS "Responsable",
  COUNT(p.id) AS "Préstamos",
  SUM(CASE WHEN p.fechaDevolucion <= p.fechaVencimiento THEN 1 ELSE 0 END) AS "Dev. a Tiempo",
  ROUND(
    (SUM(CASE WHEN p.fechaDevolucion <= p.fechaVencimiento THEN 1 ELSE 0 END) * 100.0 / 
    COUNT(p.id)),
    1
  ) AS "% Eficiencia"
FROM sistema-bibliotecario_prestamo p
JOIN sistema-bibliotecario_usuario u ON p.personalId = u.id
WHERE DATE_TRUNC('month', p.fechaPrestamo) = '2024-03-01'
GROUP BY u.nombre
ORDER BY "% Eficiencia" DESC;
```

**Métrica:** Eficiencia operativa por bibliotecario  
| Responsable | Préstamos | Dev. a Tiempo | % Eficiencia |  
|---------------|-----------|---------------|--------------|  
| Pedro Sánchez | 85 | 82 | 96.5% |  
| Ana Torres | 120 | 115 | 95.8% |

---

### 4. **Distribución de Multas**

**Visualización:** Treemap por categoría de libro  

**SQL:**
```sql
SELECT 
  l.categoria AS "Categoría",
  SUM(m.monto) AS "Total Multas",
  ROUND(AVG(m.monto), 2) AS "Monto Promedio"
FROM sistema-bibliotecario_multa m
JOIN sistema-bibliotecario_prestamo p ON m.prestamoId = p.id
JOIN sistema-bibliotecario_reservacion r ON p.reservaId = r.id
JOIN sistema-bibliotecario_libro l ON r.libroId = l.id
WHERE DATE_TRUNC('year', m.creadoEn) = '2023-01-01'
GROUP BY l.categoria
ORDER BY "Total Multas" DESC;
```

| Categoría | Total Multas | Monto Promedio |  
|-------------|--------------|----------------|  
| Ciencia | $1,200.50 | $18.75 |  
| Literatura | $980.00 | $12.25 |

---

## **Reportes por Excepción**

### 2. **Top 3 Usuarios Sin Multas (Último Año)**

**Criterio:** Activos con ≥20 reservas y 0 multas  
**SQL:**

```sql
import { Construct, IConstruct } from 'constructs';
SELECT u.id, COUNT(r.id) AS reservas
FROM usuario u
LEFT JOIN multa m ON u.id = m.usuario_id
WHERE m.id IS NULL
  AND DATE_TRUNC('year', r.creadoEn) = DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '1 YEAR'
GROUP BY u.id
ORDER BY reservas DESC
LIMIT 3
```

| Usuario           | Reservas | Última Actividad |
| ----------------- | -------- | ---------------- |
| sofia@tech.com    | 34       | 2024-04-10       |
| raul@invest.com   | 29       | 2024-03-28       |
| manuel@correo.com | 22       | 2024-03-28       |

---

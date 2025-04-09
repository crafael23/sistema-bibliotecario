# Sistema de Reportes de Biblioteca

## Estructura de Directorios

El sistema de reportes está organizado en tres categorías principales:

1. **Reportes Detallados** (`/detallados`): Proporcionan datos completos y detallados sobre aspectos específicos del sistema.
2. **Reportes Sintetizados** (`/sintetizados`): Muestran información agregada y análisis estadísticos.
3. **Reportes de Excepción** (`/excepcion`): Destacan casos particulares que requieren atención o reconocimiento.

## Componentes Comunes

- `MonthFilter`: Permite filtrar reportes por mes y año.
- `Pagination`: Implementa paginación para todos los reportes con conjuntos de datos grandes.

## Reportes Detallados

### Inventario (`/detallados/inventario`)
- Muestra listado completo de libros en el sistema
- Incluye datos de estado y cantidad
- Permite filtrado por mes y paginación

### Multas (`/detallados/multas`) 
- Muestra usuarios con multas activas
- Incluye montos y fechas de vencimiento
- Permite filtrado por mes y paginación

### Historial (`/detallados/historial`)
- Muestra historial de préstamos por usuario
- Incluye selector de usuario
- Permite filtrado por mes y paginación

### Movimientos (`/detallados/movimientos`)
- Registra entradas y salidas de libros
- Muestra detalles de cada movimiento
- Permite filtrado por mes y paginación

## Reportes Sintetizados

### Tendencias (`/sintetizados/tendencias`)
- Análisis de tendencias de préstamos por período
- Gráficos comparativos entre años
- Selector de años para comparar

### Categorías (`/sintetizados/categorias`)
- Estadísticas de préstamos por categoría de libro
- Visualización de datos por franjas horarias
- Permite filtrado por mes

### Rendimiento de Devoluciones (`/sintetizados/rendimiento-devoluciones`)
- Análisis de tiempos de devolución
- Eficiencia de personal
- Permite filtrado por mes

### Distribución de Multas (`/sintetizados/distribucion-multas`)
- Análisis de multas por tipo y monto
- Distribución por categorías
- Permite filtrado por mes

## Reportes de Excepción

### Usuarios Sin Multas (`/excepcion/usuarios-sin-multas`)
- Destaca usuarios modelo sin multas
- Muestra estadísticas de uso
- Ofrece recomendaciones para programas de recompensa

## Implementación

Cada reporte se implementa siguiendo una estructura común:

1. **Page Component**: Componente principal que maneja el enrutamiento y la presentación
2. **Data Fetching**: Función que obtiene datos de la base de datos
3. **Filtering**: Componentes para filtrar datos por fecha/mes
4. **Pagination**: Manejo de conjuntos de datos grandes
5. **Visualización**: Tablas, gráficos y elementos visuales para presentar los datos

## Funcionalidad

- Todos los reportes detallados y sintetizados incluyen filtros por mes.
- Todos los reportes detallados y sintetizados incluyen paginación.
- Los reportes de excepción no requieren paginación ni filtrado mensual, ya que muestran datos específicos.
- Todos los reportes pueden exportarse a Excel.
- Algunos reportes permiten exportación a PDF.

## Consultas a la Base de Datos

Las consultas principales están implementadas en `src/server/db/report-queries.ts`. Estas funciones proporcionan los datos necesarios para cada reporte con soporte para filtrado y paginación.

## Rutas de Navegación

La página principal de reportes (`/admin/reportes/page.tsx`) proporciona acceso a todos los reportes. Cada tarjeta enlaza con el reporte correspondiente siguiendo la estructura de carpetas. 
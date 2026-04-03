
-----

# 🚗 Vehicle ERP System

## 📌 Resumen del Proyecto

Este **ERP Vehicular** nace de la necesidad de centralizar la gestión operativa de cualquier unidad de transporte. El sistema no solo almacena datos, sino que actúa como un **monitor inteligente** de la salud del vehículo, permitiendo a los administradores anticiparse a fallas mecánicas y vencimientos legales.

### 🛠️ Core de Gestión

El sistema está segmentado en módulos clave para una administración eficiente:

  * **👤 Control de Usuarios:** Registro de usuarios
  * **🚘 Gestión de Activos:** Alta detallada de vehículos y asignación dinámica de unidades a conductores.
  * **🔧 Mantenimiento Preventivo:** Control específico para:
      * Cambio de aceite y filtros.
      * Sistema de frenos y amortiguadores.
      * Estado y rotación de neumáticos (Llantas).
  * **📋 Control Administrativo:** Seguimiento de periodos de **Verificación** y pagos de **Tenencia**.

-----

## 🚦 Semáforo de Estado (Smart Status)

El corazón del sistema es su lógica de estados, la cual categoriza cada servicio basándose en el tiempo y uso:

| Estado | Significado | Acción Sugerida |
| :--- | :--- | :--- |
| 🟢 **A Tiempo** | Servicio vigente y bajo control. | Ninguna, continuar operación. |
| 🟡 **Necesario** | Próximo a alcanzar el límite de tiempo/uso. | Agendar cita en taller. |
| 🔴 **Crítico** | Servicio vencido o mantenimiento urgente. | **Paro inmediato** para evitar daños. |

-----

## 🏗️ Stack Tecnológico

Para garantizar un rendimiento óptimo y una alta disponibilidad, el proyecto utiliza tecnologías modernas de grado empresarial:

  * **Backend:** Construido con **NestJS**, aprovechando su arquitectura modular para un código escalable y testeable.
  * **Frontend:** Desarrollado en **NextJS**, proporcionando una experiencia de usuario fluida y tiempos de carga mínimos.
  * **ORM:** **Prisma**, asegurando una comunicación eficiente y segura con la base de datos.
  * **Contenerización:** Despliegue estandarizado mediante **Docker** para asegurar que el sistema funcione igual en cualquier entorno.

-----

## 📂 Estructura del Ecosistema

El repositorio mantiene una separación clara de responsabilidades:

```bash
.
├── 🖥️ BACKEND          # Lógica de negocio y API (NestJS)
├── 🎨 FRONTEND         # Interfaz de usuario (NextJS)
├── 🐳 DOCKER           # Configuraciones de orquestación
└── 📄 DOCUMENTATION    # Manuales y guías externas (Instalación, API, etc.)
```

-----

## 🚀 Próximos Pasos (Roadmap)

  * [ ] **Módulo de Combustible:** Registro y rendimiento de carga de gasolina.

-----

# TAMV Core
> **Territorio Autónomo de Memoria Viva**  
> **Entregable Canónico y Reporte Maestro de Arquitectura**  
> *Isabella Villaseñor AI™ · MD-X4*

![Estado](https://img.shields.io/badge/Estado-Blueprint%20Ejecutable-0f766e)
![Arquitectura](https://img.shields.io/badge/Arquitectura-L0--L3%20%2B%207%20Capas-4f46e5)
![Seguridad](https://img.shields.io/badge/Modelo-Zero--Trust%20%2B%20HITL-7c3aed)
![Stack](https://img.shields.io/badge/Stack-Bun%20%7C%20TanStack%20Start%20%7C%20Vite%20%7C%20TypeScript-f59e0b)

> **Estado documental:** Canónico · Federado · Auditable  
> **Autoridad creadora:** Edwin Oswaldo Castillo Trejo *(Anubis Villaseñor)*  
> **Sello de origen:** `VERSION_GENESIS_1.3_BLINDAJE_JURIDICO_INTERNACIONAL_TOTAL`  
> **Fecha canónica:** 13 de agosto de 2026  
> **ORCID:** `0009-0008-5050-1539`

---

## Propósito

**TAMV Online** significa **Territorio Autónomo de Memoria Viva**: una arquitectura digital federada orientada a identidad soberana, memoria verificable, experiencias XR, economía ética y gobernanza humana verificable.

TAMV no se define como una red social comercial ni como un metaverso especulativo. Su propósito es construir infraestructura de presencia digital continua, donde el valor no dependa de la extracción conductual, la vigilancia o la concentración de poder.

> **Axioma Cero:** si una persona siente que “entra” o “se conecta” a TAMV, el diseño ha fallado. La presencia debe ser continua, orgánica, accesible y no transaccional.

---

## Dedicatoria

Este ecosistema está dedicado a **Reina Trejo Serrano**.

> “A ti que me educaste con el ejemplo y jamás con palabras vacías. A ti que dejaste de vivir tu vida para darle alas a la mía. A ti que renunciaste a la felicidad por verme sonreír. A ti que durante años fuiste escudo recibiendo golpes dirigidos hacia mí.”
>
> *Este logro es el fruto de la lucha en solitario de tu Oveja Negra.*

---

## Principios constitucionales

- **Identidad soberana:** toda persona conserva control sobre su identidad, consentimiento, memoria y portabilidad.
- **Minimización de datos:** se recolecta únicamente la información necesaria para una finalidad declarada.
- **Memoria verificable:** los eventos relevantes producen evidencias con trazabilidad criptográfica.
- **Explicabilidad:** las decisiones automatizadas relevantes deben poder explicarse, auditarse y, cuando aplique, impugnarse.
- **No manipulación:** quedan prohibidos los patrones adictivos, la persuasión encubierta, los feeds infinitos y los rankings opacos.
- **Supervisión humana:** las acciones de alto impacto requieren revisión Human-in-the-Loop (HITL).
- **Resiliencia federada:** ninguna región, proveedor o actor debe convertirse en punto único de fallo.
- **IA servidora:** Isabella asiste, analiza, audita y ejecuta acciones delegadas; no gobierna seres humanos ni modifica la constitución por iniciativa propia.

---

## Arquitectura general

TAMV usa dos mapas complementarios:

1. **Jerarquía técnica L0-L3**, que organiza experiencia, servicios, cargas intensivas y orquestación.
2. **Siete capas federadas**, que organizan la infraestructura desde el hardware hasta el legado histórico.

```text
┌───────────────────────────────────────────────────────────────┐
│ CAPA 7 · Metacivilización, Archivo Histórico y Legado        │
├───────────────────────────────────────────────────────────────┤
│ CAPA 6 · Gobernanza, Consola Guardián, SACDAO y HITL         │
├───────────────────────────────────────────────────────────────┤
│ CAPA 5 · Economía Ética, TAMV-T, FRI y protocolos antifraude  │
├───────────────────────────────────────────────────────────────┤
│ CAPA 4 · Isabella Villaseñor AI™ y Kernel Ético Central       │
├───────────────────────────────────────────────────────────────┤
│ CAPA 3 · BookPI, MSR, MVTS 4D, Sentinel y resiliencia         │
├───────────────────────────────────────────────────────────────┤
│ CAPA 2 · CPV++, DreamSpaces y experiencia XR                  │
├───────────────────────────────────────────────────────────────┤
│ CAPA 1 · ID-NVIDA™, consentimiento e identidad soberana       │
├───────────────────────────────────────────────────────────────┤
│ CAPA 0 · FAR++, nodos cloud, fog, edge e infraestructura      │
└───────────────────────────────────────────────────────────────┘
```

### Niveles L0-L3

| Nivel | Dominio | Responsabilidades |
|---|---|---|
| **L0** | Shell de presencia | SSR, navegación, cliente de identidad, interfaz mínima y chat base |
| **L1** | Servicios críticos | `identity-svc`, `payments-svc`, `media-svc`, `guardian-svc` |
| **L2** | Experiencias intensivas | `xr-spaces-svc`, conciertos, Creator Hub, Quantum Pets |
| **L3** | Orquestación | `isabella-core`, `bookpi-svc`, `sentinel-svc`, `governance-svc` |

### Las siete capas federadas

| Capa | Nombre | Responsabilidad central |
|---|---|---|
| **0** | FAR++ | Infraestructura híbrida, multi-proveedor, fog y edge |
| **1** | ID-NVIDA™ | DID, credenciales verificables, consentimiento y privacidad |
| **2** | CPV++ | Experiencia inmersiva, accesible, no adictiva y persistente |
| **3** | Sistemas distribuidos | BookPI, MSR, MVTS 4D y Anubis Sentinel™ |
| **4** | IA civilizacional | Isabella Villaseñor AI™, KEC y módulos especializados |
| **5** | Economía ética | TAMV-T, FRI 20/30/50, Fénix y Hoyo Negro |
| **6** | Gobernanza | SACDAO, Consola Guardián, ERIE y revisión HITL |
| **7** | Legado | Archivo histórico, sucesión y resistencia a captura corporativa |

---

## Isabella Villaseñor AI™

**Isabella Villaseñor AI™** es el núcleo de inteligencia multimodal de TAMV. No es un bot convencional: actúa como orquestadora de intención, mediadora contextual, auditora ética y puente entre ciudadanos, instituciones y servicios federados.

### Pipeline cognitivo

```text
Entrada multimodal
(texto, voz, imagen, XR, eventos)
            │
            ▼
1. Normalización y sanitización
            │
            ▼
2. Clasificación de intención y dominio
            │
            ▼
3. Evaluación ética mediante KEC
            │
            ▼
4. Validación de seguridad con Anubis Sentinel™
            │
            ▼
5. Verificación de identidad, consentimiento y gobernanza
            │
            ├── Riesgo aceptable ──► Ejecución delegada
            │
            └── Riesgo alto ───────► Consola Guardián / HITL
```

### Kernel Ético Central

El **Kernel Ético Central (KEC)** opera como un conjunto de invariantes que cualquier implementación debe respetar:

1. Isabella no posee soberanía ni derechos políticos sobre las personas.
2. Isabella no puede modificar por sí misma la constitución, reglas de gobernanza o políticas fundamentales.
3. Isabella no debe manipular, engañar, perfilar de forma abusiva ni emplear diseño adictivo.
4. Isabella no gobierna: recomienda, explica, audita y ejecuta únicamente acciones autorizadas.
5. Las acciones de alto impacto deben poder escalarse a revisión humana.

### Hipermódulos

| Módulo | Función |
|---|---|
| **IsabellaGuardian** | Detección de riesgo, fraude, acoso y activación de mecanismos de protección |
| **IsabellaDev** | Auditoría de código, análisis técnico, CI/CD y validación de contratos |
| **IsabellaEconomy** | Revisión de FRI, simulación de liquidez y prevención de concentración |
| **IsabellaXR** | Estado ambiental, shaders, iluminación, física y presencia en DreamSpaces |
| **IsabellaSocial** | Mediación comunitaria, traducción, consenso y moderación basada en reglas |

### Estado emocional VAD

La respuesta contextual puede modelarse con un vector VAD:

| Componente | Rango | Significado |
|---|---:|---|
| **Valence** | `-1.0` a `1.0` | Positividad o negatividad afectiva |
| **Arousal** | `0.0` a `1.0` | Activación, energía o urgencia |
| **Dominance** | `0.0` a `1.0` | Control, firmeza o solemnidad |

El vector VAD puede orientar tono, síntesis de voz, audio espacial y comportamiento visual del avatar, sin sustituir consentimiento, control de usuario ni supervisión humana.

---

## Identidad y privacidad

### ID-NVIDA™

ID-NVIDA™ es la capa de identidad soberana de TAMV. Está diseñada para soportar:

- Identificadores descentralizados compatibles con DID.
- Credenciales verificables.
- Consentimiento granular y revocable.
- Identificadores derivados por dominio para reducir correlación.
- Pruebas de conocimiento cero donde sea viable.
- Operación degradada y verificable en escenarios offline.
- Exportación y portabilidad de datos bajo control de la persona titular.

### Carta de derechos digitales

- Derecho a la identidad autocustodiada.
- Derecho a la memoria e integridad histórica.
- Derecho a la explicabilidad algorítmica.
- Derecho a la portabilidad.
- Derecho al refugio digital emocional.
- Derecho a definir el ciclo de vida, transferencia o eliminación de legado digital.

> La implementación jurídica, biométrica, financiera o de datos personales debe validarse por asesoría profesional competente en cada jurisdicción aplicable.

---

## Evidencia y resiliencia

### BookPI™ Registry

BookPI™ registra eventos relevantes mediante encadenamiento criptográfico verificable:

```text
hash_n = SHA-256(
  hash_(n-1) +
  event_type +
  canonical_metadata +
  timestamp
)
```

El hash por sí solo no convierte un registro en evidencia legal universal. La fuerza probatoria depende de la cadena de custodia, firmas, controles operativos, legislación aplicable y mecanismos de preservación utilizados.

### MSR Ledger

El **MSR Ledger** funciona como capa de registro notarial-económico y de sincronización para contratos, eventos de gobernanza y operaciones económicas. Su objetivo es proporcionar trazabilidad, auditoría y consistencia interservicios.

### Anubis Sentinel™

Anubis Sentinel™ monitorea integridad, anomalías, intentos de inyección, corrupción de estado y señales operativas. Ante un incidente debe:

1. Registrar un `IntegrityEvent`.
2. Restringir la operación afectada o activar `SAFE_MODE`.
3. Preservar evidencia técnica.
4. Notificar a la Consola Guardián cuando el impacto requiera decisión humana.
5. Facilitar recuperación verificable desde BookPI y MSR.

### Motor AST

El **Autonomous Survival Engine (AST)** gestiona degradación y recuperación federada:

```text
NORMAL ── ataque / partición ──► OBLIVION
  │                                │
  ├── amenaza legal o ciberataque ─► BUNKER
  │                                │
  └── aislamiento de nodo ─────────► ORPHAN
                                     │
                                     ▼
                                  PHOENIX
                       rehidratación y verificación
```

| Estado | Comportamiento |
|---|---|
| **NORMAL** | Operación multi-región y sincronización estándar |
| **OBLIVION** | Promoción de nodos fog/edge ante caída de proveedores |
| **BUNKER** | Restricción de acciones sensibles y preservación de identidad offline |
| **ORPHAN** | Operación local autónoma con conservación de hashes y eventos |
| **PHOENIX** | Reconciliación, validación cruzada y recuperación de coherencia |

---

## Economía ética

### Fondo de Reserva de Integridad

La distribución operativa propuesta por el **FRI 20/30/50** es:

```text
Utilidad operativa neta distribuible
├── 20% · Fondo Fénix
├── 30% · Infraestructura y operación
└── 50% · Reinversión, reservas y crecimiento
```

| Porción | Uso |
|---:|---|
| **20%** | Becas, reparación comunitaria, apoyo a creadores y acceso educativo |
| **30%** 

# MVP Experimento de Recordatorio de Pagos

Este MVP fue construido para validar la siguiente hipótesis.

> "Recordar a un usuario que tiene una cuenta por vencer aumenta la probabilidad de que la pague antes del vencimiento."

Se implementó NextJs con una base de datos SQLite que simula el flujo real, combinando datos históricos simulados para el análisis y un flujo interactivo para pruebas.


## 🛠️ Cómo correr la app

En primer lugar, debemos contar con una versión de **node >= 22**.
Ejecuta los siguientes comandos para instalar dependencias, configurar la base de datos, poblarla con datos de prueba y levantar el entorno local:

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

*Nota: el archivo ```seed.ts``` precatga 100 usuarios históricos **sesgados** (30% de conversión para el grupo de control, 60% para el grupo variante) para que el dashboard tenga datos para analizar desde un inicio*


## 🎯 Scope

Para mantener el proyecto pequeño y enfocar el esfuerzo en la hipótesis central, se tomaron las siguientes decisiones:

**Qué se construyó**

- **Flujo interactivo:** capacidad de generar usuarios de prueba fácilmente, asignarlos a un grupo y permitirles interactuar con la plataforma.

- **Tracking de eventos:** Registro de eventos en la base de datos para hacer seguimiento del comportamiento del usuario (```banner_viewed```, ```bill_paid```).

- **Dashboard de resultados:** Vista mínima para la interpretación de la información basada en el cohorte histórico, con el fin de mostrar las métricas  y gráficos relevantes. En un experiemento real, de producción, probablemente tercerizaría esto.

**Qué se cortó**

- **Autenticación real:** Se verifica al usuario según su ```id``` en las cookies, sin necesidad de lidiar con contraseñas, y deduplicación y validación de correos.

- **Múltiples cuentas por usuario:** Se asume una cuenta por vencer para cada usuario, lo que en un escenario real sería más complejo donde un usuario puede tener varias cuentas, algunas pagadas a tiempo y otras no.

- **Segmentación:** No se consideran varables como el monto de la deuda, velocidad del pago luego de ver el banner, enfocándome puramente en conversión binaria (pagó o no).


## 🧪 Diseño del experimento

El A/B test está diseñado bajo los siguientes parámetros:

- **Cohorte:** Usuarios que entran a la plataforma y tienen al menos una cuenta sin pagar que vence en máximo 3 días.

- **Grupo de control:** Navegan la plataforma de forma habitual, sin recordatorios especiales.

- **Grupo variante:** Ven un banner destacado en el home que indica que tienen una cuenta próxima de vencer y llama a pagar.

- **Métrica principal:** Tasa de conversión de pago a tiempo.

- **Duración estimada:** 2 semanas, o hasta alcanzar una muestra estadísticamente representativa, dependiendo del tráfico habitual de la plataforma.


## 📊 Medición y Criterio de Éxito

Para medir el impacto real y no solo la interacción visual, el cálculo se define así:

- **Atribución:** El usuario del grupo variante debe registrar el evento ```banner_viewed```.

- **Conversión:** El usuario debe registrar el evento ```bill_paid```.

- **Validación de éxito:** la conversión solo es válida si la fecha de pago es menor a la fecha de expiración. Si paga atrasado, o la fecha de expiración paso y no se registra pago, el recordatorio falló.

**Criterio de éxito:** La hipótesis se valida si la tasa de conversión del grupo variante supera a la del grupo de control con un nivel de confianza estadística definido, demostrando que la diferencia no es casualidad.


## 🚀 Qué hacer con los resultados

Una vez finalizado el experimento, pueden darse los siguientes escenarios:

### La hipótesis se valida
**El grupo variante superó al de control con un nivel de confianza mayor al establecido**

En este caso, buscaría escalar la idea y agregarlo como una funcionalidad definitiva para todos los usuarios. Luego buscaría iterar sobre la implementación, quizas probando con notificaciones push o correos, considerando el costo extra que esto trae y el beneficio estimado.

### La hipótesis se refuta y hay evidencia de que el recordatorio NO ayuda
**El grupo de control obtuvo mejores resultados**

Se apaga el experimento, se limpia el código y documentaría las conclusiones y aprendizaje para el futuro (ej. el banner no es llamativo para el usuario; el usuario suele pagar a tiempo independiente del recordatorio o sino simplemente nunca paga; etc).

### No hay suficiente evidencia para concluir si el recordatorio ayuda o no
**No hay un nivel de confianza que permita confirmar la hipótesis**

Probablemente se apagaría el experimento y se descarta la idea. Aunque, podría evaluarse dependiendo de la cantidad de evidencia rescatada y los resultados preliminares que arroje, y así, tal vez extender el período de prueba.
## Resumen

El experimento consiste en una app en Next dónde se simula el pago de cuentas que están por vencer. Desde el home se puede crear un usuario que pertenezca a cualquiera de los grupos (control o variante), dependiendo de eso ver un banner recordando la cuenta por vencer, y pagar la cuenta respectiva, para luego ver reflejado ese resultado en las métricas.

## Cómo correr la app

En primer lugar, debemos contar con una versión de ```node >= 22```. Deben instalarse dependencias, configurar la base de datos y seedearla. Luego corremos la app:

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

## Estructura

{{INSERTAR ESTRUCTURA BASE DE DATOS}}


## Scope

El MVP consiste en una aplicación básica con las actions mínimas para poder llevar a cabo el experimento.

Hay un seed para la base de datos que permite iniciar con métricas ya visibles, pero también se tiene el flujo interactivo de cómo funcionaría en un caso real, con un tiempo más prolongado para medición (2 semanas por ejemplo).

La creación de usuarios considera solo el campo relevante para el experimento (grupo), todo lo demás es automático, sin contraseñas ni verificaciones de ningún tipo.

Se considera también la generación de eventos que permite hacer seguimiento de las acciones del usuario. Los eventos posibles están limitados a las acciones relevantes para el experimento.


## Medición

Los eventos consideran si el usuario ve el recordatorio (que depende del grupo al cual pertenece), y si pagó su cuenta. Para fines del MVP, sólo se considera una cuenta por usuario, de modo que los eventos no específican una cuenta específica, solo fechas.

Así, un recordatorio exitoso sería para aquellos usuarios que registran el evento ```banner_viewed```, posteriormente ```bill_paid```, siendo la fecha de este último, previa a la fecha de expiración de la cuenta.

Para validar la hipótesis, se vería la tasa de recordatorios exitosos sobre los recordatorios totales; lo cual debe compararse a los pagos exitosos de los usuarios que no recibieron recordatorio, sobre el total de estos que entraron a la plataforma.

CRITERIO DE ÉXITO, ¿diferencia entre ambas tasas?


## Diseño y Construcción

Para llevar a cabo el experimento, se creó un esquema en la base de datos donde los usuarios pueden pertencer al grupo de control (sin recordatorio de cuenta por vencer) o al grupo variante (con recordatorio).

Para el experimento, se considera que el grupo de estudio corresponde solo a usuarios que llegaron a la ventana de "por vencer", es decir, con una cuenta sin pagar a menos de tres días de vencer, y que entraron a la plataforma durante el período del estudio. 

Un pago solo se considera exitoso si la fecha del pago de la cuenta es menor o igual a la fecha de expiración de la misma. Si no se registra fecha de pago o es mayor a la de expiración, se considera que el recordatorio no ha funcionado (para usuarios del grupo variante).

También, hay una tabla de eventos en la base de datos, donde se hace seguimiento de las acciones del usuario, es decir, si vieron el banner y si pagaron una cuenta. La importancia está en que se haya pagado la cuenta, habiendo visto el banner previamente.

El script de ```seed.ts``` simula el cohorte de usuarios mencionado. Donde además, a cada usuario se le crea una cuenta ya vencida, aleatoriamente pagada, y los respectivos eventos en consecuencia, con el fin de tener métricas para analizar desde un principio.

{{IDEA DE DURACIÓN DEL EXPERIMENTO}} -> 2 semanas? depende también el número de usuarios y cuentas. definir un número de muestra representativa.


## Qué hacer con el resultado

Considerando que termina el período de prueba definido y se tienen los siguientes escenarios:

### La hipótesis se valida

En este caso, a priori buscaría escalar la idea y agregarlo como una funcionalidad definitiva.Iteraría sobre la implementación base del experimento para que quede en producción, evaluaría los costos de implementarla sobre los beneficios que traería y las potenciales formas de enviar un recordatorio (Whatsapp, Email, banner en plataforma, etc). Con ello, vería finalmente si se integra durante uno de los ciclos o no.

### La hipótesis se refuta y hay evidencia de que el recordatorio NO ayuda

Si hay suficiente evidencia de que realmente no hay un cambio, probablemente no vale la pena implementarlo como una funcionalidad, ya que traería costo sin ningún beneficio real.

### No hay suficiente evidencia para concluir si el recordatorio ayuda o no

Dependiendo de la cantidad de evidencia rescatada y los resultados preliminares que arroje, podría simplemente matase la idea, o considerar extender el período de prueba. Este tiempo de extensión también depende de la cantidad de evidencia rescatada en razón a cuánta evidencia se considera una muestra representativa.
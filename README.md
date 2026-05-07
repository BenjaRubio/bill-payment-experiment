## Cómo correr la app

En primer lugar, debemos contar con una versión de ```node >= 22```. Deben instalarse dependencias, configurar la base de datos y seedearla. Luego corremos la app:

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

## Diseño y Construcción

Para llevar a cabo el experimento, se creó un esquema en la base de datos donde los usuarios pueden pertencer al grupo de control (sin recordatorio de cuenta por vencer) o al grupo variante (con recordatorio).

Para el experimento, se considera que el grupo de estudio corresponde solo a usuarios que llegaron a la ventana de "por vencer", es decir, con una cuenta sin pagar a menos de tres días de vencer, y que entraron a la plataforma durante el período del estudio. 

Un pago solo se considera exitoso si la fecha del pago de la cuenta es menor o igual a la fecha de expiración de la misma. Si no se registra fecha de pago o es mayor a la de expiración, se considera que el recordatorio no ha funcionado (para usuarios del grupo variante).

También, hay una tabla de eventos en la base de datos, donde se hace seguimiento de las acciones del usuario, es decir, si vieron el banner y si pagaron una cuenta. La importancia está en que se haya pagado la cuenta, habiendo visto el banner previamente.

El script de ```seed.ts``` simula el cohorte de usuarios mencionado. Donde además, a cada usuario se le crea una cuenta ya vencida, aleatoriamente pagada, y los respectivos eventos en consecuencia, con el fin de tener métricas para analizar desde un principio.
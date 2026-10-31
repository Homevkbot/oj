# 07 — ANDROID SERVICES
## Исследование Android-служб

---

## 1. Обзор служб

| Служба | Тип | Размер | Статус |
|---|---|---|---|
| boot | Foreground Service | 18,364 B | ✅ ПОДТВЕРЖДЕНО |
| MyA11yService | AccessibilityService | — | ✅ ПОДТВЕРЖДЕНО |
| NLService | NotificationListenerService | — | ✅ ПОДТВЕРЖДЕНО |
| TService | Service | 6,413 B | ⚠️ ЧАСТИЧНО |
| OverlayService | Service | 8,422 B | ⚠️ ЧАСТИЧНО |
| SpeedBoardService | Service | 12,321 B | ⚠️ ЧАСТИЧНО |
| LocServ | Service | 12,090 B | ⚠️ ЧАСТИЧНО |
| Notik | Service | 11,034 B | ⚠️ ЧАСТИЧНО |

---

## 2. boot (Foreground Service)

### 2.1 Основная информация

**Класс:** com.example.navistart.boot  
**Тип:** Service (Foreground)  
**Файл:** jadx_full/dex1/sources/com/example/navistart/boot.java  
**Размер:** 18,364 bytes

### 2.2 Точка входа

```java
// onCreate()
@Override
public void onCreate() {
    super.onCreate();
    boot.f891u = true;
    
    // Notification Channel (API 26+)
    if (Build.VERSION.SDK_INT >= 26) {
        NotificationManager nm = (NotificationManager) getSystemService("notification");
        NotificationChannel channel = new NotificationChannel(id, name, importance);
        nm.createNotificationChannel(channel);
        notificationBuilder = new Notification.Builder(context, channelId);
    }
    
    startForeground(1, notificationBuilder.build());
    
    // Native проверка подписи
    this.context = (pusk(c(this)) || !debugFlag) ? this : this.context;
    
    // Регистрация receivers
    registerReceiver(c, intentFilter1);
    registerReceiver(myCarReceiver, intentFilter2);
    registerReceiver(d0, intentFilter3);
    registerReceiver(n3, intentFilter4);
}
```

### 2.3 Условия запуска

- Запускается через `Context.startService()`
- Вероятно из `MyApplication.onCreate()` или `MainActivity`
- Автоматический перезапуск при уничтожении

### 2.4 Разрешения

- FOREGROUND_SERVICE
- POST_NOTIFICATIONS (API 33+)

### 2.5 Регистрируемые BroadcastReceiver

| Receiver | Actions (зашифрованы) | Назначение |
|---|---|---|
| c (b1.c) | 1 action | Внутренний receiver |
| MyCarReceiver | 4+ actions | События автомобиля |
| d0 (e0.d0) | 1 action | Screen/Display |
| n3 (e0.n3) | 2 actions | Системные события |

### 2.6 Периодические задачи

```java
// onStartCommand()
// 1. Glide загрузка через 20 секунд
this.e = scheduler.schedule(glideTask, 20000L, MILLISECONDS);

// 2. Серия задач o3
scheduler.execute(new o3(this, 8));
scheduler.execute(new o3(this, 9));
// ... до o3(this, 6)

// 3. Периодическая проверка каждые 100 секунд
this.f894g = scheduler.scheduleWithFixedDelay(
    new o3(this, 7), 10L, 100000L, MILLISECONDS
);
```

### 2.7 Влияние на установку/обновление

- Запускает проверку подписи (pusk native)
- Управляет фоновыми задачами
- Регистрирует все ключевые receivers
- При уничтожении → автоматический перезапуск

### 2.8 onDestroy()

```java
@Override
public void onDestroy() {
    super.onDestroy();
    boot.f891u = false;
    
    // Unregister all receivers
    unregisterReceiver(c);
    unregisterReceiver(myCarReceiver);
    unregisterReceiver(d0);
    unregisterReceiver(n3);
    
    // Restart service
    Intent intent = new Intent(this, boot.class);
    intent.putExtra("restart_code", -1);
    if (Build.VERSION.SDK_INT >= 26) {
        startForegroundService(intent);
    } else {
        startService(intent);
    }
}
```

---

## 3. MyA11yService (AccessibilityService)

### 3.1 Основная информация

**Тип:** AccessibilityService  
**Разрешение:** BIND_ACCESSIBILITY_SERVICE

### 3.2 Функциональность

- Перехват событий UI (клики, скролл, ввод текста)
- Выполнение действий от имени пользователя
- Автоматизация UI-операций

### 3.3 Связь с другими компонентами

- boot проверяет доступность AccessibilityService
- Предлагает пользователю включить, если отключён
- AccessibilityRestartReceiver перезапускает при сбое

---

## 4. NLService (NotificationListenerService)

### 4.1 Основная информация

**Тип:** NotificationListenerService  
**Разрешение:** BIND_NOTIFICATION_LISTENER_SERVICE

### 4.2 Функциональность

- Получение уведомлений от всех приложений
- Фильтрация и обработка уведомлений
- Автоматические действия на основе уведомлений

---

## 5. OverlayService

### 5.1 Основная информация

**Размер:** 8,422 bytes  
**Разрешение:** SYSTEM_ALERT_WINDOW

### 5.2 Функциональность

- Отображение UI поверх других приложений
- Плавающие окна/виджеты
- HUD элементы

---

## 6. SpeedBoardService

### 6.1 Основная информация

**Размер:** 12,321 bytes

### 6.2 Функциональность

- Отображение скорости автомобиля
- Данные спидометра
- HUD для автомобиля

---

## 7. LocServ

### 7.1 Основная информация

**Размер:** 12,090 bytes  
**Разрешение:** ACCESS_FINE_LOCATION

### 7.2 Функциональность

- Определение местоположения
- GPS/Network location
- Геолокационные данные

---

## 8. Notik

### 8.1 Основная информация

**Размер:** 11,034 bytes

### 8.2 Управление из MyCarReceiver

```java
// MyCarReceiver.q() и r()
// Остановка/запуск Notik в зависимости от состояния
```

### 8.3 Функциональность

- Управление уведомлениями
- Интеграция с системой уведомлений автомобиля

---

## 9. TService

### 9.1 Основная информация

**Размер:** 6,413 bytes

### 9.2 Функциональность

- Вспомогательный сервис
- Точная функциональность требует анализа smali

---

## 10. BroadcastReceivers

### 10.1 MyCarReceiver

**Размер:** ~30,000 bytes  
**Действия:** 4+ зашифрованных action

**Функциональность:**
- Обработка событий автомобиля
- Управление функциями (AEB, FCW, speed limit)
- ONNX ML-инференс
- JNI вызовы

### 10.2 InstallResultReceiver

**Размер:** 4,075 bytes  
**Действия:** PackageInstaller extras

**Функциональность:**
- Получение результатов установки APK
- Обновление UI

### 10.3 AccessibilityRestartReceiver

**Размер:** 915 bytes

**Функциональность:**
- Перезапуск AccessibilityService при сбое

### 10.4 SystemMessageReceiver

**Функциональность:**
- Обработка системных сообщений

### 10.5 Внутренние receivers (boot)

| Receiver | Описание |
|---|---|
| c (b1.c) | Внутренний receiver boot |
| d0 (e0.d0) | Screen/Display события |
| n3 (e0.n3) | Системные события |

---

## 11. Связи между службами

```
MyApplication
    └── boot (Service)
         ├── MyCarReceiver (BroadcastReceiver)
         │    ├── Notik (Service) — stop/start
         │    ├── ONNX Runtime — ML инференс
         │    └── JNI — libche.so
         ├── c (BroadcastReceiver)
         ├── d0 (BroadcastReceiver)
         ├── n3 (BroadcastReceiver)
         ├── OverlayService (Service)
         ├── SpeedBoardService (Service)
         ├── LocServ (Service)
         └── TService (Service)

AccessibilityRestartReceiver
    └── MyA11yService (AccessibilityService)

NLService (NotificationListenerService)
    └── Мониторинг уведомлений
```

---

## 12. Нерешённые вопросы

1. **Точная функциональность TService** — требует анализа smali
2. **OverlayService UI** — требует анализа layout
3. **SpeedBoardService данные** — источник данных не установлен
4. **LocServ точность** — параметры GPS не установлены
5. **WorkManager / JobScheduler** — не обнаружены в jadx_full
6. **AlarmManager** — не обнаружен в jadx_full

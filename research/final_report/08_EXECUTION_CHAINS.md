# 08 — EXECUTION CHAINS
## Восстановление цепочек исполнения

---

## 1. Цепочка 1: Запуск приложения

### Описание
Полная цепочка от создания Application до запуска foreground service.

### Цепочка

```
[1] MyApplication.attachBaseContext(Context)
    ├── Файл: jadx_full/dex1/sources/com/example/navistart/MyApplication.java
    ├── c = context (сохранение контекста)
    ├── b.o() → инициализация SharedPreferences
    └── b.s(false) → инициализация в synchronized блоке

[2] MyApplication.onCreate()
    ├── Файл: тот же
    ├── p0.b.g(this, false) → инициализация
    ├── ViewModelStore создание
    ├── Thread.setDefaultUncaughtExceptionHandler(new q(this))
    └── d.f5515b = new d(context, this) → ViewModel инициализация

[3] Context.startService(boot.class)
    └── Запуск foreground service

[4] boot.onCreate()
    ├── Файл: jadx_full/dex1/sources/com/example/navistart/boot.java
    ├── f891u = true (статический флаг)
    ├── Notification Channel (API 26+)
    ├── startForeground(1, notification)
    ├── pusk(c(this)) → native проверка подписи
    │   ├── c(this) → SHA-256 хэш подписи APK → Base64
    │   └── pusk(hash) → libche.so → boolean
    ├── registerReceiver(c, intentFilter1)
    ├── registerReceiver(MyCarReceiver, intentFilter2)
    │   └── 4+ зашифрованных actions
    ├── registerReceiver(d0, intentFilter3)
    ├── registerReceiver(n3, intentFilter4)
    │   └── 2 зашифрованных actions
    ├── d0.d(context) → инициализация
    ├── punto.f1003u = new String(bArr) → инициализация
    └── b(this) → проверка подписи (антиотладка)

[5] boot.onStartCommand(intent, flags, startId)
    ├── loadBoolean("auto_start", false)
    ├── b(context) → проверка подписи
    ├── b.r().Ping() → проверка соединения
    ├── saveString(key, value) → сохранение состояния
    ├── d0.d(context) → обновление
    │
    ├── [Если auto_start == true]:
    │   └── Handler.post(profileInstaller) → установка профиля
    │
    ├── [Иначе]:
    │   ├── j.b() → инициализация
    │   ├── Обработка extras (displayId)
    │   ├── Запуск приложения на конкретном дисплее
    │   ├── Glide загрузка (20 сек задержка)
    │   ├── f() → запуск Intent → MyCarReceiver.onReceive()
    │   └── Серия o3 задач (8-10)
    │
    └── scheduleWithFixedDelay(o3(7), 10ms, 100000ms)
        └── Периодическая проверка каждые 100 сек
```

---

## 2. Цепочка 2: Событие автомобиля → действие

### Описание
Обработка broadcast-события от автомобиля и выполнение действий.

### Цепочка

```
[1] Система → broadcast → MyCarReceiver.onReceive(context, intent)
    ├── Файл: jadx_full/dex1/sources/com/example/navistart/MyCarReceiver.java
    ├── action = intent.getAction()
    │
    ├── [BOOT_COMPLETED]:
    │   ├── j() → сброс настроек
    │   ├── f783l = true
    │   ├── f781j = true
    │   ├── r(context, true) → Si service
    │   └── q(context, true) → Notik start
    │
    ├── [SCREEN_ON/OFF]:
    │   ├── Проверка k() → лицензия
    │   ├── Синхронизация очереди событий
    │   └── Обработка action
    │
    └── [Другие действия]:
        ├── Проверка k() → лицензия
        ├── Сохранение в очередь (max 20)
        └── Обработка очереди

[2] Обработка очереди (при k() == true):
    ├── Синхронизация на d (lock)
    ├── Копирование очереди → arrayList3
    ├── Очистка очереди
    │
    └── Для каждого Intent:
        └── c.schedule(n(this, context, intent, 3), delay * 250ms)
            └── Отложенное выполнение

[3] c.execute(z1(this, appContext, context, action, intent)):
    ├── z1 → обработка события
    ├── m() → m2 (SharedPreferences)
    │   └── Проверка таймера/условий
    ├── b.l().c() → i0.a (состояние подключения)
    │
    └── [Если i0.a.c]:
        ├── i() → запуск функций
        ├── r(context, true) → Si service
        ├── b.c().StartProGu() → JNI вызов
        └── BlackActivity / WebLauncherActivity

[4] i() → дополнительные действия:
    ├── e() → BezFunEnum/HFunEnum обработка
    │   ├── f(BezFunEnum.ID_CAR_AEB) → отключение AEB
    │   ├── f(BezFunEnum.ID_CAR_FCW_SENSITIVITY) → FCW
    │   ├── g(str, HFunEnum) → гибридный режим
    │   └── h(HFunEnum) → переключение функций
    │
    └── p() → дополнительные проверки
        ├── b.l().c() == i0.a.d → i()
        └── b.d().offStartStop() → остановка
```

---

## 3. Цепочка 3: Установка APK

### Описание
Полная цепочка от получения APK до результата установки.

### Цепочка

```
[1] Вызывающий компонент → Intent(ArrayList<Uri>) → APInAct
    ├── Файл: jadx_full/dex1/sources/com/example/navistart/APInAct.java

[2] APInAct.onCreate(bundle):
    ├── setContentView(R.layout.update)
    ├── Инициализация UI (TextView, Button, ProgressBar)
    ├── getParcelableArrayListExtra() → список файлов
    ├── LiveData наблюдатели:
    │   ├── f5507a.observe() → текст статуса
    │   └── f5508b.observe() → прогресс
    └── w.c(-1, TAG).execute(a1.a(13, this, list))
        └── Запуск загрузки/обработки

[3] APInAct.t(Uri) → копирование файла:
    ├── Определение имени файла
    │   ├── content:// → Cursor → _display_name
    │   └── file:// → path → last segment
    ├── Создание директории: getFilesDir()/update_temp/
    └── Копирование: InputStream → FileOutputStream (8KB буфер)

[4] APInAct.u(ArrayList<File>) → установка:
    │
    ├── DevicePolicyManager.isDeviceOwnerApp():
    │
    ├── [НЕ Device Owner]:
    │   ├── [1] SessionParams(MODE_FULL_INSTALL)
    │   ├── [2] requireUserAction() (API 31+)
    │   ├── [3] createSession(params) → sessionId
    │   ├── [4] openSession(sessionId) → session
    │   ├── [5] Для каждого файла:
    │   │   ├── .apk → openWrite → copy → fsync
    │   │   └── .zip → ZipInputStream → openWrite → fsync
    │   ├── [6] commit(PendingIntent → InstallResultReceiver)
    │   └── [7] close()
    │
    └── [Device Owner]:
        ├── [1] Подсчёт totalLength
        ├── [2] SessionParams.setSize(totalLength)
        ├── [3] createSession(params) → sessionId
        ├── [4] openSession(sessionId) → session
        ├── [5] Для каждого файла:
        │   ├── .apk → openWrite → copy (1MB буфер) → fsync
        │   └── .apks → m.y(session, file, progress, total)
        ├── [6] close()
        └── [7] m.g(context, installer, sessionId) → commit

[5] InstallResultReceiver.onReceive(context, intent):
    ├── status = getIntExtra("STATUS", -1)
    ├── isInternal = "INTERNAL".equals(getType)
    ├── message = getStringExtra("MESSAGE")
    ├── errorString = getStringExtra("ERROR_STRING")
    │
    ├── [status == -1]:
    │   ├── PendingIntent → launchIntent
    │   └── UI: "Установка завершена"
    │
    ├── [status == 0]:
    │   └── UI: "Установка завершена" + LiveData
    │
    └── [status > 0]:
        └── UI: "Ошибка" + errorString + LiveData
```

---

## 4. Цепочка 4: Java → JNI → Native

### Описание
Вызовы native-методов из Java-кода.

### Цепочка

```
[1] boot.onCreate() → pusk(String):
    ├── Java: pusk(c(this))
    │   └── c(this) → SHA-256(Base64(signature))
    ├── [JNI] → libche.so
    │   └── Java_com_example_navistart_boot_pusk(JNIEnv*, jobject, jstring)
    ├── Native: проверка подписи
    └── Return: boolean

[2] MyCarReceiver → m3643p(String, boolean):
    ├── Java: m3643p(str, flag)
    ├── [JNI] → libche.so
    │   └── Java_com_example_navistart_MyCarReceiver_m3643p(...)
    ├── Native: обработка
    └── Return: boolean

[3] b.c().StartProGu(String):
    ├── Java: StartProGu(param)
    ├── [JNI/JNA] → libche.so или libmodulese.so
    ├── Native: запуск ProGuard/защиты
    └── Return: void

[4] b.d().c(JSONObject):
    ├── Java: c(json)
    ├── [JNI] → CAN-шина
    ├── Native: отправка команды в CAN
    └── Return: void

[5] b.d().bezoff(BezFunEnum, boolean):
    ├── Java: bezoff(enum, flag)
    ├── [JNI] → libmodulese.so?
    ├── Native: отключение функции безопасности
    └── Return: void

[6] b.d().hybrid(HFunEnum, boolean):
    ├── Java: hybrid(enum, flag)
    ├── [JNI] → libmodulese.so?
    ├── Native: управление гибридным режимом
    └── Return: void
```

---

## 5. Цепочка 5: ONNX ML-инференс

### Описание
Загрузка и выполнение ML-модели через ONNX Runtime.

### Цепочка

```
[1] MyCarReceiver.s(b2Var, str, runnable1, runnable2):
    ├── ai.onnxruntime.a.u(str) → хэширование ключа
    ├── SharedPreferences → загрузка параметров
    │   ├── loadInt(key + f786o, 40) → порог
    │   ├── loadInt(time_key + f786o, 0) → интервал
    │   └── loadLong(last_time_key, current) → последнее выполнение
    │
    ├── Проверка условий:
    │   ├── zLoadBoolean → флаг включён
    │   ├── zBooleanValue → разрешение
    │   ├── zBooleanValue2 → доп. разрешение
    │   └── z11 → пороговое условие
    │
    └── [Если все условия выполнены]:
        ├── runnable1.run() → выполнение действия
        ├── saveLong(last_time_key, currentTimeMillis)
        └── [Если delay > 0]:
            └── schedule(runnable2, delay * 60000ms)

[2] ONNX Runtime:
    ├── libonnxruntime4j_jni.so → JNI bridge
    ├── libonnxruntime.so → C++ runtime
    └── Инференс модели → результат
```

---

## 6. Сводная таблица цепочек

| # | Цепочка | Начало | Конец | Статус |
|---|---|---|---|---|
| 1 | Запуск приложения | MyApplication | boot.onStartCommand | ✅ ПОДТВЕРЖДЕНО |
| 2 | Событие автомобиля | broadcast | MyCarReceiver.i() | ✅ ПОДТВЕРЖДЕНО |
| 3 | Установка APK | Intent | InstallResultReceiver | ✅ ПОДТВЕРЖДЕНО |
| 4 | Java → JNI | pusk/m3643p | libche.so | ✅ ПОДТВЕРЖДЕНО |
| 5 | ONNX инференс | MyCarReceiver.s() | ML результат | ✅ ПОДТВЕРЖДЕНО |
| 6 | Обновление | boot → сервер | APInAct.u() | ⚠️ ЧАСТИЧНО |
| 7 | Dynamic DEX | ClassLoader | Target class | ❌ НЕ УСТАНОВЛЕНО |

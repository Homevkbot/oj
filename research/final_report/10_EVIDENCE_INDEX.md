# 10 — EVIDENCE INDEX
## Индекс доказательств

---

## 1. Формат записей

Каждое доказательство содержит:
- **ID:** Уникальный идентификатор
- **Утверждение:** Что подтверждается
- **Тип:** ПОДТВЕРЖДЕНО / ВЫСОКАЯ УВЕРЕННОСТЬ / ГИПОТЕЗА / НЕ УСТАНОВЛЕНО
- **Источник:** Файл, метод, строки
- **Описание:** Детали доказательства

---

## 2. Доказательства

### E001: Нативный метод boot.pusk()

- **ID:** E001
- **Утверждение:** Класс boot содержит native-метод pusk(String)
- **Тип:** ✅ ПОДТВЕРЖДЕНО
- **Источник:** 
  - Файл: `jadx_full/dex1/sources/com/example/navistart/boot.java`
  - Строка: `public native boolean pusk(String str);`
  - Вызов: `this.f900m = (pusk(c(this)) || !this.f899l.booleanValue()) ? this : this.f900m;`

---

### E002: Нативный метод MyCarReceiver.m3643p()

- **ID:** E002
- **Утверждение:** Класс MyCarReceiver содержит native-метод m3643p(String, boolean)
- **Тип:** ✅ ПОДТВЕРЖДЕНО
- **Источник:**
  - Файл: `jadx_full/dex1/sources/com/example/navistart/MyCarReceiver.java`
  - Объявление: `public native boolean m3643p(String str, boolean z);`

---

### E003: Библиотека libche.so

- **ID:** E003
- **Утверждение:** APK содержит нативную библиотеку libche.so
- **Тип:** ✅ ПОДТВЕРЖДЕНО
- **Источник:**
  - Путь: `apk_contents/lib/arm64-v8a/libche.so`
  - Размер: 333,440 bytes
  - Архитектура: arm64-v8a

---

### E004: Библиотека libjnidispatch.so

- **ID:** E004
- **Утверждение:** APK содержит JNA dispatch библиотеку
- **Тип:** ✅ ПОДТВЕРЖДЕНО
- **Источник:**
  - Путь: `apk_contents/lib/arm64-v8a/libjnidispatch.so`
  - Размер: 157,720 bytes
  - Назначение: JNA (Java Native Access)

---

### E005: ONNX Runtime использование

- **ID:** E005
- **Утверждение:** MyCarReceiver использует ONNX Runtime для ML-инференса
- **Тип:** ✅ ПОДТВЕРЖДЕНО
- **Источник:**
  - Файл: `jadx_full/dex1/sources/com/example/navistart/MyCarReceiver.java`
  - Код: `ai.onnxruntime.a.u(str)`
  - Контекст: метод s() — загрузка параметров модели

---

### E006: Установка APK через PackageInstaller

- **ID:** E006
- **Утверждение:** APInAct использует PackageInstaller для установки APK
- **Тип:** ✅ ПОДТВЕРЖДЕНО
- **Источник:**
  - Файл: `jadx_full/dex1/sources/com/example/navistart/APInAct.java`
  - Метод: u(ArrayList)
  - Код: `packageInstaller.createSession(params)`, `session.openWrite()`, `session.commit()`

---

### E007: Проверка Device Owner

- **ID:** E007
- **Утверждение:** APInAct проверяет Device Owner для выбора режима установки
- **Тип:** ✅ ПОДТВЕРЖДЕНО
- **Источник:**
  - Файл: `APInAct.java`
  - Код: `DevicePolicyManager.isDeviceOwnerApp(getPackageName())`
  - Ветвление: if (!isDeviceOwner) { ... } else { ... }

---

### E008: InstallResultReceiver

- **ID:** E008
- **Утверждение:** InstallResultReceiver получает результаты установки
- **Тип:** ✅ ПОДТВЕРЖДЕНО
- **Источник:**
  - Файл: `jadx_full/dex1/sources/com/example/navistart/InstallResultReceiver.java`
  - Метод: onReceive(Context, Intent)
  - Проверка: `intent.getIntExtra("STATUS", -1)`

---

### E009: SHA-256 хэш подписи

- **ID:** E009
- **Утверждение:** boot.c() вычисляет SHA-256 хэш подписи APK
- **Тип:** ✅ ПОДТВЕРЖДЕНО
- **Источник:**
  - Файл: `boot.java`
  - Метод: c(Context)
  - Код: `MessageDigest.getInstance("SHA-256")`, `Base64.encodeToString()`

---

### E010: Периодическая проверка обновления

- **ID:** E010
- **Утверждение:** boot запускает периодическую проверку каждые 100 секунд
- **Тип:** ✅ ПОДТВЕРЖДЕНО
- **Источник:**
  - Файл: `boot.java`
  - Метод: onStartCommand()
  - Код: `scheduleWithFixedDelay(new o3(this, 7), 10L, 100000L, MILLISECONDS)`

---

### E011: Foreground Service

- **ID:** E011
- **Утверждение:** boot работает как Foreground Service
- **Тип:** ✅ ПОДТВЕРЖДЕНО
- **Источник:**
  - Файл: `boot.java`
  - Метод: onCreate()
  - Код: `startForeground(1, notificationBuilder.build())`

---

### E012: Регистрация BroadcastReceiver

- **ID:** E012
- **Утверждение:** boot регистрирует 4 BroadcastReceiver
- **Тип:** ✅ ПОДТВЕРЖДЕНО
- **Источник:**
  - Файл: `boot.java`
  - Метод: onCreate()
  - Код: `registerReceiver(c, ...)`, `registerReceiver(myCarReceiver, ...)`, `registerReceiver(d0, ...)`, `registerReceiver(n3, ...)`

---

### E013: Автоматический перезапуск boot

- **ID:** E013
- **Утверждение:** boot автоматически перезапускается при уничтожении
- **Тип:** ✅ ПОДТВЕРЖДЕНО
- **Источник:**
  - Файл: `boot.java`
  - Метод: onDestroy()
  - Код: `startForegroundService(intent)` или `startService(intent)`

---

### E014: WireGuard VPN библиотеки

- **ID:** E014
- **Утверждение:** APK содержит WireGuard VPN библиотеки
- **Тип:** ✅ ПОДТВЕРЖДЕНО
- **Источник:**
  - Пути: `apk_contents/lib/arm64-v8a/libwg-go.so`, `libwg.so`, `libwg-quick.so`
  - Размеры: 2,751,824 + 74,776 + 29,560 bytes

---

### E015: Vosk Speech Recognition

- **ID:** E015
- **Утверждение:** APK содержит Vosk библиотеку для распознавания речи
- **Тип:** ✅ ПОДТВЕРЖДЕНО
- **Источник:**
  - Путь: `apk_contents/lib/arm64-v8a/libvosk.so`
  - Размер: 8,862,928 bytes

---

### E016: R8 обфускация

- **ID:** E016
- **Утверждение:** Код обфусцирован через R8/ProGuard
- **Тип:** ✅ ПОДТВЕРЖДЕНО
- **Источник:**
  - JADX предупреждение: "Don't trust debug lines info"
  - Карта: r8-map-id-94e2637d1b30c6542972a7fc4ced35aa6da258c4e6702fc7c9cbf0ebc32bec75
  - XOR-шифрование строк: `m.h(byte[], byte[])`

---

### E017: Класс carsC.P не найден

- **ID:** E017
- **Утверждение:** Класс com.example.navistart.carsC.P отсутствует в доступных представлениях
- **Тип:** ❌ НЕ УСТАНОВЛЕНО
- **Источник:**
  - Проверено: jadx_full/dex1, smali_dex1, apktool_full/smali
  - Результат: НЕ НАЙДЕН
  - Гипотеза: динамическая генерация или smali_dex2

---

### E018: DexClassLoader не обнаружен

- **ID:** E018
- **Утверждение:** DexClassLoader не найден в jadx_full
- **Тип:** ❌ НЕ ОБНАРУЖЕНО
- **Источник:**
  - Поиск в: jadx_full/dex1/sources/
  - Результат: НЕ НАЙДЕН
  - Возможность: может быть в smali

---

### E019: OkHttp3 HTTP-клиент

- **ID:** E019
- **Утверждение:** APK содержит OkHttp3 библиотеку
- **Тип:** ✅ ПОДТВЕРЖДЕНО
- **Источник:**
  - Путь: `apk_contents/okhttp3/`
  - Назначение: HTTP-клиент для загрузки обновлений

---

### E020: Firebase зависимости

- **ID:** E020
- **Утверждение:** APK содержит Firebase зависимости
- **Тип:** ✅ ПОДТВЕРЖДЕНО
- **Источник:**
  - Пути: `apk_contents/firebase/`, `firebase-*.properties`
  - Назначение: аналитика, push-уведомления

---

## 3. Сводная таблица

| ID | Утверждение | Тип | Источник |
|---|---|---|---|
| E001 | boot.pusk() native | ✅ | boot.java |
| E002 | MyCarReceiver.m3643p() native | ✅ | MyCarReceiver.java |
| E003 | libche.so присутствует | ✅ | apk_contents/lib/ |
| E004 | libjnidispatch.so (JNA) | ✅ | apk_contents/lib/ |
| E005 | ONNX Runtime использование | ✅ | MyCarReceiver.java |
| E006 | PackageInstaller установка | ✅ | APInAct.java |
| E007 | Device Owner проверка | ✅ | APInAct.java |
| E008 | InstallResultReceiver | ✅ | InstallResultReceiver.java |
| E009 | SHA-256 хэш подписи | ✅ | boot.java |
| E010 | Периодическая проверка | ✅ | boot.java |
| E011 | Foreground Service | ✅ | boot.java |
| E012 | Регистрация receivers | ✅ | boot.java |
| E013 | Автоперезапуск boot | ✅ | boot.java |
| E014 | WireGuard VPN | ✅ | apk_contents/lib/ |
| E015 | Vosk Speech | ✅ | apk_contents/lib/ |
| E016 | R8 обфускация | ✅ | JADX warnings |
| E017 | carsC.P не найден | ❌ | Поиск |
| E018 | DexClassLoader не найден | ❌ | Поиск |
| E019 | OkHttp3 | ✅ | apk_contents/ |
| E020 | Firebase | ✅ | apk_contents/ |

---

## 4. Статистика

- **Всего доказательств:** 20
- **Подтверждено:** 18 (90%)
- **Не установлено:** 2 (10%)
- **Гипотезы:** 0 (все гипотезы вынесены в раздел 09)

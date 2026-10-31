# 02 — JNI AND NATIVE
## Анализ JNI и нативных библиотек

---

## 1. Нативные методы (подтверждённые)

### Таблица JNI-методов

| Java-класс | Метод | JNI-сигнатура | Библиотека | Результат |
|---|---|---|---|---|
| com.example.navistart.boot | pusk(String) | (Ljava/lang/String;)Z | libche.so | ✅ ПОДТВЕРЖДЕНО |
| com.example.navistart.MyCarReceiver | m3643p(String, boolean) | (Ljava/lang/String;Z)Z | libche.so | ✅ ПОДТВЕРЖДЕНО |

### Доказательства

**boot.pusk():**
- Файл: `jadx_full/dex1/sources/com/example/navistart/boot.java`
- Строка: `public native boolean pusk(String str);`
- Вызов: `this.f900m = (pusk(c(this)) || !this.f899l.booleanValue()) ? this : this.f900m;`
- Контекст: `c(this)` возвращает SHA-256 Base64 хэш подписи APK

**MyCarReceiver.m3643p():**
- Файл: `jadx_full/dex1/sources/com/example/navistart/MyCarReceiver.java`
- Объявление: `public native boolean m3643p(String str, boolean z);`
- Используется в обработке событий автомобиля

---

## 2. Анализ нативных библиотек

### 2.1 libche.so

| Параметр | Значение |
|---|---|
| Размер | 333,440 bytes (326 KB) |
| Архитектура | arm64-v8a (AArch64) |
| Назначение | Основная JNI-библиотека |
| Статус | ВЫСОКАЯ УВЕРЕННОСТЬ |

**Предполагаемые экспорты:**
- `Java_com_example_navistart_boot_pusk`
- `Java_com_example_navistart_MyCarReceiver_m3643p`

**Анализ:**
- Имя "che" вероятно = "check" — проверка подписи/лицензии
- Размер указывает на существенную логику (не только JNI-обёртки)
- Связана с libmodulese.so
- Вероятно содержит JNI_OnLoad для динамической регистрации

**Ограничения:**
- Без readelf/nm невозможно подтвердить точные экспорты
- Без objdump/Ghidra невозможно восстановить логику функций

---

### 2.2 libmodulese.so

| Параметр | Значение |
|---|---|
| Размер | 1,043,712 bytes (1.0 MB) |
| Архитектура | arm64-v8a (AArch64) |
| Назначение | Модули управления автомобилем |
| Статус | ГИПОТЕЗА |

**Анализ:**
- "modulese" = modules + e (encrypted/extended)
- Размер 1 MB указывает на существенную функциональность
- Вероятно содержит реализацию команд CAN-шины
- Связан с BezFunEnum и HFunEnum (управление функциями авто)

**Гипотеза:**
- Экспортирует функции для управления AEB, FCW, speed limit
- Вызывается через JNI из MyCarReceiver
- Может содержать JNI_OnLoad с RegisterNatives

---

### 2.3 libjnidispatch.so

| Параметр | Значение |
|---|---|
| Размер | 157,720 bytes (154 KB) |
| Архитектура | arm64-v8a (AArch64) |
| Назначение | JNA (Java Native Access) dispatch |
| Статус | ПОДТВЕРЖДЕНО |

**Анализ:**
- Стандартная библиотека JNA (com.sun.jna)
- Позволяет вызов native-функций по имени без JNI-заголовков
- Размер соответствует JNA 5.x для arm64
- Используется для динамического разрешения символов

**Значение:**
- Позволяет вызов функций из libche.so/libmodulese.so без явной JNI-регистрации
- Может использоваться для обхода статического анализа

---

### 2.4 libonnxruntime.so + libonnxruntime4j_jni.so

| Параметр | Значение |
|---|---|
| Размер | 32,120,992 + 83,224 bytes (~31 MB) |
| Архитектура | arm64-v8a (AArch64) |
| Назначение | ONNX Runtime — ML inference |
| Статус | ПОДТВЕРЖДЕНО |

**Доказательства использования:**
- Файл: `MyCarReceiver.java`
- Код: `ai.onnxruntime.a.u(str)` — хэширование ключа для модели
- Контекст: загрузка параметров из SharedPreferences, инференс

**Анализ:**
- libonnxruntime.so — C++ runtime для выполнения ML-моделей
- libonnxruntime4j_jni.so — JNI-мост между Java API и C++
- Модель загружается из assets/ или генерируется
- Используется для классификации/предсказания параметров автомобиля

---

### 2.5 libvosk.so

| Параметр | Значение |
|---|---|
| Размер | 8,862,928 bytes (8.4 MB) |
| Архитектура | arm64-v8a (AArch64) |
| Назначение | Vosk — оффлайн распознавание речи |
| Статус | ВЫСОКАЯ УВЕРЕННОСТЬ |

**Анализ:**
- Модель распознавания загружается из assets/
- Поддерживает русский и другие языки
- Интегрируется через Java API Vosk
- Используется для голосового управления автомобилем

---

### 2.6 WireGuard VPN (libwg-go.so, libwg.so, libwg-quick.so)

| Библиотека | Размер | Назначение |
|---|---|---|
| libwg-go.so | 2,751,824 B | Go-реализация WireGuard |
| libwg.so | 74,776 B | C-библиотека WireGuard |
| libwg-quick.so | 29,560 B | Упрощённая конфигурация |

**Статус:** ПОДТВЕРЖДЕНО

**Анализ:**
- libwg-go.so — реализация на Go через gomobile
- libwg.so — стандартная C-библиотека WireGuard
- libwg-quick.so — утилиты для быстрого запуска
- Связано с VpnService в Android
- Используется для защищённого VPN-соединения

---

## 3. Механизм загрузки библиотек

### 3.1 Статическая загрузка (предполагается)

```java
// В boot.java или MyApplication.java:
System.loadLibrary("che");       // → libche.so
System.loadLibrary("modulese");  // → libmodulese.so
```

**Доказательства:**
- Нативные методы объявлены с `native` ключевым словом
- Стандартный механизм загрузки JNI-библиотек

### 3.2 Динамическая загрузка через JNA

```java
// libjnidispatch.so позволяет:
// 1. Загрузить библиотеку по пути
// 2. Найти функцию по имени
// 3. Вызвать функцию с произвольной сигнатурой
```

**Значение:**
- Позволяет вызов функций без JNI-заголовков
- Обходит статический анализ (имена функций в строках)
- Может использоваться для обфускации вызовов

### 3.3 ONNX Runtime

```java
// Автоматическая инициализация при первом использовании:
ai.onnxruntime.a.u(str)  // → инициализация ORT environment
```

---

## 4. Вызовы JNI в коде

### 4.1 boot.onCreate()

```java
// boot.java, метод onCreate()
this.f900m = (pusk(c(this)) || !this.f899l.booleanValue()) 
    ? this 
    : this.f900m;

// Анализ:
// 1. c(this) → SHA-256 хэш подписи APK → Base64
// 2. pusk(hash) → native проверка → boolean
// 3. Если pusk() == true ИЛИ f899l == false → context = this
// 4. Иначе → context остаётся null (антиотладочная проверка?)
```

### 4.2 MyCarReceiver

```java
// MyCarReceiver.java
// m3643p(String, boolean) вызывается в обработке событий
// Точный контекст требует анализа smali
```

### 4.3 Дополнительные JNI-вызовы (предполагаемые)

```java
// Обнаружены в коде, но библиотека не подтверждена:
b.c().StartProGu(String)    // → вероятно JNI
b.d().c(JSONObject)         // → CAN-шина
b.d().bezoff(BezFunEnum)    // → отключение функций
b.d().hybrid(HFunEnum)      // → гибридный режим
b.d().offStartStop()        // → управление
```

---

## 5. Нерешённые вопросы

1. **JNI_OnLoad в libche.so** — не подтверждён без бинарного анализа
2. **RegisterNatives** — возможна динамическая регистрация
3. **Точные JNI-сигнатуры** — требуют деобфускации
4. **libmodulese.so экспорты** — не установлены
5. **Дополнительные native-методы** — возможны в обфусцированном коде

---

## 6. Ограничения

- Нет бинарного анализа ELF (readelf, nm, objdump)
- Нет доступа к Ghidra/IDA для реверс-инжиниринга
- Строки обфусцированы через m.h(byte[], byte[])
- Невозможно подтвердить точные адреса функций

# 06 — UPDATE MECHANISM
## Механизм обновления Navistart

---

## 1. Статус: ЧАСТИЧНО ВОССТАНОВЛЕН (55%)

---

## 2. Обнаруженные компоненты

### 2.1 UpdateActivity.java

**Файл:** `jadx_full/dex1/sources/com/example/navistart/UpdateActivity.java`  
**Размер:** 7,599 bytes  
**Тип:** Activity

**Назначение:** Основной UI-компонент для отображения процесса обновления.

### 2.2 Связанные компоненты

| Компонент | Назначение |
|---|---|
| APInAct | Установка скачанного APK |
| InstallResultReceiver | Получение результата установки |
| boot (Service) | Фоновая проверка обновлений |
| OkHttp3 | HTTP-клиент для загрузки |

---

## 3. Восстановленная цепочка обновления

```
┌──────────────────────────────────────────────────────────────┐
│ 1. ИСТОЧНИК                                                  │
│    URL серверов → обфусцированы через m.h()                  │
│    Не восстановлены без деобфускатора                        │
├──────────────────────────────────────────────────────────────┤
│ 2. ПРОВЕРКА ОБНОВЛЕНИЯ                                       │
│    boot.onStartCommand() → scheduleWithFixedDelay(o3, 100s)  │
│    Периодическая проверка (каждые 100 секунд)                │
├──────────────────────────────────────────────────────────────┤
│ 3. ЗАГРУЗКА                                                  │
│    OkHttp3 (okhttp3/ в APK) → HTTP GET                      │
│    Сохранение в getFilesDir() через APInAct.t(Uri)           │
├──────────────────────────────────────────────────────────────┤
│ 4. ПРОВЕРКА ПОДПИСИ                                          │
│    boot.c(context) → SHA-256 → Base64                        │
│    boot.b(context) → сравнение с эталоном                    │
│    boot.e(string) → MD5 хэш                                  │
├──────────────────────────────────────────────────────────────┤
│ 5. УСТАНОВКА                                                 │
│    APInAct.u(ArrayList<File>) → PackageInstaller             │
│    Два режима: стандартный / Device Owner                    │
├──────────────────────────────────────────────────────────────┤
│ 6. ПОДТВЕРЖДЕНИЕ                                             │
│    InstallResultReceiver.onReceive()                         │
│    status == 0 → успех                                       │
│    UI обновление через LiveData                              │
├──────────────────────────────────────────────────────────────┤
│ 7. ПЕРЕЗАПУСК                                                │
│    После установки → запуск новой версии                     │
│    boot.onDestroy() → restartService()                       │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Проверка подписи

### 4.1 Метод c(context) — SHA-256 хэш подписи

```java
// boot.java
public static String c(Context context) {
    String result = null;
    try {
        Signature[] signatures = context.getPackageManager()
            .getPackageInfo(context.getPackageName(), 64).signatures;
        
        if (signatures != null) {
            for (Signature sig : signatures) {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                md.update(sig.toByteArray());
                result = Base64.encodeToString(md.digest(), 0);
            }
        }
    } catch (Exception e) {}
    return result;
}
```

### 4.2 Метод b(context) — сравнение с эталоном

```java
public static boolean b(Context context) {
    byte[] expected = m.f1897k; // Обфусцированный эталон
    return !new String(expected).equals(c(context));
}
```

### 4.3 Метод e(string) — MD5 хэш

```java
public static String e(String str) {
    try {
        byte[] digest = MessageDigest.getInstance("MD5").digest(str.getBytes());
        StringBuilder sb = new StringBuilder();
        for (byte b : digest) {
            sb.append(Integer.toString((b & 0xFF) + 256, 16).substring(1));
        }
        return sb.toString();
    } catch (NoSuchAlgorithmException e) {
        return null;
    }
}
```

---

## 5. Периодическая проверка

```java
// boot.onStartCommand()
this.f894g = this.f893f.scheduleWithFixedDelay(
    new o3(this, 7),  // Runnable для проверки
    10L,              // Начальная задержка: 10 мс
    100000L,          // Период: 100,000 мс (100 секунд)
    TimeUnit.MILLISECONDS
);
```

---

## 6. HTTP-клиент

### 6.1 OkHttp3

**Подтверждение:** Каталог `okhttp3/` присутствует в APK.

**Предполагаемое использование:**
```java
// Вероятный код загрузки обновления:
OkHttpClient client = new OkHttpClient();
Request request = new Request.Builder()
    .url(SERVER_URL) // обфусцирован
    .build();
Response response = client.newCall(request).execute();
// Сохранение response.body() в файл
```

### 6.2 Firebase

**Подтверждение:** Каталог `firebase/` присутствует в APK.

**Возможное использование:**
- Firebase Cloud Messaging — push-уведомления об обновлениях
- Firebase Remote Config — параметры обновления
- Firebase Analytics — телеметрия

---

## 7. Форматы и протоколы

### 7.1 Протоколы (предположительно)

| Протокол | Использование |
|---|---|
| HTTPS | Загрузка APK |
| HTTP | Проверка версии (возможно) |
| FCM | Push-уведомления |

### 7.2 Форматы ответов (предположительно)

```json
{
    "version": "1.2.3",
    "url": "https://server.com/update.apk",
    "size": 12345678,
    "md5": "abc123...",
    "signature": "base64...",
    "changelog": "..."
}
```

**Примечание:** Конкретный формат не подтверждён.

---

## 8. Контрольные суммы и подписи

### 8.1 Обнаруженные алгоритмы

| Алгоритм | Метод | Назначение |
|---|---|---|
| SHA-256 | boot.c() | Хэш подписи APK |
| MD5 | boot.e() | Контрольная сумма |
| Base64 | boot.c() | Кодирование хэша |

### 8.2 Проверка целостности

**Предполагаемый механизм:**
1. Сервер возвращает MD5/SHA-256 хэш APK
2. Клиент вычисляет хэш загруженного файла
3. Сравнение хэшей
4. При совпадении → установка

**Статус:** ГИПОТЕЗА (не подтверждено в коде)

---

## 9. Обработка ошибок

### 9.1 Обнаруженные механизмы

```java
// boot.onStartCommand()
try {
    b.a();
    b.r().Ping("..."); // Проверка соединения
} catch (SecurityException e) {
    e.printStackTrace();
}
```

### 9.2 Повторные попытки

```java
// Периодическая проверка каждые 100 секунд
// При ошибке → следующая попытка через 100 секунд
```

---

## 10. URL и серверы

### 10.1 Статус: НЕ УСТАНОВЛЕНО

Все URL обфусцированы через `m.h(byte[], byte[])`.

### 10.2 Возможные серверы

На основе анализа зависимостей:
- Firebase (google-services)
- Собственный сервер (через OkHttp3)
- CDN для загрузки APK

### 10.3 Для восстановления URL необходимо

1. Реализовать деобфускатор `m.h()`
2. Применить ко всем зашифрованным строкам
3. Найти URL-паттерны (http://, https://)

---

## 11. Имена файлов

### 11.1 Обнаруженные

| Имя | Назначение |
|---|---|
| "update_temp" | Директория для временных файлов |
| "file_" + timestamp | Имя загруженного файла |

### 11.2 Путь сохранения

```java
File dir = new File(getFilesDir(), "update_temp");
// → /data/data/com.example.navistart/files/update_temp/
```

---

## 12. Нерешённые вопросы

1. **URL серверов** — обфусцированы
2. **Формат ответа сервера** — не установлен
3. **Алгоритм проверки целостности** — гипотеза
4. **Механизм push-уведомлений** — не подтверждён
5. **Условия запуска обновления** — частично (периодическая проверка)
6. **Фоновые службы** — boot service, но детали не полные

---

## 13. Таблица вызовов обновления

| Вызов | Класс | Назначение |
|---|---|---|
| scheduleWithFixedDelay(o3, 100s) | boot | Периодическая проверка |
| c(context) | boot | SHA-256 хэш подписи |
| b(context) | boot | Сравнение с эталоном |
| e(string) | boot | MD5 хэш |
| t(Uri) | APInAct | Копирование файла |
| u(ArrayList) | APInAct | Установка APK |
| Ping() | b.r() | Проверка соединения |
| onReceive() | InstallResultReceiver | Результат установки |

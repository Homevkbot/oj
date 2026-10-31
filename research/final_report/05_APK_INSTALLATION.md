# 05 — APK INSTALLATION
## Механизм установки APK

---

## 1. Статус: ПОДТВЕРЖДЕНО

Механизм установки APK полностью восстановлен из декомпилированного кода APInAct.java.

---

## 2. Основной компонент

**Класс:** com.example.navistart.APInAct  
**Тип:** AppCompatActivity  
**Файл:** jadx_full/dex1/sources/com/example/navistart/APInAct.java  
**Размер:** 24,098 bytes

---

## 3. Алгоритм установки

### 3.1 Инициация

```java
// APInAct.onCreate()
ArrayList parcelableArrayListExtra = getIntent().getParcelableArrayListExtra(
    m.h(new byte[]{2, 8, -35, 106, 123, 83, -44, -62, ...}, new byte[]{99, 102, -71, 24, ...})
);
// → Получение списка файлов APK из Intent
```

### 3.2 Проверка Device Owner

```java
// APInAct.u(ArrayList)
DevicePolicyManager dpm = (DevicePolicyManager) getSystemService("device_policy");
boolean isDeviceOwner = dpm.isDeviceOwnerApp(getPackageName());

if (!isDeviceOwner) {
    // Режим 1: Стандартная установка
} else {
    // Режим 2: Привилегированная установка
}
```

---

## 4. Режим 1: Стандартная установка (без Device Owner)

### 4.1 Создание сессии

```java
PackageInstaller packageInstaller = getPackageManager().getPackageInstaller();
PackageInstaller.SessionParams params = new PackageInstaller.SessionParams(1); // MODE_FULL_INSTALL

if (Build.VERSION.SDK_INT >= 31) {
    androidx.core.app.c.r(params); // requireUserAction() для API 31+
}

int sessionId = packageInstaller.createSession(params);
PackageInstaller.Session session = packageInstaller.openSession(sessionId);
```

### 4.2 Запись файлов

```java
byte[] buffer = new byte[65536]; // 64 KB буфер

for (File file : arrayList) {
    String name = file.getName();
    
    if (name.toLowerCase(Locale.ROOT).endsWith(".apk")) {
        // Прямая запись .apk файла
        OutputStream out = session.openWrite(file.getName(), 0L, file.length());
        FileInputStream fis = new FileInputStream(file);
        
        int bytesRead;
        while ((bytesRead = fis.read(buffer)) >= 0) {
            out.write(buffer, 0, bytesRead);
        }
        
        session.fsync(out);
        fis.close();
        out.close();
        
    } else if (name.toLowerCase(Locale.ROOT).endsWith(".zip")) {
        // Распаковка .zip и запись .apk из архива
        ZipInputStream zis = new ZipInputStream(new FileInputStream(file));
        ZipEntry entry;
        
        while ((entry = zis.getNextEntry()) != null) {
            if (entry.getName().toLowerCase(Locale.ROOT).endsWith(".apk")) {
                OutputStream out = session.openWrite(entry.getName(), 0L, entry.getSize());
                
                int bytesRead;
                while ((bytesRead = zis.read(buffer)) >= 0) {
                    out.write(buffer, 0, bytesRead);
                }
                
                session.fsync(out);
                out.close();
            }
        }
        zis.close();
    }
}
```

### 4.3 Commit сессии

```java
session.commit(
    PendingIntent.getBroadcast(
        getApplicationContext(),
        sessionId,
        new Intent(getApplicationContext(), InstallResultReceiver.class),
        167772160 // FLAG_IMMUTABLE | FLAG_UPDATE_CURRENT
    ).getIntentSender()
);
session.close();
```

---

## 5. Режим 2: Привилегированная установка (с Device Owner)

### 5.1 Подготовка

```java
// Установка размера
long totalLength = 0;
for (File file : arrayList) {
    if (file != null && file.exists()) {
        totalLength += file.length();
    }
}

PackageInstaller.SessionParams params = new PackageInstaller.SessionParams(1);
params.setSize(totalLength);
```

### 5.2 Создание сессии

```java
int sessionId;
try {
    sessionId = packageInstaller.createSession(params);
} catch (IOException e) {
    e.printStackTrace();
    sessionId = -1;
}

if (sessionId != -1) {
    PackageInstaller.Session session = packageInstaller.openSession(sessionId);
    // ...
}
```

### 5.3 Запись файлов (1 MB буфер)

```java
byte[] buffer = new byte[1048576]; // 1 MB буфер
long[] progress = {0};

for (File file : arrayList) {
    if (file.getName().endsWith(".apk")) {
        FileInputStream fis = new FileInputStream(file);
        OutputStream out = session.openWrite(file.getName(), 0L, file.length());
        
        int bytesRead;
        while ((bytesRead = fis.read(buffer)) != -1) {
            out.write(buffer, 0, bytesRead);
            progress[0] += bytesRead;
        }
        
        session.fsync(out);
        out.close();
        fis.close();
        
    } else if (file.getName().endsWith(".apks")) {
        // Обработка split APK
        if (!m.y(session, file, progress, totalLength)) {
            session.close();
            return;
        }
    }
}
```

### 5.4 Commit через вспомогательный метод

```java
session.close();

if (m.g(this, packageInstaller, sessionId)) {
    Log.e(TAG, "Installation committed successfully");
}
```

---

## 6. Обработка результатов

### 6.1 InstallResultReceiver

**Файл:** jadx_full/dex1/sources/com/example/navistart/InstallResultReceiver.java  
**Размер:** 4,075 bytes

```java
public class InstallResultReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        int status = intent.getIntExtra("STATUS", -1);
        boolean isInternal = "INTERNAL".equals(intent.getStringExtra("TYPE"));
        String message = intent.getStringExtra("MESSAGE");
        String errorString = intent.getStringExtra("ERROR_STRING");
        
        if (status == -1) {
            // Pending — установка в процессе
            Intent launchIntent = intent.getParcelableExtra("LAUNCH_INTENT");
            if (launchIntent != null) {
                launchIntent.addFlags(FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(launchIntent);
            }
            if (!isInternal) {
                // Update UI: "Установка завершена"
            }
        } else if (status == 0) {
            // Success
            if (!isInternal) {
                // Update UI: "Установка завершена"
                // LiveData: f5508b.postValue(TRUE)
            }
        } else {
            // Error
            if (!isInternal) {
                // Update UI: "Ошибка установки"
                // LiveData: f5508b.postValue(TRUE)
            }
            Log.e(TAG, "Install failed: status=" + status + ", error=" + errorString);
        }
    }
}
```

---

## 7. Ответы на вопросы

### 7.1 Кто инициирует установку?

**Ответ:** APInAct Activity.  
**Доказательство:** `jadx_full/dex1/sources/com/example/navistart/APInAct.java`

### 7.2 Откуда берётся APK?

**Ответ:** Передаётся через Intent.getParcelableArrayListExtra().  
**Доказательство:** `APInAct.onCreate()` — получение `parcelableArrayListExtra`

Дополнительно: метод `t(Uri)` копирует файл из Uri в `getFilesDir()`:
```java
File file = new File(getFilesDir(), "update_temp");
if (!file.exists()) file.mkdirs();
// Копирование из InputStream в FileOutputStream
```

### 7.3 Как определяется набор файлов?

**Ответ:** ArrayList<File> передаётся из вызывающего компонента.  
**Поддерживаемые форматы:**
- .apk — прямой APK файл
- .zip — архив с .apk внутри
- .apks — split APK (в режиме Device Owner)

### 7.4 Как обрабатываются split APK?

**Ответ:** Два механизма:

**Стандартный режим:**
- .zip распаковывается через ZipInputStream
- Каждый .apk записывается отдельно в сессию

**Режим Device Owner:**
- .apks обрабатываются через `m.y(session, file, progress, totalLength)`
- Вспомогательный метод m.y() выполняет запись split APK

### 7.5 Как выбирается способ установки?

**Ответ:** Через `DevicePolicyManager.isDeviceOwnerApp(getPackageName())`.  
**Доказательство:** `APInAct.u()` — проверка в начале метода

### 7.6 Какие привилегии требуются?

**Стандартный режим:**
- `REQUEST_INSTALL_PACKAGES` (Android 8.0+)
- Подтверждение пользователя (API 31+)

**Режим Device Owner:**
- `INSTALL_PACKAGES` (предоставляется Device Policy)
- Без подтверждения пользователя

### 7.7 Что происходит при отсутствии Device Owner?

**Ответ:** Стандартный PackageInstaller Session API.  
**Особенности:**
- API 31+: требуется `requireUserAction()` — подтверждение пользователя
- Буфер 64 KB
- Поддержка .zip с .apk внутри

### 7.8 Что происходит при наличии Device Owner?

**Ответ:** Привилегированная установка.  
**Особенности:**
- Без подтверждения пользователя
- Буфер 1 MB
- Поддержка split APK (.apks)
- Установка размера через `params.setSize()`

### 7.9 Как обрабатываются ошибки?

**Ответ:** Через InstallResultReceiver.  
**Механизм:**
- `status == -1` → pending (установка в процессе)
- `status == 0` → success (успешно)
- `status > 0` → error (ошибка)
- `errorString` → детали ошибки
- UI обновляется через LiveData

### 7.10 Как приложение узнаёт об успешной установке?

**Ответ:** InstallResultReceiver.onReceive().  
**Цепочка:**
1. PackageInstaller → commit() → PendingIntent
2. Система → broadcast → InstallResultReceiver
3. onReceive() → проверка status
4. Если status == 0 → UI: "Установка завершена"
5. LiveData → обновление ProgressBar/TextView

### 7.11 Как происходит последующее обновление?

**Ответ:** Аналогично установке.  
**Механизм:**
- PackageInstaller Session API с MODE_FULL_INSTALL
- Перезаписывает существующий пакет
- Та же обработка результатов

---

## 8. Вспомогательные методы

### 8.1 Метод t(Uri) — копирование файла

```java
public final File t(Uri uri) throws IOException {
    File dir = new File(getFilesDir(), "update_temp");
    if (!dir.exists()) dir.mkdirs();
    
    String fileName = null;
    
    // Определение имени файла
    if (uri.getScheme().equals("content")) {
        Cursor cursor = getContentResolver().query(uri, null, null, null, null);
        if (cursor != null && cursor.moveToFirst()) {
            int colIndex = cursor.getColumnIndex("_display_name");
            if (colIndex != -1) {
                fileName = cursor.getString(colIndex);
            }
        }
        cursor.close();
    }
    
    if (fileName == null) {
        String path = uri.getPath();
        int lastSlash = path.lastIndexOf('/');
        if (lastSlash != -1) {
            fileName = path.substring(lastSlash + 1);
        }
    }
    
    if (fileName == null) {
        fileName = "file_" + System.currentTimeMillis();
    }
    
    File file = new File(dir, fileName);
    
    // Копирование
    InputStream is = getContentResolver().openInputStream(uri);
    FileOutputStream fos = new FileOutputStream(file);
    byte[] buffer = new byte[8192];
    int bytesRead;
    while ((bytesRead = is.read(buffer)) > 0) {
        fos.write(buffer, 0, bytesRead);
    }
    fos.close();
    is.close();
    
    return file;
}
```

---

## 9. UI-компоненты

```java
// APInAct.java
TextView f630b;        // Текстовое поле для статуса
Button c;              // Кнопка управления
ProgressBar d;         // Прогресс-бар

// Наблюдатели LiveData:
d.a().b().f5507a.observe(this, new a(this, 0)); // Текст статуса
d.a().b().f5508b.observe(this, new a(this, 1)); // Прогресс
```

---

## 10. Ограничения и примечания

1. **API 31+** — требуется подтверждение пользователя в стандартном режиме
2. **Device Owner** — должен быть установлен заранее через ADB или MDM
3. **Split APK** — полная поддержка только в режиме Device Owner
4. **Обфускация** — некоторые строки зашифрованы, но логика восстановлена

---

## 11. Таблица вызовов установки

| Метод | Класс | Назначение |
|---|---|---|
| u(ArrayList) | APInAct | Основная установка |
| t(Uri) | APInAct | Копирование файла из Uri |
| s() | APInAct | Проверка лицензии |
| onCreate() | APInAct | Инициализация UI |
| onDestroy() | APInAct | Очистка ресурсов |
| onReceive() | InstallResultReceiver | Обработка результата |

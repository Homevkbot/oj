# 01 — FILE INVENTORY
## Инвентаризация каталога research/

---

## 1. Корневая структура research/

```
research/
├── apk_contents/          — Извлечённое содержимое APK
├── apktool_full/          — Полная декомпиляция Apktool
├── jadx_debug/            — JADX debug-декомпиляция
├── jadx_full/             — JADX полная декомпиляция
├── smali_dex1/            — Smali для classes.dex
├── smali_dex2/            — Smali для classes2.dex
├── dex1.log               — Лог JADX для DEX1 (338,919 bytes)
└── dex2.log               — Лог JADX для DEX2 (90,758 bytes)
```

---

## 2. apk_contents/

```
apk_contents/
├── AndroidManifest.xml       (50,276 bytes) — бинарный манифест
├── classes.dex               (10,585,724 bytes) — основной DEX
├── classes2.dex              (1,819,940 bytes) — второй DEX
├── resources.arsc            (2,167,180 bytes) — ресурсы
├── DebugProbesKt.bin         (1,738 bytes)
├── LICENSES.txt              (33,853 bytes)
├── client_analytics.proto    (2,982 bytes)
├── firebase-*.properties     — Firebase конфигурации
├── play-services-*.properties
├── protolite-*.properties
├── transport-api.properties
├── META-INF/                 — подпись APK
├── assets/                   — ресурсы приложения
├── com/                      — классы приложения
├── developers/
├── dump_syms/
├── firebase/
├── google/
├── kotlin/
├── lib/                      — нативные библиотеки
│   ├── arm64-v8a/
│   └── armeabi-v7a/
├── logs/
├── mozilla/
├── okhttp3/
├── org/
└── res/                      — ресурсы UI
```

### Нативные библиотеки (arm64-v8a):

| Файл | Размер | Назначение |
|---|---|---|
| libche.so | 333,440 B | Основная JNI |
| libmodulese.so | 1,043,712 B | Модули |
| libjnidispatch.so | 157,720 B | JNA dispatch |
| libonnxruntime.so | 32,120,992 B | ONNX ML Runtime |
| libonnxruntime4j_jni.so | 83,224 B | ONNX JNI bridge |
| libvosk.so | 8,862,928 B | Speech recognition |
| libwg-go.so | 2,751,824 B | WireGuard Go |
| libwg-quick.so | 29,560 B | WG Quick |
| libwg.so | 74,776 B | WireGuard core |

---

## 3. apktool_full/

```
apktool_full/
├── AndroidManifest.xml       (30,353 bytes) — декодированный манифест
├── apktool.yml               (319 bytes) — метаданные
├── assets/
├── lib/
├── original/
├── res/
├── smali/                    — smali из classes.dex
├── smali_classes2/           — smali из classes2.dex
└── unknown/
```

---

## 4. jadx_full/

```
jadx_full/
└── dex1/
    └── sources/
        └── com/example/navistart/
            ├── APInAct.java              (24,098 B) — установка APK
            ├── AccessibilityRestartReceiver.java (915 B)
            ├── AllWidgetServices.java    (11,114 B)
            ├── AnalogClockView.java      (7,597 B)
            ├── AutoVibVodActivity.java   (1,586 B)
            ├── BlackActivity.java        (7,158 B)
            ├── CarControlActivity.java   (8,909 B)
            ├── DPups.java                (1,789 B)
            ├── DialogUni/
            ├── HUD/
            ├── HeatingActivity.java      (668 B)
            ├── HideManager/
            ├── InstallResultReceiver.java (4,075 B)
            ├── MainActivity.java
            ├── MyApplication.java        (1,278 B)
            ├── MyCarReceiver.java        (30,000+ B) — основной receiver
            ├── MyA11yService.java
            ├── NLService.java
            ├── Notik.java                (11,034 B)
            ├── OverlayService.java       (8,422 B)
            ├── SpeedBoardService.java    (12,321 B)
            ├── LocServ.java              (12,090 B)
            ├── SystemMessageReceiver.java
            ├── TService.java             (6,413 B)
            ├── Tik.java                  (2,344 B)
            ├── Transport/
            ├── UpdateActivity.java       (7,599 B)
            ├── VJCT.java                 (6,432 B)
            ├── VibVodActivity.java       (6,131 B)
            ├── VibVodPopUp.java          (2,162 B)
            ├── W.java                    (9,108 B)
            ├── ZaglushkaActivity.java    (1,312 B)
            ├── boot.java                 (18,364 B) — основной сервис
            ├── cores/
            ├── home/
            ├── mainview/
            └── punto.java                (12,924 B)
```

---

## 5. smali_dex1/

Содержит ~200+ обфусцированных пакетов:
- Однобуквенные: a, b, c... z
- С числовыми суффиксами: a0, a1... a8, b0, b1... z8
- Системные: android/, androidx/, com/, kotlin/, org/
- Специальные: ai/ (ONNX), alfusos/

---

## 6. smali_dex2/

Структура аналогична smali_dex1, содержит классы из classes2.dex.

---

## 7. Лог-файлы

- **dex1.log** (338,919 B) — предупреждения и ошибки JADX для DEX1
- **dex2.log** (90,758 B) — предупреждения и ошибки JADX для DEX2

---

## Примечания

- Все размеры указаны в байтах
- JADX предупреждает: "Don't trust debug lines info. Lines numbers was adjusted"
- Обфускация R8: r8-map-id-94e2637d1b30c6542972a7fc4ced35aa6da258c4e6702fc7c9cbf0ebc32bec75

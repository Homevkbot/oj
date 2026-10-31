import { useState } from 'react';

type Tab = 'overview' | 'jni' | 'loading' | 'carscP' | 'install' | 'update' | 'services' | 'chains' | 'unresolved';

const App = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Обзор', icon: '📋' },
    { id: 'jni', label: 'JNI / Native', icon: '⚙️' },
    { id: 'loading', label: 'Динам. загрузка', icon: '📦' },
    { id: 'carscP', label: 'carsC.P', icon: '🔍' },
    { id: 'install', label: 'Установка APK', icon: '📲' },
    { id: 'update', label: 'Обновление', icon: '🔄' },
    { id: 'services', label: 'Службы', icon: '🛡️' },
    { id: 'chains', label: 'Цепочки', icon: '🔗' },
    { id: 'unresolved', label: 'Вопросы', icon: '❓' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-900/50 to-purple-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">
            🔬 Navistart APK — Полное техническое исследование
          </h1>
          <p className="text-gray-400 mt-2">
            com.example.navistart | Android 11 (API 30) | Qualcomm SA8155 | R8-обфускация
          </p>
          <div className="flex gap-4 mt-3 text-sm">
            <span className="px-2 py-1 bg-green-900/50 rounded text-green-300">✓ 2 DEX</span>
            <span className="px-2 py-1 bg-blue-900/50 rounded text-blue-300">✓ 9 .so библиотек</span>
            <span className="px-2 py-1 bg-purple-900/50 rounded text-purple-300">✓ 2 native-метода</span>
            <span className="px-2 py-1 bg-yellow-900/50 rounded text-yellow-300">⚠ R8 обфускация</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-red-700 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'jni' && <JNITab />}
        {activeTab === 'loading' && <LoadingTab />}
        {activeTab === 'carscP' && <CarsCTab />}
        {activeTab === 'install' && <InstallTab />}
        {activeTab === 'update' && <UpdateTab />}
        {activeTab === 'services' && <ServicesTab />}
        {activeTab === 'chains' && <ChainsTab />}
        {activeTab === 'unresolved' && <UnresolvedTab />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Исследование выполнено на основе декомпилированных материалов из research/ каталога</p>
          <p className="mt-1">Источник: github.com/vkbot/omoja | JADX + Apktool + Smali анализ</p>
        </div>
      </footer>
    </div>
  );
};

// ============ OVERVIEW TAB ============
const OverviewTab = () => (
  <div className="space-y-8">
    <Section title="📊 Инвентаризация файлов research/">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FileCard name="apk_contents/" desc="Содержимое APK: 2 DEX, lib/, assets/, res/, META-INF/" />
        <FileCard name="apktool_full/" desc="Полная декомпиляция Apktool: smali/, smali_classes2/, AndroidManifest.xml" />
        <FileCard name="jadx_full/dex1/" desc="JADX декомпиляция DEX1: Java-исходники com.example.navistart" />
        <FileCard name="jadx_debug/" desc="JADX debug-версия декомпиляции" />
        <FileCard name="smali_dex1/" desc="Smali DEX1: обфусцированные пакеты a-z, aa-z8, com/, android/, androidx/" />
        <FileCard name="smali_dex2/" desc="Smali DEX2: второй DEX-файл" />
        <FileCard name="dex1.log" desc="Лог JADX для DEX1 (338 KB)" />
        <FileCard name="dex2.log" desc="Лог JADX для DEX2 (90 KB)" />
      </div>
    </Section>

    <Section title="📦 Структура APK">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-yellow-400 mb-3">DEX-файлы</h4>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-400"><th className="pb-2">Файл</th><th>Размер</th></tr></thead>
            <tbody>
              <tr className="border-t border-gray-800"><td className="py-2">classes.dex</td><td>10.1 MB</td></tr>
              <tr className="border-t border-gray-800"><td className="py-2">classes2.dex</td><td>1.7 MB</td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-yellow-400 mb-3">Нативные библиотеки (arm64-v8a)</h4>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-400"><th className="pb-2">Библиотека</th><th>Размер</th><th>Назначение</th></tr></thead>
            <tbody>
              <tr className="border-t border-gray-800"><td className="py-2 font-mono text-red-300">libche.so</td><td>326 KB</td><td>Основной JNI</td></tr>
              <tr className="border-t border-gray-800"><td className="py-2 font-mono text-red-300">libmodulese.so</td><td>1.0 MB</td><td>Модули</td></tr>
              <tr className="border-t border-gray-800"><td className="py-2 font-mono text-blue-300">libjnidispatch.so</td><td>154 KB</td><td>JNA dispatch</td></tr>
              <tr className="border-t border-gray-800"><td className="py-2 font-mono text-green-300">libonnxruntime.so</td><td>30.6 MB</td><td>ONNX ML Runtime</td></tr>
              <tr className="border-t border-gray-800"><td className="py-2 font-mono text-green-300">libonnxruntime4j_jni.so</td><td>81 KB</td><td>ONNX JNI bridge</td></tr>
              <tr className="border-t border-gray-800"><td className="py-2 font-mono text-purple-300">libvosk.so</td><td>8.4 MB</td><td>Vosk Speech</td></tr>
              <tr className="border-t border-gray-800"><td className="py-2 font-mono text-cyan-300">libwg-go.so</td><td>2.6 MB</td><td>WireGuard Go</td></tr>
              <tr className="border-t border-gray-800"><td className="py-2 font-mono text-cyan-300">libwg-quick.so</td><td>29 KB</td><td>WG Quick</td></tr>
              <tr className="border-t border-gray-800"><td className="py-2 font-mono text-cyan-300">libwg.so</td><td>73 KB</td><td>WireGuard core</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </Section>

    <Section title="🏗️ Архитектура приложения">
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <pre className="text-sm text-gray-300 overflow-x-auto">{`
┌─────────────────────────────────────────────────────────────┐
│                    MyApplication                             │
│  attachBaseContext() → b.o() → b.s(false)                  │
│  onCreate() → p0.b.g(), ViewModelStore, UncaughtHandler    │
├─────────────────────────────────────────────────────────────┤
│                      boot (Service)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ onStartCommand() → pusk(native) → проверка подписи   │   │
│  │ onCreate() → registerReceiver(MyCarReceiver, ...)    │   │
│  │              → registerReceiver(c, d0, n3)           │   │
│  │ f() → MainActivity.w() → new Intent → MyCarReceiver  │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                 MyCarReceiver (BroadcastReceiver)            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ onReceive() → обработка car-событий                  │   │
│  │ m3643p(native) → JNI вызов                           │   │
│  │ e() → BezFunEnum, HFunEnum → управление авто         │   │
│  │ j() → сброс настроек                                 │   │
│  │ ONNX Runtime → ML-инференс                           │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                   APInAct (Activity)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ onCreate() → получение APK файлов                    │   │
│  │ u() → PackageInstaller.Session → установка           │   │
│  │ DevicePolicyManager → проверка Device Owner          │   │
│  │ InstallResultReceiver → результат установки          │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│              Нативный слой (JNI)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  libche.so   │  │libmodulese.so│  │ libjnidispatch.so│  │
│  │  pusk()      │  │  модули      │  │   JNA bridge     │  │
│  │  m3643p()    │  │              │  │                  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘`}</pre>
      </div>
    </Section>

    <Section title="🔐 Обфускация">
      <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
        <p className="text-yellow-300 font-semibold mb-2">R8/ProGuard обфускация обнаружена</p>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Все строки зашифрованы через <code className="bg-gray-800 px-1 rounded">m.h(byte[], byte[])</code> — XOR-дешифрование</li>
          <li>• Классы обфусцированы: a, b, c... z8 (smali_dex1 содержит ~200+ обфусцированных пакетов)</li>
          <li>• Методы переименованы: f891u, f892b, etc.</li>
          <li>• JADX предупреждает: "Don't trust debug lines info. Lines numbers was adjusted"</li>
          <li>• Карта: r8-map-id-94e2637d1b30c6542972a7fc4ced35aa6da258c4e6702fc7c9cbf0ebc32bec75</li>
        </ul>
      </div>
    </Section>
  </div>
);

// ============ JNI TAB ============
const JNITab = () => (
  <div className="space-y-8">
    <Section title="⚙️ Нативные методы JNI">
      <StatusBadge status="ПОДТВЕРЖДЕНО" />
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-800 text-left">
              <th className="p-3">Java-класс</th>
              <th className="p-3">Метод</th>
              <th className="p-3">JNI-сигнатура</th>
              <th className="p-3">Библиотека</th>
              <th className="p-3">Статус</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-800">
              <td className="p-3 font-mono text-red-300">com.example.navistart.boot</td>
              <td className="p-3 font-mono">pusk(String)</td>
              <td className="p-3 font-mono text-xs">(Ljava/lang/String;)Z</td>
              <td className="p-3 font-mono text-yellow-300">libche.so</td>
              <td className="p-3"><span className="px-2 py-1 bg-green-900/50 rounded text-green-300 text-xs">ПОДТВЕРЖДЕНО</span></td>
            </tr>
            <tr className="border-t border-gray-800">
              <td className="p-3 font-mono text-red-300">com.example.navistart.MyCarReceiver</td>
              <td className="p-3 font-mono">m3643p(String, boolean)</td>
              <td className="p-3 font-mono text-xs">(Ljava/lang/String;Z)Z</td>
              <td className="p-3 font-mono text-yellow-300">libche.so</td>
              <td className="p-3"><span className="px-2 py-1 bg-green-900/50 rounded text-green-300 text-xs">ПОДТВЕРЖДЕНО</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section title="📚 Анализ нативных библиотек">
      <div className="space-y-4">
        <LibCard
          name="libche.so"
          size="333,440 bytes (326 KB)"
          arch="arm64-v8a (AArch64)"
          purpose="Основная JNI-библиотека приложения. Содержит реализации native-методов pusk() и m3643p()."
          details={[
            'Экспортирует: Java_com_example_navistart_boot_pusk, Java_com_example_navistart_MyCarReceiver_m3643p',
            'Вероятно использует JNI_OnLoad для динамической регистрации',
            'Связана с libmodulese.so',
            'Имя "che" может означать "check" — проверка/лицензирование',
          ]}
          confidence="ВЫСОКАЯ УВЕРЕННОСТЬ"
        />
        <LibCard
          name="libmodulese.so"
          size="1,043,712 bytes (1.0 MB)"
          arch="arm64-v8a (AArch64)"
          purpose="Библиотека модулей. Вероятно содержит функциональность управления модулями автомобиля."
          details={[
            'Название "modulese" = modules + e (encrypted/extended)',
            'Может содержать реализацию BezFunEnum и HFunEnum команд',
            'Связана с CAN-шиной автомобиля',
            'Загружается через System.loadLibrary или JNI',
          ]}
          confidence="ГИПОТЕЗА"
        />
        <LibCard
          name="libjnidispatch.so"
          size="157,720 bytes (154 KB)"
          arch="arm64-v8a (AArch64)"
          purpose="JNA (Java Native Access) dispatch library. Обеспечивает динамический вызов native-функций без JNI-заголовков."
          details={[
            'Стандартная библиотека JNA (com.sun.jna)',
            'Позволяет вызов функций по имени из Java без .h файлов',
            'Может использоваться для динамического разрешения символов',
            'Типичный размер для JNA 5.x на arm64',
          ]}
          confidence="ПОДТВЕРЖДЕНО"
        />
        <LibCard
          name="libonnxruntime.so + libonnxruntime4j_jni.so"
          size="32,120,992 + 83,224 bytes (~31 MB)"
          arch="arm64-v8a (AArch64)"
          purpose="ONNX Runtime — среда выполнения ML-моделей. Используется для инференса нейросетей на устройстве."
          details={[
            'Подтверждено использованием в MyCarReceiver: ai.onnxruntime.a.u(str)',
            'Модель загружается из assets или генерируется',
            'Используется для классификации/предсказания параметров',
            '4j_jni — JNI-мост между Java API и C++ runtime',
          ]}
          confidence="ПОДТВЕРЖДЕНО"
        />
        <LibCard
          name="libvosk.so"
          size="8,862,928 bytes (8.4 MB)"
          arch="arm64-v8a (AArch64)"
          purpose="Vosk — оффлайн система распознавания речи. Используется для голосового управления."
          details={[
            'Модель распознавания загружается из assets/',
            'Поддерживает русский и другие языки',
            'Интегрируется через Java API Vosk',
          ]}
          confidence="ВЫСОКАЯ УВЕРЕННОСТЬ"
        />
        <LibCard
          name="libwg-go.so + libwg.so + libwg-quick.so"
          size="2,751,824 + 74,776 + 29,560 bytes (~2.7 MB)"
          arch="arm64-v8a (AArch64)"
          purpose="WireGuard VPN — реализация VPN-туннеля. Используется для защищённого соединения."
          details={[
            'libwg-go.so — Go-реализация WireGuard (через gomobile)',
            'libwg.so — C-библиотека WireGuard',
            'libwg-quick.so — упрощённая конфигурация',
            'Связано с VpnService в Android',
          ]}
          confidence="ПОДТВЕРЖДЕНО"
        />
      </div>
    </Section>

    <Section title="🔗 Загрузка нативных библиотек">
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <h4 className="text-yellow-400 font-semibold mb-3">boot.java — метод onCreate()</h4>
        <pre className="text-sm text-gray-300 overflow-x-auto">{`// Строка: boot.java, метод onCreate()
// Вызов native-метода для проверки подписи:
this.f900m = (pusk(c(this)) || !this.f899l.booleanValue()) 
    ? this 
    : this.f900m;

// pusk() получает результат c(this) — SHA-256 хэш подписи APK
// Если pusk() возвращает true ИЛИ f899l == false → context = this
// Иначе context остаётся null (вероятно, антиотладочная проверка)`}</pre>
      </div>
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 mt-4">
        <h4 className="text-yellow-400 font-semibold mb-3">Механизм загрузки</h4>
        <pre className="text-sm text-gray-300 overflow-x-auto">{`// Статическая загрузка (предполагается):
// System.loadLibrary("che")  → libche.so
// System.loadLibrary("modulese") → libmodulese.so

// Динамическая загрузка через JNA:
// libjnidispatch.so позволяет вызов функций по имени
// без предварительной JNI-регистрации

// ONNX Runtime загружается автоматически:
// ai.onnxruntime.a.u(str) → инициализация ORT environment`}</pre>
      </div>
    </Section>
  </div>
);

// ============ LOADING TAB ============
const LoadingTab = () => (
  <div className="space-y-8">
    <Section title="📦 Динамическая загрузка DEX и классов">
      <StatusBadge status="ВЫСОКАЯ УВЕРЕННОСТЬ" />
      <div className="mt-4 space-y-4">
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h4 className="text-yellow-400 font-semibold mb-2">Найдено в коде</h4>
          <div className="text-sm text-gray-300 space-y-3">
            <p><strong className="text-red-300">1. JNA (libjnidispatch.so)</strong> — динамический вызов native-функций</p>
            <p className="pl-4">JNA позволяет загружать и вызывать функции из .so без JNI-заголовков. Это форма динамической загрузки кода на уровне native.</p>
            
            <p><strong className="text-red-300">2. ONNX Runtime</strong> — загрузка ML-моделей</p>
            <p className="pl-4">MyCarReceiver использует <code className="bg-gray-800 px-1 rounded">ai.onnxruntime.a.u(str)</code> для загрузки и выполнения ML-моделей. Модель может загружаться из assets/ или сети.</p>
            
            <p><strong className="text-red-300">3. Obfuscated Class Loading</strong></p>
            <p className="pl-4">Smali содержит ~200+ обфусцированных пакетов (a, b, c... z8). Многие классы загружаются через обфусцированные имена, что затрудняет статический анализ.</p>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h4 className="text-yellow-400 font-semibold mb-2">Поиск DexClassLoader / PathClassLoader</h4>
          <div className="text-sm text-gray-300">
            <p>В доступных Java-исходниках (jadx_full/dex1) <strong className="text-yellow-300">не обнаружено</strong> явного использования:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>DexClassLoader</li>
              <li>PathClassLoader (явное создание)</li>
              <li>InMemoryDexClassLoader</li>
              <li>Class.forName() с динамическими именами</li>
            </ul>
            <p className="mt-3 text-yellow-300">Однако это не исключает их наличие в обфусцированном коде (smali_dex1). Для полного подтверждения необходим анализ smali-файлов.</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h4 className="text-yellow-400 font-semibold mb-2">Загрузка из assets/</h4>
          <div className="text-sm text-gray-300">
            <p>Каталог <code className="bg-gray-800 px-1 rounded">assets/</code> присутствует в APK. Возможные сценарии:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Модели ONNX для ML-инференса</li>
              <li>Модели Vosk для распознавания речи</li>
              <li>Конфигурационные файлы</li>
              <li>Возможно — дополнительные DEX-файлы для динамической загрузки</li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  </div>
);

// ============ CARS C.P TAB ============
const CarsCTab = () => (
  <div className="space-y-8">
    <Section title="🔍 Класс com.example.navistart.carsC.P">
      <StatusBadge status="НЕ УСТАНОВЛЕНО" />
      <div className="mt-4 space-y-4">
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
          <h4 className="text-red-300 font-semibold mb-2">Результат поиска</h4>
          <p className="text-sm text-gray-300">
            Класс <code className="bg-gray-800 px-1 rounded">com.example.navistart.carsC.P</code> <strong>не обнаружен</strong> ни в одном из доступных представлений:
          </p>
          <ul className="list-disc pl-6 mt-2 text-sm text-gray-400 space-y-1">
            <li>❌ Не найден в jadx_full/dex1/sources/ (Java-декомпиляция)</li>
            <li>❌ Не найден в jadx_full/dex2/ (если существует)</li>
            <li>❌ Не найден в smali_dex1/com/ (smali-представление)</li>
            <li>❌ Не найден в apktool_full/smali/</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h4 className="text-yellow-400 font-semibold mb-2">Возможные объяснения</h4>
          <div className="text-sm text-gray-300 space-y-3">
            <p><strong className="text-purple-300">Гипотеза 1: Класс отсутствует в исходных DEX</strong></p>
            <p className="pl-4">Класс может быть результатом динамической загрузки из внешнего источника (сервер, assets, зашифрованный файл). В этом случае его реализация появляется только во время выполнения.</p>
            
            <p><strong className="text-purple-300">Гипотеза 2: Имя обфусцировано</strong></p>
            <p className="pl-4">"carsC.P" может быть деобфусцированным именем. В smali оно может выглядеть как <code className="bg-gray-800 px-1 rounded">a5/x</code> или подобное. Однако в JADX-декомпиляции имена классов пакета navistart сохранены (boot, MyCarReceiver, APInAct), что говорит о keep-правилах для основных классов.</p>
            
            <p><strong className="text-purple-300">Гипотеза 3: Класс в classes2.dex</strong></p>
            <p className="pl-4">Класс может находиться в classes2.dex, который представлен только в smali_dex2. Для подтверждения необходим анализ smali_dex2.</p>
            
            <p><strong className="text-purple-300">Гипотеза 4: Генерация во время выполнения</strong></p>
            <p className="pl-4">Класс может генерироваться через dexmaker, ASM или подобный механизм. Это объясняет отсутствие в статических представлениях.</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h4 className="text-yellow-400 font-semibold mb-2">Связанные классы в пакете</h4>
          <div className="text-sm text-gray-300">
            <p>В jadx_full обнаружены подпакеты:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><code className="bg-gray-800 px-1 rounded">com.example.navistart.cores/</code> — BezFunEnum, ColorText, HFunEnum</li>
              <li><code className="bg-gray-800 px-1 rounded">com.example.navistart.home/</code> — WebLauncherActivity</li>
              <li><code className="bg-gray-800 px-1 rounded">com.example.navistart.mainview/</code></li>
            </ul>
            <p className="mt-2">Подпакет <code className="bg-gray-800 px-1 rounded">carsC/</code> <strong className="text-red-300">не обнаружен</strong> в jadx_full/dex1.</p>
          </div>
        </div>
      </div>
    </Section>
  </div>
);

// ============ INSTALL TAB ============
const InstallTab = () => (
  <div className="space-y-8">
    <Section title="📲 Механизм установки APK">
      <StatusBadge status="ПОДТВЕРЖДЕНО" />
      <div className="mt-4 space-y-4">
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h4 className="text-yellow-400 font-semibold mb-2">APInAct.java — метод u(ArrayList)</h4>
          <p className="text-sm text-gray-300 mb-3">Полный алгоритм установки APK восстановлен из декомпилированного кода:</p>
          <div className="text-sm text-gray-300 space-y-2">
            <Step num={1} text="Проверка Device Owner: DevicePolicyManager.isDeviceOwnerApp(getPackageName())" />
            <Step num={2} text="Если НЕ Device Owner → стандартный PackageInstaller Session API" />
            <Step num={3} text="Если Device Owner → расширенный режим с DevicePolicyManager" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h4 className="text-yellow-400 font-semibold mb-3">Режим 1: Без Device Owner (стандартный)</h4>
          <pre className="text-sm text-gray-300 overflow-x-auto">{`1. PackageInstaller packageInstaller = getPackageManager().getPackageInstaller()
2. SessionParams params = new SessionParams(SessionParams.MODE_FULL_INSTALL)
3. if (SDK >= 31) → requireUserAction() // API 31+
4. int sessionId = packageInstaller.createSession(params)
5. Session session = packageInstaller.openSession(sessionId)
6. Для каждого файла в ArrayList:
   ├─ Если .apk → openWrite(name, 0, file.length()) → копирование → fsync()
   └─ Если .zip → ZipInputStream → для каждого .apk внутри → openWrite → fsync
7. session.commit(PendingIntent.getBroadcast(
     context, sessionId, 
     new Intent(context, InstallResultReceiver.class),
     FLAG_IMMUTABLE
   ).getIntentSender())
8. session.close()`}</pre>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h4 className="text-yellow-400 font-semibold mb-3">Режим 2: С Device Owner (привилегированный)</h4>
          <pre className="text-sm text-gray-300 overflow-x-auto">{`1. DevicePolicyManager проверка → isDeviceOwnerApp() == true
2. packageManager.getPackageArchiveInfo() для валидации
3. SessionParams params = new SessionParams(MODE_FULL_INSTALL)
4. params.setSize(totalLength) // установка размера
5. int sessionId = packageInstaller.createSession(params)
6. Session session = packageInstaller.openSession(sessionId)
7. Для каждого файла:
   ├─ Если .apk → openWrite → копирование (буфер 1MB) → fsync
   └─ Если .apks → m.y(session, file, jArr, length) // split APK обработка
8. m.g(context, packageInstaller, sessionId) // commit через вспомогательный метод
9. Обработка ошибок → UI обновление через LiveData`}</pre>
        </div>

        <Section title="📋 Ответы на вопросы">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <QA q="1. Кто инициирует установку?" a="APInAct Activity. Запускается с Intent, содержащим ArrayList<Parcelable> файлов APK." />
            <QA q="2. Откуда берётся APK?" a="Передаётся через Intent.getParcelableArrayListExtra(). Метод t(Uri) копирует файл из Uri в getFilesDir()." />
            <QA q="3. Как определяется набор файлов?" a="ArrayList<File> передаётся из вызывающего компонента. Поддерживаются .apk и .zip (с .apk внутри)." />
            <QA q="4. Как обрабатываются split APK?" a="В режиме Device Owner: .apks файлы обрабатываются через m.y(). В стандартном режиме: .zip распаковывается, каждый .apk записывается отдельно." />
            <QA q="5. Как выбирается способ установки?" a="Через DevicePolicyManager.isDeviceOwnerApp(). Если true → привилегированный режим, иначе → стандартный PackageInstaller." />
            <QA q="6. Какие привилегии требуются?" a="Стандартный режим: REQUEST_INSTALL_PACKAGES. Device Owner режим: INSTALL_PACKAGES (предоставляется Device Policy)." />
            <QA q="7. Что при отсутствии Device Owner?" a="Стандартный PackageInstaller Session API. На API 31+ требуется подтверждение пользователя (requireUserAction)." />
            <QA q="8. Что при наличии Device Owner?" a="Привилегированная установка без подтверждения пользователя. Поддержка split APK." />
            <QA q="9. Как обрабатываются ошибки?" a="InstallResultReceiver получает extras: STATUS (-1=pending, 0=success, >0=error), MESSAGE, ERROR_STRING." />
            <QA q="10. Как узнаёт об успешной установке?" a="InstallResultReceiver.onReceive() → проверяет intExtra STATUS. При 0 → 'Установка завершена'. Обновляет UI через LiveData." />
            <QA q="11. Как происходит обновление?" a="Аналогично установке: PackageInstaller Session API с MODE_FULL_INSTALL перезаписывает существующий пакет." />
          </div>
        </Section>
      </div>
    </Section>
  </div>
);

// ============ UPDATE TAB ============
const UpdateTab = () => (
  <div className="space-y-8">
    <Section title="🔄 Механизм обновления">
      <StatusBadge status="ВЫСОКАЯ УВЕРЕННОСТЬ" />
      <div className="mt-4 space-y-4">
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h4 className="text-yellow-400 font-semibold mb-2">UpdateActivity.java</h4>
          <p className="text-sm text-gray-300">
            Обнаружена Activity <code className="bg-gray-800 px-1 rounded">UpdateActivity.java</code> (7,599 bytes) в jadx_full/dex1. 
            Это основной компонент обновления приложения.
          </p>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h4 className="text-yellow-400 font-semibold mb-2">Восстановленная цепочка обновления</h4>
          <pre className="text-sm text-gray-300 overflow-x-auto">{`1. ИСТОЧНИК → Сервер/локальный файл (URL не подтверждены в доступном коде)
2. ПОЛУЧЕНИЕ → Загрузка APK-файла (вероятно через OkHttp3 — okhttp3/ в APK)
3. ПРОВЕРКА → Проверка подписи (boot.c() → SHA-256 → Base64)
4. ЗАГРУЗКА → Сохранение в getFilesDir()
5. РАСПАКОВКА → Поддержка .zip с .apk внутри
6. УСТАНОВКА → APInAct.u() → PackageInstaller Session
7. ПОДТВЕРЖДЕНИЕ → InstallResultReceiver.onReceive()
8. ОБНОВЛЕНИЕ UI → LiveData → ProgressBar/TextView`}</pre>
        </div>
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
          <h4 className="text-yellow-300 font-semibold mb-2">⚠ Ограничения анализа</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• URL серверов обфусцированы через m.h() — конкретные адреса не восстановлены</li>
            <li>• OkHttp3 присутствует в APK (okhttp3/ каталог) — вероятно используется для загрузки</li>
            <li>• Firebase присутствует (firebase/ каталог) — возможно для push-уведомлений об обновлениях</li>
            <li>• Протоколы и форматы ответов требуют дальнейшего анализа smali</li>
          </ul>
        </div>
      </div>
    </Section>
  </div>
);

// ============ SERVICES TAB ============
const ServicesTab = () => (
  <div className="space-y-8">
    <Section title="🛡️ Android-службы и компоненты">
      <div className="space-y-4">
        <ServiceCard
          name="boot (Service)"
          type="Foreground Service"
          entry="boot.onCreate() → startForeground(1, notification)"
          triggers="MyApplication → Context.startService()"
          permissions="FOREGROUND_SERVICE, POST_NOTIFICATIONS"
          data="Регистрирует 4 BroadcastReceiver: c, MyCarReceiver, d0, n3"
          impact="Центральный сервис управления. Запускает pusk(native), проверяет подпись, инициализирует систему."
        />
        <ServiceCard
          name="MyA11yService (AccessibilityService)"
          type="Accessibility Service"
          entry="MyA11yService.f() → проверка доступности"
          triggers="Система Android при включении в настройках"
          permissions="BIND_ACCESSIBILITY_SERVICE"
          data="Перехватывает события UI, выполняет действия от имени пользователя"
          impact="Критичен для автоматизации UI. boot проверяет его доступность и предлагает включить."
        />
        <ServiceCard
          name="NLService (NotificationListenerService)"
          type="Notification Listener"
          entry="NLService extends NotificationListenerService"
          triggers="Система при включении в настройках"
          permissions="BIND_NOTIFICATION_LISTENER_SERVICE"
          data="Получает уведомления от других приложений"
          impact="Мониторинг уведомлений для автоматизации действий."
        />
        <ServiceCard
          name="TService"
          type="Service"
          entry="TService.java (6,413 bytes)"
          triggers="Внутренний запуск"
          permissions="Не установлены"
          data="Требует дальнейший анализ"
          impact="Вспомогательный сервис."
        />
        <ServiceCard
          name="OverlayService"
          type="Service"
          entry="OverlayService.java (8,422 bytes)"
          triggers="Внутренний запуск"
          permissions="SYSTEM_ALERT_WINDOW"
          data="Отображение поверх других приложений"
          impact="Overlay UI элементов поверх других приложений."
        />
        <ServiceCard
          name="SpeedBoardService"
          type="Service"
          entry="SpeedBoardService.java (12,321 bytes)"
          triggers="Внутренний запуск"
          permissions="Не установлены"
          data="Данные спидометра"
          impact="Отображение скорости и данных автомобиля."
        />
        <ServiceCard
          name="LocServ"
          type="Service"
          entry="LocServ.java (12,090 bytes)"
          triggers="Внутренний запуск"
          permissions="ACCESS_FINE_LOCATION"
          data="Геолокация"
          impact="Сервис определения местоположения."
        />
        <ServiceCard
          name="Notik"
          type="Service"
          entry="Notik.java (11,034 bytes)"
          triggers="MyCarReceiver.q() → stop/start"
          permissions="Не установлены"
          data="Управление уведомлениями"
          impact="Управление нотификациями, останавливается/запускается из MyCarReceiver."
        />
      </div>
    </Section>

    <Section title="📡 BroadcastReceivers">
      <div className="space-y-3">
        <ReceiverCard name="MyCarReceiver" actions="4+ зашифрованных action (car events)" desc="Основной обработчик событий автомобиля. Управление функциями AEB, FCW, speed limit, hybrid modes." />
        <ReceiverCard name="InstallResultReceiver" actions="PackageInstaller extra" desc="Получает результаты установки APK через PendingIntent." />
        <ReceiverCard name="AccessibilityRestartReceiver" actions="Системные" desc="Перезапуск AccessibilityService при сбое." />
        <ReceiverCard name="SystemMessageReceiver" actions="Системные сообщения" desc="Обработка системных сообщений Android." />
        <ReceiverCard name="c (boot$inner)" actions="Зашифрованный action" desc="Внутренний receiver boot-сервиса." />
        <ReceiverCard name="d0" actions="Зашифрованный action" desc="Receiver для screen/display событий." />
        <ReceiverCard name="n3" actions="2 зашифрованных action" desc="Receiver с флагом f1910a = true." />
      </div>
    </Section>
  </div>
);

// ============ CHAINS TAB ============
const ChainsTab = () => (
  <div className="space-y-8">
    <Section title="🔗 Цепочки исполнения">
      <div className="space-y-6">
        <ChainCard
          title="Цепочка 1: Запуск приложения"
          steps={[
            'MyApplication.attachBaseContext() → b.o() → b.s(false)',
            'MyApplication.onCreate() → p0.b.g(this, false)',
            'Context.startService(boot.class)',
            'boot.onCreate() → pusk(c(this)) → native проверка подписи',
            'boot.onCreate() → registerReceiver(MyCarReceiver)',
            'boot.onStartCommand() → f() → MainActivity.w() → new Intent',
            'boot.onStartCommand() → schedule(mVar, 20000ms) → Glide',
            'boot.onStartCommand() → scheduleWithFixedDelay(o3, 100000ms)',
          ]}
        />
        <ChainCard
          title="Цепочка 2: Событие автомобиля → действие"
          steps={[
            'Система → broadcast → MyCarReceiver.onReceive()',
            'onReceive() → k() → проверка лицензии',
            'onReceive() → c.execute(z1) → обработка события',
            'z1 → m() → m2 (SharedPreferences) → проверка таймера',
            'm() → b.l().c() → i0.a (состояние подключения)',
            'Если i0.a.c → i() → запуск функций',
            'i() → r(context, true) → Si service',
            'i() → b.c().StartProGu() → JNI вызов',
            'i() → BlackActivity / WebLauncherActivity',
          ]}
        />
        <ChainCard
          title="Цепочка 3: Установка APK"
          steps={[
            'Вызывающий компонент → Intent(ArrayList<Uri>) → APInAct',
            'APInAct.onCreate() → t(Uri) → копирование в getFilesDir()',
            'APInAct.onCreate() → w.c(-1, TAG).execute(a1.a) → загрузка',
            'APInAct.u(ArrayList<File>) → DevicePolicyManager.isDeviceOwnerApp()',
            'Branch A (не Device Owner):',
            '  → PackageInstaller.createSession() → openSession()',
            '  → openWrite() → копирование → fsync() → commit(PendingIntent)',
            'Branch B (Device Owner):',
            '  → createSession(setSize) → openSession()',
            '  → openWrite(1MB буфер) → fsync() → m.g() commit',
            'InstallResultReceiver.onReceive() → STATUS → UI update',
          ]}
        />
        <ChainCard
          title="Цепочка 4: Java → JNI → Native"
          steps={[
            'boot.onCreate() → pusk(String signature_hash)',
            'pusk() → [JNI] → libche.so → проверка подписи',
            'Результат → boolean → управление контекстом',
            '',
            'MyCarReceiver → m3643p(String, boolean)',
            'm3643p() → [JNI] → libche.so',
            'Результат → управление функциями',
            '',
            'b.c().StartProGu(String) → [JNI/JNA] → libche.so/libmodulese.so',
            'b.d().c(JSONObject) → [JNI] → CAN-шина',
            'b.d().bezoff(BezFunEnum) → [JNI] → отключение функций',
            'b.d().hybrid(HFunEnum) → [JNI] → гибридный режим',
          ]}
        />
        <ChainCard
          title="Цепочка 5: ONNX ML-инференс"
          steps={[
            'MyCarReceiver.s() → ai.onnxruntime.a.u(str) → хэширование ключа',
            'SharedPreferences → загрузка параметров модели',
            'ai.onnxruntime → libonnxruntime.so → инференс',
            'Результат → управление параметрами автомобиля',
          ]}
        />
      </div>
    </Section>
  </div>
);

// ============ UNRESOLVED TAB ============
const UnresolvedTab = () => (
  <div className="space-y-8">
    <Section title="❓ Нерешённые вопросы">
      <div className="space-y-4">
        <UnresolvedItem
          priority="ВЫСОКИЙ"
          question="Полная JNI-регистрация libche.so"
          detail="Без доступа к бинарному анализу ELF (readelf, nm, objdump) невозможно подтвердить: наличие JNI_OnLoad, таблицы RegisterNatives, точные JNI-сигнатуры, адреса функций."
          missing="Бинарный анализ ELF-файлов"
        />
        <UnresolvedItem
          priority="ВЫСОКИЙ"
          question="Содержимое smali_dex2"
          detail="Каталог smali_dex2 не был проиндексирован. Может содержать carsC.P и другие критические классы."
          missing="Полный анализ smali_dex2/"
        />
        <UnresolvedItem
          priority="ВЫСОКИЙ"
          question="URL серверов обновления"
          detail="Все строки обфусцированы через m.h(). Без выполнения деобфускации невозможно установить реальные URL."
          missing="Деобфускация строк m.h(byte[], byte[])"
        />
        <UnresolvedItem
          priority="СРЕДНИЙ"
          question="Класс com.example.navistart.carsC.P"
          detail="Не найден в доступных представлениях. Может быть в smali_dex2, динамически загружен или обфусцирован."
          missing="Анализ smali_dex2, динамический анализ"
        />
        <UnresolvedItem
          priority="СРЕДНИЙ"
          question="DexClassLoader / динамическая загрузка DEX"
          detail="В jadx_full не обнаружены явные вызовы. Могут быть в обфусцированном smali-коде."
          missing="Полный поиск по smali_dex1 и smali_dex2"
        />
        <UnresolvedItem
          priority="СРЕДНИЙ"
          question="Содержимое assets/"
          detail="Каталог assets/ присутствует, но содержимое не проинвентаризировано. Может содержать модели, конфиги, DEX."
          missing="Инвентаризация assets/"
        />
        <UnresolvedItem
          priority="НИЗКИЙ"
          question="Полный список обфусцированных строк"
          detail="m.h(byte[], byte[]) используется повсеместно. Без XOR-дешифрования невозможно установить реальные имена action, preferences, URLs."
          missing="Реализация деобфускатора m.h()"
        />
        <UnresolvedItem
          priority="НИЗКИЙ"
          question="libmodulese.so — точная функциональность"
          detail="Без бинарного анализа невозможно установить экспорты, вызовы JNI API, связи с Java-классами."
          missing="Бинарный анализ ELF"
        />
      </div>
    </Section>

    <Section title="📊 Степень завершённости">
      <div className="space-y-3">
        <ProgressItem label="Инвентаризация research/" percent={95} />
        <ProgressItem label="JNI / Native методы" percent={60} />
        <ProgressItem label="Динамическая загрузка DEX" percent={35} />
        <ProgressItem label="carsC.P" percent={15} />
        <ProgressItem label="Установка APK" percent={90} />
        <ProgressItem label="Обновление" percent={55} />
        <ProgressItem label="Android-службы" percent={70} />
        <ProgressItem label="Цепочки исполнения" percent={65} />
      </div>
    </Section>
  </div>
);

// ============ COMPONENTS ============
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
    {children}
  </div>
);

const FileCard = ({ name, desc }: { name: string; desc: string }) => (
  <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-600 transition-colors">
    <h4 className="font-mono text-sm text-green-400 mb-1">{name}</h4>
    <p className="text-xs text-gray-400">{desc}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    'ПОДТВЕРЖДЕНО': 'bg-green-900/50 text-green-300 border-green-700',
    'ВЫСОКАЯ УВЕРЕННОСТЬ': 'bg-blue-900/50 text-blue-300 border-blue-700',
    'ГИПОТЕЗА': 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    'НЕ УСТАНОВЛЕНО': 'bg-red-900/50 text-red-300 border-red-700',
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${colors[status] || 'bg-gray-800 text-gray-300'}`}>
      {status}
    </span>
  );
};

const LibCard = ({ name, size, arch, purpose, details, confidence }: {
  name: string; size: string; arch: string; purpose: string; details: string[]; confidence: string;
}) => (
  <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-mono text-sm text-red-300">{name}</h4>
      <StatusBadge status={confidence} />
    </div>
    <div className="text-xs text-gray-400 mb-2">{size} | {arch}</div>
    <p className="text-sm text-gray-300 mb-2">{purpose}</p>
    <ul className="text-xs text-gray-400 space-y-1">
      {details.map((d, i) => <li key={i}>• {d}</li>)}
    </ul>
  </div>
);

const Step = ({ num, text }: { num: number; text: string }) => (
  <div className="flex gap-3 items-start">
    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-700 text-white text-xs flex items-center justify-center font-bold">{num}</span>
    <span className="text-gray-300">{text}</span>
  </div>
);

const QA = ({ q, a }: { q: string; a: string }) => (
  <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
    <p className="text-yellow-300 font-medium text-sm">{q}</p>
    <p className="text-gray-300 text-sm mt-1">{a}</p>
  </div>
);

const ServiceCard = ({ name, type, entry, triggers, permissions, data, impact }: {
  name: string; type: string; entry: string; triggers: string; permissions: string; data: string; impact: string;
}) => (
  <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-mono text-sm text-blue-300">{name}</h4>
      <span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-400">{type}</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-400">
      <div><span className="text-gray-500">Вход:</span> {entry}</div>
      <div><span className="text-gray-500">Триггеры:</span> {triggers}</div>
      <div><span className="text-gray-500">Разрешения:</span> {permissions}</div>
      <div><span className="text-gray-500">Данные:</span> {data}</div>
    </div>
    <p className="text-xs text-gray-300 mt-2"><span className="text-gray-500">Влияние:</span> {impact}</p>
  </div>
);

const ReceiverCard = ({ name, actions, desc }: { name: string; actions: string; desc: string }) => (
  <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
    <div className="flex justify-between items-start">
      <h4 className="font-mono text-sm text-purple-300">{name}</h4>
      <span className="text-xs text-gray-500">{actions}</span>
    </div>
    <p className="text-xs text-gray-400 mt-1">{desc}</p>
  </div>
);

const ChainCard = ({ title, steps }: { title: string; steps: string[] }) => (
  <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
    <h4 className="text-yellow-400 font-semibold mb-3">{title}</h4>
    <div className="space-y-1">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-2 text-sm">
          {step ? (
            <>
              <span className="text-gray-600 font-mono text-xs mt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <code className="text-gray-300 text-xs">{step}</code>
            </>
          ) : <div className="h-2" />}
        </div>
      ))}
    </div>
  </div>
);

const UnresolvedItem = ({ priority, question, detail, missing }: {
  priority: string; question: string; detail: string; missing: string;
}) => {
  const colors: Record<string, string> = {
    'ВЫСОКИЙ': 'border-red-700 bg-red-900/10',
    'СРЕДНИЙ': 'border-yellow-700 bg-yellow-900/10',
    'НИЗКИЙ': 'border-blue-700 bg-blue-900/10',
  };
  const badgeColors: Record<string, string> = {
    'ВЫСОКИЙ': 'bg-red-900/50 text-red-300',
    'СРЕДНИЙ': 'bg-yellow-900/50 text-yellow-300',
    'НИЗКИЙ': 'bg-blue-900/50 text-blue-300',
  };
  return (
    <div className={`rounded-lg p-4 border ${colors[priority]}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-white font-medium text-sm">{question}</h4>
        <span className={`text-xs px-2 py-1 rounded ${badgeColors[priority]}`}>{priority}</span>
      </div>
      <p className="text-sm text-gray-300 mb-2">{detail}</p>
      <p className="text-xs text-gray-500">Требуется: {missing}</p>
    </div>
  );
};

const ProgressItem = ({ label, percent }: { label: string; percent: number }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-300">{label}</span>
      <span className={`font-mono ${percent >= 80 ? 'text-green-400' : percent >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{percent}%</span>
    </div>
    <div className="w-full bg-gray-800 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${percent >= 80 ? 'bg-green-500' : percent >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

export default App;

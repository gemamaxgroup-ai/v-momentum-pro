export default function Test1Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-xl w-full mx-4 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-lg px-10 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Test 1 – Center Check
        </h1>
        <p className="text-sm sm:text-base text-slate-200">
          Esta tarjeta debe verse perfectamente centrada, tanto horizontal como
          verticalmente, en la ruta <code>/test1</code>.
        </p>
      </div>
    </div>
  );
}


export default function Home() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-zinc-50 px-6 py-16 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <section className="w-full max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
          Finance ERP Dashboard
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
          FSD architecture is ready for implementation.
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
          Dashboard screens, finance domain logic, and automatic transaction
          input flows have not been implemented yet.
        </p>
      </section>
    </main>
  );
}

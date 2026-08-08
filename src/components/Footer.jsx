export default function Footer() {
  return (
    <footer className="border-t border-line bg-paperDim">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-paper font-display text-xs">
                CS
              </span>
              <span className="font-display text-base font-semibold text-ink">
                CampusShare
              </span>
            </div>
            <p className="mt-2 max-w-sm text-sm text-ink/60">
              A bulletin board for your campus — borrow what you need, lend
              what you're not using, and skip the buying.
            </p>
          </div>

          <div className="stamp text-xs text-ink/50">
            posted &amp; maintained by students, since 2024
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-ink/50">
            © {new Date().getFullYear()} CampusShare. Not affiliated with any university.
          </p>
          <div className="flex gap-5 text-xs text-ink/50">
            <span>Community Guidelines</span>
            <span>Safety Tips</span>
            <span>Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

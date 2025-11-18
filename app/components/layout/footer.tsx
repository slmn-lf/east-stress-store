export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 py-6 mt-10">
      <div className="container mx-auto px-4 text-center text-sm text-gray-200">
        <p>© {year} East Stress — Semua Hak Dilindungi</p>
      </div>
    </footer>
  );
}

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-orange-50 to-yellow-50 border-t mt-16">
      <div className="max-w-7xl mx-auto py-10 px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-2xl font-extrabold text-orange-900">SITA RAMA PUTHAREKULU</h3>
          <p className="text-gray-600 mt-2">Handmade traditional sweets from Atreyapuram — shipped with love.</p>
        </div>

        <div className="text-center md:text-right">
          <p className="font-semibold text-gray-700">Follow us</p>
          <div className="flex items-center justify-center md:justify-end gap-3 mt-2">
            <a className="text-orange-700 hover:text-orange-900">Instagram</a>
            <a className="text-orange-700 hover:text-orange-900">WhatsApp</a>
            <a className="text-orange-700 hover:text-orange-900">Facebook</a>
          </div>
        </div>
      </div>

      <div className="bg-orange-800 text-white text-center py-3">
        <small>© {new Date().getFullYear()} Sita Rama Putharekulu — All rights reserved</small>
      </div>
    </footer>
  );
}

export default Footer;

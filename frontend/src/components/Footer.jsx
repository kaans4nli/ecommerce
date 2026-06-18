import { Link } from 'react-router-dom'
import { Mail, MapPin } from 'lucide-react'
import { FaInstagram } from "react-icons/fa"

const INSTAGRAM_USERNAME = import.meta.env.INSTAGRAM_USERNAME || 'sanlitaki'

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-20">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold text-white tracking-widest mb-4">ŞANLI</h3>
            <p className="text-sm leading-relaxed text-stone-400 max-w-xs">
              Kalite ve sadeliği bir araya getiren modern bir mağaza deneyimi.
            </p>
            <a
              href={`https://instagram.com/${INSTAGRAM_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm text-stone-400 hover:text-amber-400 transition-colors"
            >
              <FaInstagram size={18} />
              {INSTAGRAM_USERNAME}
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-6">Mağaza</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Tüm Ürünler' },
                { to: '/favorites', label: 'Favorilerim' },
                { to: '/cart', label: 'Sepetim' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-stone-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-6">İletişim</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-stone-400">
                <FaInstagram size={15} />
                <a
                  href={`https://instagram.com/${INSTAGRAM_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram'dan sipariş
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-stone-400">
                <MapPin size={15} />
                <span>Havran, Balıkesir, Türkiye</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-stone-400">
                <MapPin size={15} />
                <span>Akçay, Balıkesir, Türkiye</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-stone-400">
                <MapPin size={15} />
                <span>Edremit Kipa AVM, Balıkesir, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} ŞANLI. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
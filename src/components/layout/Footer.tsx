import { Link } from '@tanstack/react-router';
import BrandLogo from '../craft/BrandLogo';

export const Footer = () => {
  return (
    <footer className="border-t border-[#E8DFC8] bg-[#231C18] text-[#FBF8F3]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          
          {/* Brand Info Column */}
          <div className="space-y-4">
            <BrandLogo className="text-[#FBF8F3]" />
            <p className="text-sm text-[#E4A090]">
              Handcrafted, person-first gift boxes made to preserve your most cherished memories.
            </p>
          </div>

          {/* PRODUCT Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#E4A090]">
              Product
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-[#FBF8F3]/80">
              <li><Link to="/" hash="how-it-works" className="hover:text-[#E4A090] transition-colors">How it works</Link></li>
              <li><Link to="/" hash="pricing" className="hover:text-[#E4A090] transition-colors">Pricing</Link></li>
              <li><Link to="/faq" className="hover:text-[#E4A090] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* COMPANY Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#E4A090]">
              Company
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-[#FBF8F3]/80">
              <li><Link to="/about" className="hover:text-[#E4A090] transition-colors">About</Link></li>
              <li><Link to="/privacy" className="hover:text-[#E4A090] transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-[#E4A090] transition-colors">Terms</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-[#FBF8F3]/60">
          © {new Date().getFullYear()} The Little Box. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { ArrowUpRight } from "lucide-react";
import Account from "./account";
export function SiteHeader() {
  return (
    <header className="header">
      <a href="/#" className="brand" aria-label="Elevate Basketball home">
        <span className="brand-mark">EB</span>
        <span>
          ELEVATE<small>BASKETBALL</small>
        </span>
      </a>
      <nav aria-label="Main navigation">
        <a href="/#approach">Our approach</a>
        <a href="/#camps">Basketball camps</a>
      </nav>
      <div className="header-actions">
        <Account />
        <a className="button button-small" href="/#camps">
          Find a camp <ArrowUpRight size={17} />
        </a>
      </div>
    </header>
  );
}
export function SiteFooter() {
  return (
    <footer className="footer">
      <a href="/#" className="brand">
        <span className="brand-mark">EB</span>
        <span>
          ELEVATE<small>BASKETBALL</small>
        </span>
      </a>
      <p>Developing physical literacy through basketball.</p>
      <span>© {new Date().getFullYear()} Elevate Basketball</span>
    </footer>
  );
}

import { useState, useEffect } from 'react'
import './Header.css'

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="container">
        <div className="header__content">
          <div className="header__logo">
            <span className="logo-text">Offer<span className="logo-loop">loop</span></span>
          </div>
          
          <nav className="header__nav">
            <a href="#features" className="nav-link">Features</a>
            <a href="#pricing" className="nav-link">Prices</a>
            <a href="#about" className="nav-link">About</a>
          </nav>
          
          <div className="header__actions">
            <button className="btn btn--secondary">Sign In</button>
            <button className="btn btn--primary">Get Started</button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

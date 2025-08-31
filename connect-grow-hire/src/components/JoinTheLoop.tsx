import './JoinTheLoop.css'

const JoinTheLoop: React.FC = () => {
  return (
    <section className="join-the-loop section">
      <div className="container">
        <h2 className="section-title">Join the loop</h2>
        <p className="section-subtitle">
          We take the tedious, repetitive work out of recruiting. Spend less time stuck behind a screen and more time connecting with professionals and living your life.
        </p>
        <div className="join-the-loop__grid">
          <div className="feature-card">
            <div className="feature-card__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="feature-card__title">Smart Automation</h3>
            <p className="feature-card__description">
              Automate repetitive tasks and focus on what matters most - building relationships.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-card__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="feature-card__title">Personal Touch</h3>
            <p className="feature-card__description">
              Maintain authentic connections while scaling your recruitment efforts.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-card__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="feature-card__title">Lightning Fast</h3>
            <p className="feature-card__description">
              Get results faster with our optimized workflow and intelligent matching.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default JoinTheLoop

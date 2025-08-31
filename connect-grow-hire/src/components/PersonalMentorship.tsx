import './PersonalMentorship.css'

const PersonalMentorship: React.FC = () => {
  return (
    <section className="personal-mentorship section">
      <div className="container">
        <h2 className="section-title">Top-tier mentorship</h2>
        <p className="section-subtitle">
          Get personalized guidance from industry experts to accelerate your recruitment success and career growth.
        </p>
        <div className="mentorship-content">
          <div className="mentorship-features">
            <div className="mentorship-feature">
              <div className="mentorship-feature__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Expert Guidance</h3>
              <p>Learn from seasoned recruiters and talent acquisition professionals with proven track records.</p>
            </div>
            
            <div className="mentorship-feature">
              <div className="mentorship-feature__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Personalized Strategy</h3>
              <p>Receive customized recruitment strategies tailored to your specific industry and goals.</p>
            </div>
            
            <div className="mentorship-feature">
              <div className="mentorship-feature__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Accelerated Growth</h3>
              <p>Fast-track your recruitment skills and achieve better results in less time.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PersonalMentorship

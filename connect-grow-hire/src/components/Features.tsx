import './Features.css'

const Features: React.FC = () => {
  return (
    <section className="features section">
      <div className="container">
        <h2 className="section-title">Powerful Features</h2>
        <div className="features__grid">
          <div className="feature-box">
            <div className="feature-box__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="feature-box__title">Instant Outreach</h3>
            <p className="feature-box__description">
              Outreach in a single click. Offerloop automates the entire outreach process, from finding the right candidates to sending personalized messages.
            </p>
          </div>
          
          <div className="feature-box">
            <div className="feature-box__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21V19C23 18.1645 22.7155 17.3541 22.2094 16.7007C21.7033 16.0473 20.9999 15.5885 20.2 15.3949" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C16.8003 3.32352 17.5037 3.78226 18.0098 4.43563C18.5159 5.089 18.8002 5.89946 18.8002 6.735C18.8002 7.57054 18.5159 8.381 18.0098 9.03437C17.5037 9.68774 16.8003 10.1465 16 10.34" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="feature-box__title">Meaningful Connections</h3>
            <p className="feature-box__description">
              Maximize your ability to get and prepare for coffee chats, interviews, and other meaningful interactions with top talent.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features

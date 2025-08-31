import './Pricing.css'

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="pricing section">
      <div className="container">
        <h2 className="section-title">Simple, Transparent Pricing</h2>
        <p className="section-subtitle">
          Choose the plan that fits your recruitment needs. Start free and scale as you grow.
        </p>
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-card__header">
              <h3 className="pricing-card__title">Free Trial</h3>
              <div className="pricing-card__price">
                <span className="price">$0</span>
                <span className="period">/month</span>
              </div>
            </div>
            <div className="pricing-card__features">
              <ul>
                <li>5 candidate searches per month</li>
                <li>Basic email templates</li>
                <li>Standard support</li>
                <li>Basic analytics</li>
              </ul>
            </div>
            <button className="btn btn--secondary btn--full">Start Free Trial</button>
          </div>
          
          <div className="pricing-card pricing-card--featured">
            <div className="pricing-card__badge">Most Popular</div>
            <div className="pricing-card__header">
              <h3 className="pricing-card__title">Starter</h3>
              <div className="pricing-card__price">
                <span className="price">$24.99</span>
                <span className="period">/month</span>
              </div>
            </div>
            <div className="pricing-card__features">
              <ul>
                <li>100 candidate searches per month</li>
                <li>AI-powered email personalization</li>
                <li>Priority support</li>
                <li>Advanced analytics</li>
                <li>CRM integration</li>
              </ul>
            </div>
            <button className="btn btn--primary btn--full">Get Started</button>
          </div>
          
          <div className="pricing-card">
            <div className="pricing-card__header">
              <h3 className="pricing-card__title">Pro</h3>
              <div className="pricing-card__price">
                <span className="price">$39.99</span>
                <span className="period">/month</span>
              </div>
            </div>
            <div className="pricing-card__features">
              <ul>
                <li>Unlimited candidate searches</li>
                <li>Advanced AI personalizations</li>
                <li>Dedicated account manager</li>
                <li>Custom integrations</li>
                <li>White-label options</li>
                <li>Personal mentorship sessions</li>
              </ul>
            </div>
            <button className="btn btn--secondary btn--full">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing

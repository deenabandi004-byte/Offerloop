import './Hero.css'

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero__content">
          <h1 className="hero__title">
            Offerloop Fundamentally changes how you recruit
          </h1>
          <p className="hero__subtitle">
            We take the tedious, repetitive work out of recruiting. Spend less time stuck behind a screen and more time connecting with professionals and living your life.
          </p>
          <div className="hero__actions">
            <button className="btn btn--primary btn--large">Start Free Trial</button>
            <button className="btn btn--secondary btn--large">Watch Demo</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

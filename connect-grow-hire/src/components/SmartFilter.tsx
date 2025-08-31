import './SmartFilter.css'

const SmartFilter: React.FC = () => {
  return (
    <section className="smart-filter section">
      <div className="container">
        <h2 className="section-title">Smart Filter</h2>
        <p className="section-subtitle">
          Access our database of 2 billion + professionals and find the perfect candidates for your roles.
        </p>
        <div className="smart-filter__content">
          <div className="filter-demo">
            <div className="filter-card">
              <h3>Advanced Search</h3>
              <p>Filter by skills, experience, location, and more to find exactly who you're looking for.</p>
            </div>
            <div className="filter-card">
              <h3>Real-time Data</h3>
              <p>Our database is constantly updated with the latest professional information.</p>
            </div>
            <div className="filter-card">
              <h3>AI-Powered Matching</h3>
              <p>Let our AI suggest the best candidates based on your requirements.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SmartFilter

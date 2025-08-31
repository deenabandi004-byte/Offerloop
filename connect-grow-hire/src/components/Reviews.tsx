import './Reviews.css'

const Reviews: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Senior Recruiter at TechCorp",
      content: "Offerloop has completely transformed our recruitment process. The AI personalizations have increased our response rates by 300%.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Talent Acquisition Manager",
      content: "The smart filter feature is incredible. We can find the perfect candidates in minutes instead of hours.",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "HR Director",
      content: "The mentorship program has been invaluable. Our team's recruitment skills have improved dramatically.",
      rating: 5
    }
  ]

  return (
    <section className="reviews section">
      <div className="container">
        <h2 className="section-title">What Our Users Say</h2>
        <p className="section-subtitle">
          Join thousands of recruiters who have transformed their hiring process with Offerloop.
        </p>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-card__rating">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>
              <p className="review-card__content">"{review.content}"</p>
              <div className="review-card__author">
                <h4>{review.name}</h4>
                <p>{review.role}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="reviews-cta">
          <p>Join 25+ satisfied customers and start your free trial today!</p>
          <button className="btn btn--primary btn--large">Start Free Trial</button>
        </div>
      </div>
    </section>
  )
}

export default Reviews

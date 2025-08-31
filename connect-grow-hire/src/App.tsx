import Header from './components/Header'
import Hero from './components/Hero'
import JoinTheLoop from './components/JoinTheLoop'
import Features from './components/Features'
import SmartFilter from './components/SmartFilter'
import AIPersonalizations from './components/AIPersonalizations'
import PersonalMentorship from './components/PersonalMentorship'
import Pricing from './components/Pricing'
import Reviews from './components/Reviews'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <JoinTheLoop />
      <Features />
      <SmartFilter />
      <AIPersonalizations />
      <PersonalMentorship />
      <Pricing />
      <Reviews />
      <Footer />
    </div>
  )
}

export default App

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Check, Send, Calendar, Handshake, BarChart, Users, Target, MessageSquare, TrendingUp } from 'lucide-react';

const Index = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center h-full overflow-hidden">
            <span 
              className="text-2xl font-bold text-white cursor-pointer"
              onClick={() => navigate("/home")}
            >
              Offer<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">loop</span>.ai
            </span>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a>
            </nav>
            <button 
              onClick={() => navigate("/signin")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate("/signin")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-6xl lg:text-8xl font-bold tracking-tight mb-8">
              Join the <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Loop</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-16 leading-relaxed max-w-4xl mx-auto">
              We take the tedious, repetitive work out of recruiting. Spend less time stuck behind a screen and more time connecting with professionals and living your life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Instant Outreach</h3>
              <p className="text-gray-400 leading-relaxed">
                Outreach in a single click - curated emails that show up instantly in your email drafts.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Handshake className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Meaningful Connections</h3>
              <p className="text-gray-400 leading-relaxed">
                Maximize your ability to get and prepare for coffee chats.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <BarChart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Progress Tracking</h3>
              <p className="text-gray-400 leading-relaxed">
                Visualize your job search journey, track every application response, and stay organized all the way to your next offer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New Section Above Why Choose */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Offerloop Fundamentally changes how you recruit
          </h2>
          <p className="text-xl text-gray-300 max-w-5xl mx-auto leading-relaxed">
            Offerloop automates outreach, follow-ups, tracking, coffee chat prep and interview prep, essentially streamlining the whole process, saving the user from hundreds of hours of tedious tasks and be more intentional with your time.
          </p>
        </div>
      </section>

      {/* Why Choose Section */}
      <section id="features" className="py-20 px-6 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose Offerloop.ai?
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to streamline your recruiting process and land the best opportunities — in less time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-blue-400">Smart Filter</h3>
              <p className="text-xl text-gray-300 mb-8">
                Our AI-powered algorithm connects the right talent with the right opportunities from 2 billion+ professionals based on skills, experience, and culture fit.
              </p>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">Skills-based matching</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-300">Culture fit analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span className="text-gray-300">Experience alignment</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 backdrop-blur-sm border border-gray-700">
              <div className="w-full h-64 bg-gray-700/50 rounded-xl flex items-center justify-center">
                <Users className="w-16 h-16 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 backdrop-blur-sm border border-gray-700 md:order-1">
              <div className="w-full h-64 bg-gray-700/50 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <div className="md:order-2">
              <h3 className="text-3xl font-bold mb-6 text-purple-400">AI Personalizations</h3>
              <p className="text-xl text-gray-300 mb-8">
                Maximize your response rate and recruitment success with hyper personalized emails curated to capture attention.
              </p>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <p className="text-gray-300 italic">
                  "Personalized outreach messages crafted specifically for each professional to maximize engagement and response rates."
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-green-400">Personal Mentorship</h3>
              <p className="text-xl text-gray-300 mb-8">
                Schedule calls with current analysts and analyst interns to better prepare for recruiting.
              </p>
              <div className="space-y-4">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 flex items-center justify-between">
                  <span className="text-gray-300">Mentorship Sessions</span>
                  <span className="text-green-400 text-lg font-bold">24</span>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 flex items-center justify-between">
                  <span className="text-gray-300">Success Rate</span>
                  <span className="text-blue-400 text-lg font-bold">89%</span>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 flex items-center justify-between">
                  <span className="text-gray-300">Industry Experts</span>
                  <span className="text-purple-400 text-lg font-bold">150+</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl p-8 backdrop-blur-sm border border-gray-700">
              <div className="w-full h-64 bg-gray-700/50 rounded-xl flex items-center justify-center">
                <Users className="w-16 h-16 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 backdrop-blur-sm border border-gray-700 md:order-1">
              <div className="w-full h-64 bg-gray-700/50 rounded-xl flex items-center justify-center">
                <Target className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <div className="md:order-2">
              <h3 className="text-3xl font-bold mb-6 text-purple-400">Top-tier mentorship</h3>
              <p className="text-xl text-gray-300 mb-8">
                Get counseling from top talent and professionals across multiple industries to maximize your opportunity at landing your dream job.
              </p>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <p className="text-gray-300 italic">
                  "Connect with industry leaders and experienced professionals who can guide you through your career journey."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-300">
              Find the perfect plan to accelerate your career journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">5 applications per month</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Basic analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Email support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Application tracking</span>
                </li>
              </ul>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
                Get Started
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/50 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most popular
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$24.99</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">50 applications per month</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Advanced analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Priority support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Interview scheduling</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">AI matching</span>
                </li>
              </ul>
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-medium transition-colors">
                Get Started
              </button>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$39.99</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Unlimited applications</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Premium analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Personal mentorship</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Dedicated support</span>
                </li>
              </ul>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-6 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-300">
              Reviews coming soon - we're collecting feedback from our amazing users!
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">★</span>
              </div>
              <p className="text-gray-400 italic mb-4">Reviews coming soon...</p>
              <p className="text-gray-500 text-sm">- User testimonials will appear here</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">★</span>
              </div>
              <p className="text-gray-400 italic mb-4">Reviews coming soon...</p>
              <p className="text-gray-500 text-sm">- User testimonials will appear here</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">★</span>
              </div>
              <p className="text-gray-400 italic mb-4">Reviews coming soon...</p>
              <p className="text-gray-500 text-sm">- User testimonials will appear here</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Offerloop AI Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About Offerloop AI
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              We're revolutionizing the recruitment process by combining cutting-edge AI technology with human expertise. Our platform empowers professionals to focus on what matters most - building meaningful connections and advancing their careers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                To eliminate the tedious, time-consuming aspects of job searching and recruiting, allowing professionals to spend more time on strategic relationship building and career development.
              </p>
              <h3 className="text-2xl font-bold mb-6">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                A world where every professional has access to personalized, intelligent tools that accelerate their career growth and help them land their dream opportunities.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 backdrop-blur-sm border border-gray-700">
              <div className="w-full h-64 bg-gray-700/50 rounded-xl flex items-center justify-center">
                <Target className="w-16 h-16 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300">
              Have more questions? We're here to help!
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How does Offerloop.ai work?",
                answer: "Offerloop.ai streamlines your job search by automating applications, tracking responses, and connecting you with relevant opportunities. Our AI matches your profile with suitable positions and handles the repetitive tasks so you can focus on preparing for interviews."
              },
              {
                question: "What makes Offerloop.ai different?",
                answer: "We focus on quality over quantity. Instead of sending generic applications everywhere, we use smart matching to connect you with roles that truly fit your skills and career goals, resulting in higher response rates and better opportunities."
              },
              {
                question: "Is my data secure?",
                answer: "Absolutely. We use enterprise-grade security measures to protect your personal information and job search data. Your privacy is our top priority, and we never share your information without your explicit consent."
              },
              {
                question: "Can I cancel anytime?",
                answer: "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your access will continue until the end of your current billing period."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
                <button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-lg font-semibold">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800/50 py-16 px-6 border-t border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">
                Offer<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">loop</span>.ai
              </h3>
              <p className="text-gray-400 mb-4">
                Revolutionizing recruitment with AI-powered automation and personalized outreach.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://linkedin.com/company/offerloop" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="https://twitter.com/offerloop" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="https://instagram.com/offerloop" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="mailto:contact@offerloop.ai" className="hover:text-white transition-colors">Email</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8">
            <div className="text-center mb-6">
              <h4 className="font-semibold mb-4 text-white">Contact Information</h4>
              <div className="space-y-2 text-gray-400">
                <p>Email: contact@offerloop.ai</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: 123 Innovation Drive, Tech City, TC 12345</p>
              </div>
            </div>
            <div className="text-center text-gray-400">
              <p>&copy; 2024 Offerloop.ai. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Check, Send, Calendar, Handshake, BarChart, Users, Target, MessageSquare, TrendingUp, Zap } from 'lucide-react';

const Index = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span 
              className="text-2xl font-bold text-white cursor-pointer"
              onClick={() => navigate("/home")}
            >
              Offer<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">loop</span>.ai
            </span>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            </nav>
          </div>
          <div className="flex items-center gap-6">
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
          <div className="max-w-4xl mx-auto mb-24">
            <h1 className="text-6xl lg:text-8xl font-bold tracking-tight mb-12">
              Offerloop <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Fundamentally</span> changes how you recruit
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-16 leading-relaxed max-w-4xl mx-auto">
              We take the tedious, repetitive work out of recruiting. Spend less time stuck behind a screen and more time connecting with professionals and living your life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Instant Outreach</h3>
              <p className="text-gray-400 leading-relaxed">
                Outreach in a single click - curated emails that show up instantly in your email drafts.
              </p>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Personal Mentorship</h3>
              <p className="text-gray-400 leading-relaxed">
                Schedule calls with current analysts and analyst interns to better prepare for recruiting.
              </p>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Meaningful Connections</h3>
              <p className="text-gray-400 leading-relaxed">
                Maximize your ability to get and prepare for coffee chats.
              </p>
            </div>

            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-orange-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <BarChart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Progress Tracking</h3>
              <p className="text-gray-400 leading-relaxed">
                Monitor your recruitment pipeline with detailed analytics and insights to optimize your process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Filter Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Smart Filter
            </h2>
            <p className="text-xl text-gray-300">
              Access 2 billion+ professionals with intelligent filtering and AI-powered personalizations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-blue-400">2 Billion+ Professionals</h3>
              <p className="text-xl text-gray-300 mb-8">
                Access the world's largest database of professional contacts with advanced filtering capabilities to find exactly who you're looking for.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Advanced search filters</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Real-time data updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Global coverage</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-8 border border-blue-500/30">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-400 mb-4">2B+</div>
                <div className="text-xl text-gray-300">Professional Contacts</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-500/30">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-4">AI Powered</div>
                <div className="text-xl text-gray-300">Personalization Engine</div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-6 text-purple-400">AI Personalizations</h3>
              <p className="text-xl text-gray-300 mb-8">
                Maximize your response rate and recruitment success with hyper personalized emails curated to capture attention.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Personalized email generation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Context-aware messaging</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Higher response rates</span>
                </div>
              </div>
            </div>
          </div>
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
              <h3 className="text-3xl font-bold mb-6 text-blue-400">Smart Matching</h3>
              <p className="text-xl text-gray-300 mb-8">
                Our AI-powered algorithm connects the right talent with the right opportunities based on skills, experience, and culture fit.
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
              <h3 className="text-3xl font-bold mb-6 text-purple-400">Top-tier Mentorship</h3>
              <p className="text-xl text-gray-300 mb-8">
                Get counseling from top talent and professionals across multiple industries to maximize your opportunity at landing your dream job.
              </p>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <p className="text-gray-300 italic">
                  "Connect with industry professionals who can guide you through the recruiting process and help you prepare for success."
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-green-400">Analytics & Insights</h3>
              <p className="text-xl text-gray-300 mb-8">
                Track your hiring metrics, measure success rates, and optimize your recruitment process with detailed analytics.
              </p>
              <div className="space-y-4">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 flex items-center justify-between">
                  <span className="text-gray-300">Applications Sent</span>
                  <span className="text-green-400 text-lg font-bold">247</span>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 flex items-center justify-between">
                  <span className="text-gray-300">Response Rate</span>
                  <span className="text-blue-400 text-lg font-bold">34%</span>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 flex items-center justify-between">
                  <span className="text-gray-300">Interviews Scheduled</span>
                  <span className="text-purple-400 text-lg font-bold">12</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl p-8 backdrop-blur-sm border border-gray-700">
              <div className="w-full h-64 bg-gray-700/50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-16 h-16 text-gray-400" />
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
            {/* Free Trial Plan */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-300 mb-8">Perfect for getting started and exploring our platform</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Up to 10 candidate profiles</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Basic search filters</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Email templates</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Basic analytics</span>
                </li>
              </ul>
              
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors">
                Start Free Trial
              </button>
            </div>

            {/* Starter Plan */}
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
              <p className="text-gray-300 mb-8">Ideal for individual recruiters and small teams</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Up to 100 candidate profiles</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Advanced search & filters</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>AI-powered matching</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Automated outreach</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Basic mentorship access</span>
                </li>
              </ul>
              
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl font-semibold transition-all">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$39.99</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-300 mb-8">For growing teams and agencies with advanced needs</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Unlimited candidate profiles</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Premium AI personalizations</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Advanced analytics & insights</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Priority mentorship access</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Priority support</span>
                </li>
              </ul>
              
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Users Say</h2>
            <p className="text-xl text-gray-300">Join thousands of successful recruiters and job seekers</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-5 h-5 bg-yellow-400 rounded-full"></div>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">
                "Offerloop.ai completely transformed our recruiting process. We're finding better candidates faster than ever before."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                <div>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-gray-400 text-sm">HR Director, TechCorp</div>
                </div>
              </div>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-5 h-5 bg-yellow-400 rounded-full"></div>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">
                "The AI personalizations are incredible. Our response rates have increased by 300% since we started using Offerloop."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                <div>
                  <div className="font-semibold">Michael Chen</div>
                  <div className="text-gray-400 text-sm">Talent Acquisition Lead</div>
                </div>
              </div>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-5 h-5 bg-yellow-400 rounded-full"></div>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">
                "The mentorship program helped me land my dream job. The personalized guidance was invaluable."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <div>
                  <div className="font-semibold">Emily Rodriguez</div>
                  <div className="text-gray-400 text-sm">Software Engineer</div>
                </div>
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
      <footer id="about" className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="logo.png" 
                  alt="Offerloop.ai" 
                  className="h-16 w-auto object-contain"
                />
                <span className="text-2xl font-bold">
                  Offer<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">loop</span>.ai
                </span>
              </div>
              
              <div className="mb-8">
                <h3 className="font-semibold mb-4 text-white text-lg">About Offerloop.ai</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Offerloop.ai fundamentally changes how you recruit by taking the tedious, repetitive work out of the process. We help you spend less time stuck behind a screen and more time connecting with professionals and living your life.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Our platform combines AI-powered personalizations, access to 2 billion+ professionals, and top-tier mentorship to maximize your recruiting success.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-white">Follow Us</h4>
                <div className="flex items-center gap-4">
                  <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-white text-sm font-bold">f</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-white text-sm font-bold">t</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-white text-sm font-bold">in</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-white text-sm font-bold">ig</span>
                  </a>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/press" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Offerloop.ai. All rights reserved. Connecting talent with opportunity through intelligent recruiting solutions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

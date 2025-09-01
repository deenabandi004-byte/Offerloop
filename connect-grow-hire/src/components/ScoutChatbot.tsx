// src/components/ScoutChatbot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, ArrowUp } from 'lucide-react';
import { useResumeData } from '@/contexts/ResumeDataContext';

interface ScoutChatbotProps {
  onJobTitleSuggestion: (jobTitle: string) => void;
}

interface Message {
  id: number;
  type: string;
  content: string;
  jobTitle?: string | null;
  timestamp: Date;
}

const ScoutChatbot: React.FC<ScoutChatbotProps> = ({ onJobTitleSuggestion }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { resumeData } = useResumeData();
  const [hasLoadedRecommendations, setHasLoadedRecommendations] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm Scout 🕵️ I'll help you find the perfect job title to search for. What company are you interested in?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState({
    company: '',
    jobType: '',
    level: '',
    department: ''
  });
  const [step, setStep] = useState('company'); // company -> jobType -> level -> suggestions
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasLoadedRecommendations) {
      loadPersonalizedRecommendations();
      setHasLoadedRecommendations(true);
    }
  }, [isOpen, hasLoadedRecommendations]);

  const loadPersonalizedRecommendations = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
      
      const response = await fetch('http://localhost:5001/api/scout-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: resumeData?.fullText || '',
          onboardingData: onboardingData,
          userName: userData.name || resumeData?.firstName || 'there'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        setTimeout(() => {
          const personalizedMessage: Message = {
            id: Date.now(),
            type: 'bot',
            content: data.greeting,
            timestamp: new Date()
          };
          
          setMessages([personalizedMessage]);
          
          setTimeout(() => {
            const recommendationsMessage: Message = {
              id: Date.now() + 1,
              type: 'bot',
              content: `Here are some job titles perfect for your background:\n\n${data.recommendations.map((title: string, index: number) => `${index + 1}. ${title}`).join('\n')}\n\nFeel free to ask me for resume feedback, job search strategies, or more specific recommendations!`,
              timestamp: new Date()
            };
            
            setMessages(prev => [...prev, recommendationsMessage]);
          }, 1500);
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to load personalized recommendations:', error);
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addMessage = (content: string, type: string = 'user', jobTitle: string | null = null) => {
    const newMessage: Message = {
      id: Date.now(),
      type,
      content,
      jobTitle, // Store the job title for suggestion messages
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (callback: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 1000 + Math.random() * 1000);
  };

  const generateJobTitleSuggestions = async (company: string, jobType: string, level: string): Promise<string[]> => {
    try {
      console.log(`🤖 Scout: Using OpenAI to generate suggestions for ${level} ${jobType} at ${company}...`);
      
      // Call our OpenAI-powered endpoint - UPDATE THIS URL
      const response = await fetch('https://offshore-direct-linked-brass.trycloudflare.com/api/scout-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company: company,
          jobType: jobType,
          level: level
        })
      });

      if (response.ok) {
        const suggestionData = await response.json();
        console.log(`✅ OpenAI suggestions received:`, suggestionData);
        
        if (suggestionData.suggestions && suggestionData.suggestions.length > 0) {
          return suggestionData.suggestions;
        }
      } else {
        console.warn('⚠️ OpenAI suggestions failed, falling back to static suggestions');
      }
    } catch (error) {
      console.error('❌ Error calling OpenAI suggestions:', error);
    }

    // Fallback to our basic database if OpenAI fails
    return getBasicTitleSuggestions(jobType, level);
  };

  const getBasicTitleSuggestions = (jobType: string, level: string): string[] => {
    const basicTitles: Record<string, Record<string, string[]>> = {
      'engineering': {
        'entry': ['Software Engineer', 'Junior Software Engineer', 'Software Engineer I', 'Associate Software Engineer'],
        'mid': ['Software Engineer II', 'Senior Software Engineer', 'Full Stack Engineer', 'Backend Engineer'],
        'senior': ['Staff Software Engineer', 'Principal Engineer', 'Lead Software Engineer', 'Senior Staff Engineer'],
        'manager': ['Engineering Manager', 'Senior Engineering Manager', 'Director of Engineering', 'VP of Engineering']
      },
      'product': {
        'entry': ['Product Manager', 'Associate Product Manager', 'Junior Product Manager', 'Product Analyst'],
        'mid': ['Senior Product Manager', 'Product Manager II', 'Lead Product Manager', 'Principal Product Manager'],
        'senior': ['Staff Product Manager', 'Principal Product Manager', 'Senior Principal PM', 'Distinguished PM'],
        'manager': ['Director of Product', 'VP of Product', 'Head of Product', 'Chief Product Officer']
      },
      'marketing': {
        'entry': ['Marketing Manager', 'Marketing Specialist', 'Digital Marketing Manager', 'Marketing Coordinator'],
        'mid': ['Senior Marketing Manager', 'Product Marketing Manager', 'Growth Marketing Manager', 'Brand Manager'],
        'senior': ['Principal Marketing Manager', 'Lead Marketing Manager', 'Marketing Director', 'Senior Brand Manager'],
        'manager': ['Director of Marketing', 'VP of Marketing', 'Head of Marketing', 'Chief Marketing Officer']
      },
      'sales': {
        'entry': ['Account Executive', 'Sales Development Representative', 'Business Development Representative', 'Sales Associate'],
        'mid': ['Senior Account Executive', 'Sales Manager', 'Enterprise Account Executive', 'Strategic Account Manager'],
        'senior': ['Principal Account Executive', 'Lead Sales Manager', 'Senior Sales Director', 'Key Account Manager'],
        'manager': ['Sales Director', 'VP of Sales', 'Head of Sales', 'Chief Revenue Officer']
      },
      'data': {
        'entry': ['Data Scientist', 'Data Analyst', 'Junior Data Scientist', 'Business Analyst'],
        'mid': ['Senior Data Scientist', 'Machine Learning Engineer', 'Data Science Manager', 'Senior Data Analyst'],
        'senior': ['Principal Data Scientist', 'Staff Data Scientist', 'Lead Data Scientist', 'Distinguished Scientist'],
        'manager': ['Director of Data Science', 'VP of Data', 'Head of Analytics', 'Chief Data Officer']
      },
      'design': {
        'entry': ['UX Designer', 'UI Designer', 'Product Designer', 'Visual Designer'],
        'mid': ['Senior UX Designer', 'Senior Product Designer', 'Lead Designer', 'Design Manager'],
        'senior': ['Staff Designer', 'Principal Designer', 'Lead Product Designer', 'Design Director'],
        'manager': ['Design Manager', 'Director of Design', 'VP of Design', 'Head of Design']
      },
      'finance': {
        'entry': ['Financial Analyst', 'Investment Analyst', 'Junior Financial Analyst', 'Accounting Associate'],
        'mid': ['Senior Financial Analyst', 'Finance Manager', 'Investment Associate', 'Senior Analyst'],
        'senior': ['Principal Financial Analyst', 'Senior Finance Manager', 'Finance Director', 'Investment Director'],
        'manager': ['Finance Director', 'VP of Finance', 'CFO', 'Head of Finance']
      },
      'operations': {
        'entry': ['Operations Manager', 'Business Operations Analyst', 'Operations Coordinator', 'Program Coordinator'],
        'mid': ['Senior Operations Manager', 'Business Operations Manager', 'Program Manager', 'Operations Lead'],
        'senior': ['Principal Operations Manager', 'Lead Program Manager', 'Operations Director', 'Senior Program Manager'],
        'manager': ['Director of Operations', 'VP of Operations', 'Head of Operations', 'Chief Operating Officer']
      }
    };

    return basicTitles[jobType]?.[level] || ['Software Engineer', 'Product Manager', 'Marketing Manager', 'Sales Manager'];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    addMessage(userMessage, 'user');
    setInputMessage('');

    // Process the conversation based on current step
    if (step === 'company') {
      setConversation(prev => ({ ...prev, company: userMessage }));
      
      simulateTyping(() => {
        addMessage("Perfect! What type of role are you looking for? (e.g., engineering, product, marketing, sales, data, design, finance, operations)", 'bot');
        setStep('jobType');
      });
    } 
    else if (step === 'jobType') {
      const normalizedJobType = userMessage.toLowerCase();
      let detectedType = 'engineering'; // default
      
      if (normalizedJobType.includes('engineer') || normalizedJobType.includes('tech') || normalizedJobType.includes('software') || normalizedJobType.includes('developer')) {
        detectedType = 'engineering';
      } else if (normalizedJobType.includes('product')) {
        detectedType = 'product';
      } else if (normalizedJobType.includes('market')) {
        detectedType = 'marketing';
      } else if (normalizedJobType.includes('sales') || normalizedJobType.includes('business dev')) {
        detectedType = 'sales';
      } else if (normalizedJobType.includes('data') || normalizedJobType.includes('analyst') || normalizedJobType.includes('science')) {
        detectedType = 'data';
      } else if (normalizedJobType.includes('design') || normalizedJobType.includes('ux') || normalizedJobType.includes('ui')) {
        detectedType = 'design';
      } else if (normalizedJobType.includes('finance') || normalizedJobType.includes('accounting') || normalizedJobType.includes('investment')) {
        detectedType = 'finance';
      } else if (normalizedJobType.includes('operations') || normalizedJobType.includes('ops')) {
        detectedType = 'operations';
      }
      
      setConversation(prev => ({ ...prev, jobType: detectedType }));
      
      simulateTyping(() => {
        addMessage("Got it! What level are you targeting? (entry, mid, senior, manager)", 'bot');
        setStep('level');
      });
    }
    else if (step === 'level') {
      const normalizedLevel = userMessage.toLowerCase();
      let detectedLevel = 'mid'; // default
      
      if (normalizedLevel.includes('entry') || normalizedLevel.includes('junior') || normalizedLevel.includes('new grad') || normalizedLevel.includes('associate')) {
        detectedLevel = 'entry';
      } else if (normalizedLevel.includes('senior') || normalizedLevel.includes('lead') || normalizedLevel.includes('principal') || normalizedLevel.includes('staff')) {
        detectedLevel = 'senior';
      } else if (normalizedLevel.includes('manager') || normalizedLevel.includes('director') || normalizedLevel.includes('head') || normalizedLevel.includes('vp')) {
        detectedLevel = 'manager';
      }
      
      const finalConversation = { ...conversation, level: detectedLevel };
      setConversation(finalConversation);
      
      simulateTyping(async () => {
        // FIXED: Properly await the async function
        const suggestions = await generateJobTitleSuggestions(finalConversation.company, finalConversation.jobType, detectedLevel);
        
        addMessage(`Perfect! Based on your interest in ${finalConversation.jobType} roles at ${finalConversation.company}, here are the most common job titles to search for:`, 'bot');
        
        setTimeout(() => {
          suggestions.forEach((title, index) => {
            setTimeout(() => {
              // Create the message with the clean title stored separately
              const newMessage: Message = {
                id: Date.now(),
                type: 'suggestion',
                content: `${index + 1}. ${title}`,
                jobTitle: title, // Store the clean job title
                timestamp: new Date()
              };
              setMessages(prev => [...prev, newMessage]);
            }, index * 300);
          });
          
          setTimeout(() => {
            addMessage("Click any suggestion above to use it in your search, or ask me to find more specific titles! 🎯", 'bot');
          }, suggestions.length * 300 + 500);
        }, 1000);
        
        setStep('suggestions');
      });
    }
    else if (step === 'suggestions') {
      // Handle follow-up questions
      simulateTyping(() => {
        addMessage("Let me help you refine that search! What specific aspects of the role are you most interested in?", 'bot');
      });
    }
  };

  const handleSuggestionClick = (jobTitle: string | null | undefined) => {
    if (onJobTitleSuggestion && jobTitle) {
      onJobTitleSuggestion(jobTitle);
    }
    addMessage(`Great choice! I've filled in "${jobTitle}" for you. You can now complete your search! 🚀`, 'bot');
  };

  const resetConversation = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: "Hi! I'm Scout 🕵️ I'll help you find the perfect job title to search for. What company are you interested in?",
        timestamp: new Date()
      }
    ]);
    setConversation({ company: '', jobType: '', level: '', department: '' });
    setStep('company');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#fff6e2' }}>
                <img 
                  src="/scout-mascot.png" 
                  alt="Scout AI" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Scout AI</h3>
                <p className="text-xs opacity-90">Job Title Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : message.type === 'suggestion'
                      ? 'bg-green-50 text-green-800 border border-green-200 cursor-pointer hover:bg-green-100 transition-colors rounded-bl-sm'
                      : 'bg-gray-50 text-gray-800 rounded-bl-sm border border-gray-100'
                  }`}
                  onClick={message.type === 'suggestion' && message.jobTitle ? () => handleSuggestionClick(message.jobTitle) : undefined}
                >
                  {message.content}
                  {message.type === 'suggestion' && (
                    <div className="mt-1 text-xs text-green-600 flex items-center">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      Click to use
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-50 text-gray-800 p-3 rounded-lg rounded-bl-sm max-w-[80%] border border-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={resetConversation}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Start over
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-gray-600 hover:bg-gray-700'
            : 'hover:shadow-xl border border-gray-200'
        }`}
        style={{
          backgroundColor: isOpen ? undefined : '#fff6e2'
        }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <img 
              src="/scout-mascot.png" 
              alt="Scout AI" 
              className="w-8 h-8 object-contain"
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Ask Scout for job title help
        </div>
      )}
    </div>
  );
};

export default ScoutChatbot;

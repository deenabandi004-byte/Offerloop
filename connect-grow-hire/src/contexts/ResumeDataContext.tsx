import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ResumeData {
  name?: string;
  firstName?: string;
  lastName?: string;
  university?: string;
  major?: string;
  year?: string;
  skills?: string[];
  experience?: string[];
  fullText?: string;
}

interface ResumeDataContextType {
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData | null) => void;
  clearResumeData: () => void;
}

const ResumeDataContext = createContext<ResumeDataContextType | undefined>(undefined);

export const useResumeData = () => {
  const context = useContext(ResumeDataContext);
  if (context === undefined) {
    throw new Error('useResumeData must be used within a ResumeDataProvider');
  }
  return context;
};

interface ResumeDataProviderProps {
  children: ReactNode;
}

export const ResumeDataProvider: React.FC<ResumeDataProviderProps> = ({ children }) => {
  const [resumeData, setResumeDataState] = useState<ResumeData | null>(null);

  const setResumeData = (data: ResumeData | null) => {
    setResumeDataState(data);
    if (data) {
      localStorage.setItem('resumeData', JSON.stringify(data));
    } else {
      localStorage.removeItem('resumeData');
    }
  };

  const clearResumeData = () => {
    setResumeDataState(null);
    localStorage.removeItem('resumeData');
  };

  React.useEffect(() => {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
      try {
        setResumeDataState(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to parse saved resume data:', error);
        localStorage.removeItem('resumeData');
      }
    }
  }, []);

  return (
    <ResumeDataContext.Provider value={{ resumeData, setResumeData, clearResumeData }}>
      {children}
    </ResumeDataContext.Provider>
  );
};

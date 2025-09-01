import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut, isLoading } = useAuth();

  const handleSignOut = () => {
    signOut();
    navigate("/home");
  };

  return (
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
          <div className="flex items-center gap-4">
            {isLoading ? (
              // Loading state
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : user ? (
              // User is signed in - show profile and sign out
              <div className="flex items-center gap-4">
                {/* User Profile */}
                <div className="flex items-center gap-2">
                  <img 
                    src={user.picture} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-blue-500"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                
                {/* Sign Out Button */}
                <button 
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              // User is NOT signed in - show sign in/up buttons
              <>
                <button 
                  onClick={() => navigate("/signin")}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors text-white"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate("/signin")}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6 py-2 rounded-lg font-medium transition-colors text-white"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

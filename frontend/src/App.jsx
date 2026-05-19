import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './views/LandingPage';
import AIWorkspace from './views/AIWorkspace';
import DatasetHub from './views/DatasetHub';
import SmartAnalytics from './views/SmartAnalytics';
import Sidebar from './components/Sidebar';
import AIChatbot from './components/AIChatbot';

function App() {
  return (
    <Router>
      <div className="flex h-screen w-full bg-[#020617] text-white overflow-hidden">
        <Routes>
          {/* Landing page has no sidebar */}
          <Route path="/" element={<LandingPage />} />
          
          {/* App routes with sidebar */}
          <Route path="/*" element={
            <div className="flex h-full w-full">
              <Sidebar />
              <div className="flex-1 relative overflow-y-auto">
                <Routes>
                  <Route path="/dashboard" element={<AIWorkspace />} />
                  <Route path="/upload" element={<DatasetHub />} />
                  <Route path="/analytics" element={<SmartAnalytics />} />
                </Routes>
                <AIChatbot />
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

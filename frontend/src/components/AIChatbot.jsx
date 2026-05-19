import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am your Aura AI assistant. How can I help you analyze your data today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'I am analyzing your request. Based on your current dataset, I recommend focusing on feature engineering for the categorical variables.' 
      }]);
    }, 1000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-110 transition z-50"
      >
        <MessageSquare className="text-white" size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 h-[500px] glass-panel bg-[#0f172a]/95 flex flex-col overflow-hidden z-50 border border-amber-500/30 shadow-2xl"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-2">
                <Bot className="text-amber-400" size={20} />
                <span className="font-medium text-sm">Aura Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-amber-500/20' : 'bg-yellow-500/20'}`}>
                    {msg.role === 'ai' ? <Bot size={16} className="text-amber-400" /> : <User size={16} className="text-yellow-400" />}
                  </div>
                  <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${
                    msg.role === 'ai' ? 'bg-white/5 rounded-tl-sm text-gray-300' : 'bg-amber-600 rounded-tr-sm text-white'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-white/5 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your data..."
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-500"
              />
              <button onClick={handleSend} className="text-amber-400 hover:text-amber-300 p-1">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;

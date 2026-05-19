import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileSpreadsheet, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DatasetHub = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await axios.post('http://127.0.0.1:8000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploading(false);
      setUploaded(true);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
      alert("Failed to upload dataset. Check console for details.");
    }
  };

  return (
    <div className="p-10 max-w-5xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Dataset Hub</h1>
        <p className="text-gray-400">Import your intelligence data to begin the automated machine learning workflow.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`glass-panel border-2 border-dashed p-12 flex flex-col items-center justify-center text-center transition-all duration-300 ${
              isDragging ? 'border-amber-500 bg-amber-500/10 scale-[1.02]' : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <UploadCloud size={40} className="text-amber-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Drag & Drop your dataset</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-sm">
              Supported formats: CSV. Max file size: 50MB. Make sure your data is tabular.
            </p>
            
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              accept=".csv"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
            <label 
              htmlFor="file-upload"
              className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer font-medium text-sm"
            >
              Browse Files
            </label>
          </div>

          <AnimatePresence>
            {file && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet className="text-yellow-400" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                
                {uploaded ? (
                  <CheckCircle2 className="text-green-500" />
                ) : (
                  <button 
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 transition text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                  >
                    {uploading ? (
                      <span className="animate-pulse">Uploading...</span>
                    ) : (
                      'Upload Dataset'
                    )}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {uploaded && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 flex items-center gap-2 font-medium hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition"
              >
                Proceed to Dashboard <ChevronRight size={18} />
              </button>
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-6">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-amber-400" /> Pre-requisites
            </h3>
            <ul className="text-sm text-gray-400 space-y-3">
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5" /> File must have headers</li>
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5" /> No completely empty columns</li>
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5" /> Numerical or categorical target</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetHub;

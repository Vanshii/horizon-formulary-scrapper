import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Pill, 
  AlertCircle, 
  ExternalLink, 
  TrendingUp,
  Database,
  Sparkles,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  Calendar,
  Tag,
  Info
} from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/stats`);
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await axios.post(`${API_URL}/query`, { question });
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  const exampleQuestions = [
    "List all details for the drug Trazimera",
    "What oncology drugs are preferred?",
    "Show me drugs with HCPCS code Q5116",
    "What's the status of Keytruda?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Pill className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Horizon Formulary AI
                </h1>
                <p className="text-sm text-gray-500 font-medium">Intelligent Drug Information System</p>
              </div>
            </div>
            
            {stats && (
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total Drugs</p>
                    <p className="text-lg font-bold text-gray-900">{stats.total_drugs}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-lg">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">AI Powered</p>
                    <p className="text-sm font-semibold text-indigo-600">RAG + Gemini</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section - Only show when no response */}
        {!response && !loading && (
          <div className="text-center mb-12 mt-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Powered by RAG & Gemini AI</span>
            </div>
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Ask Anything About Drug Formulary
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get instant, AI-powered answers about Horizon Blue Cross Blue Shield's preferred medical drugs
            </p>
          </div>
        )}

       {/* Search Box */}
<div className="max-w-4xl mx-auto mb-10">
  <form onSubmit={handleSubmit} className="relative">
    <div className="relative shadow-xl">
      <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about any drug... (e.g., 'What is the status of Keytruda?')"
        className="w-full pl-16 pr-36 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white text-blue-600 placeholder-gray-400"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !question.trim()}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {loading ? (
          <span className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Searching...</span>
          </span>
        ) : (
          'Search'
        )}
      </button>
    </div>
  </form>



          {/* Example Questions */}
          {!response && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-600 mb-3">Try these examples:</p>
              <div className="flex flex-wrap gap-3">
                {exampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuestion(q)}
                    className="text-sm bg-white border-2 border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:border-blue-400 hover:text-blue-600 hover:shadow-md transition-all font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-start space-x-4 shadow-md">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-red-900 font-bold text-lg mb-1">Error Occurred</p>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-gray-100">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-100 border-t-blue-600"></div>
                  <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="text-2xl text-gray-900 font-bold mb-2">Analyzing your question...</p>
                  <p className="text-gray-600">Searching through {stats?.total_drugs || '133'} drugs with AI</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Response Section */}
        {response && !loading && (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Your Question */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-1">YOUR QUESTION</p>
                  <p className="text-gray-800 text-lg font-medium">{response.question}</p>
                </div>
              </div>
            </div>

            {/* AI Answer */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-gray-100">
              <div className="flex items-start space-x-4 mb-6 pb-6 border-b-2 border-gray-100">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">AI Response</h3>
                  <p className="text-sm text-gray-500 font-medium">Generated by Gemini AI with RAG</p>
                </div>
              </div>
              <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed">
                {response.answer.split('\n').map((paragraph, idx) => (
                  paragraph.trim() && <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Relevant Drugs - Structured Table View */}
            {response.relevant_drugs && response.relevant_drugs.length > 0 && (
              <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-gray-100">
                <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Relevant Drugs</h3>
                      <p className="text-sm text-gray-500 font-medium">{response.relevant_drugs.length} drugs found</p>
                    </div>
                  </div>
                  <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                    <p className="text-sm text-indigo-700 font-semibold">Sorted by Relevance</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {response.relevant_drugs.map((drug, idx) => (
                    <div 
                      key={idx}
                      className="border-2 border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-blue-300 transition-all bg-gradient-to-br from-white to-gray-50"
                    >
                      {/* Drug Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h4 className="font-bold text-gray-900 text-2xl">
                              {drug['Drug Name']}
                            </h4>
                            {drug['Drug Status'] === 'Preferred' ? (
                              <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-bold">Preferred</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-bold">{drug['Drug Status']}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Relevance Score Badge */}
                        <div className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow-lg">
                          <p className="text-xs font-semibold mb-0.5">Relevance</p>
                          <p className="text-2xl font-bold">{(drug.relevance_score * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                      
                      {/* Drug Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* HCPCS Code */}
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Tag className="w-5 h-5 text-blue-600" />
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">HCPCS Code</p>
                          </div>
                          <p className="text-xl font-bold text-gray-900">{drug.HCPCS}</p>
                        </div>
                        
                        {/* Category */}
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <BarChart3 className="w-5 h-5 text-indigo-600" />
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category</p>
                          </div>
                          <p className="text-lg font-bold text-gray-900">{drug.Category}</p>
                        </div>
                        
                        {/* Effective Date */}
                        {drug['Eff. Date'] && (
                          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Calendar className="w-5 h-5 text-purple-600" />
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Effective Date</p>
                            </div>
                            <p className="text-lg font-bold text-gray-900">{drug['Eff. Date']}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data Source Attribution */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-10 shadow-2xl text-white">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-2xl mb-3">Data Source & Attribution</h4>
                  <p className="text-blue-100 text-lg mb-4 leading-relaxed">
                    All information is sourced from the official <strong>Horizon Blue Cross Blue Shield</strong> Preferred Medical Drugs Formulary. 
                    This data is processed using RAG (Retrieval-Augmented Generation) technology powered by FAISS vector search and Gemini AI.
                  </p>
                  <a
                    href={response.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all"
                  >
                    <span>View Original Formulary</span>
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Dashboard - Only show when no response */}
        {!response && !loading && stats && (
          <div className="max-w-6xl mx-auto mt-16">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-10">Database Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <p className="text-5xl font-extrabold text-gray-900 mb-2 text-center">{stats.total_drugs}</p>
                <p className="text-gray-600 text-center font-semibold">Total Drugs</p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <p className="text-5xl font-extrabold text-gray-900 mb-2 text-center">
                  {Object.keys(stats.categories || {}).length}
                </p>
                <p className="text-gray-600 text-center font-semibold">Categories</p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="text-5xl font-extrabold text-gray-900 mb-2 text-center">AI</p>
                <p className="text-gray-600 text-center font-semibold">Powered Search</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <p className="text-xl font-bold text-gray-900">Horizon Formulary AI</p>
            </div>
            <p className="text-gray-600 mb-3">
              Data scraped from{' '}
              <a
                href="https://www.horizonblue.com/providers/products-programs/pharmacy/pharmacy-programs/preferred-medical-drugs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-bold underline"
              >
                Horizon Blue Cross Blue Shield
              </a>
            </p>
            <p className="text-gray-500 text-sm">
              Powered by RAG (Retrieval-Augmented Generation) • FAISS Vector Search • Gemini AI • React • Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
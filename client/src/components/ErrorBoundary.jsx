import React from "react";
import { FaExclamationTriangle, FaRedo, FaHome } from "react-icons/fa";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
          <div className="text-center max-w-md animate-fade-in-up">
            <div className="bg-rose-50 dark:bg-rose-950/30 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-100 dark:border-rose-800">
              <FaExclamationTriangle className="h-8 w-8 text-rose-500" />
            </div>

            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
              Something went wrong
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
              An unexpected error occurred. This has been noted and we&apos;re
              working on a fix.
            </p>

            {this.state.error && (
              <details className="text-left bg-slate-100 dark:bg-slate-800 rounded-xl p-4 mb-6 mt-4">
                <summary className="text-xs font-medium text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                  Error details
                </summary>
                <pre className="text-xs text-rose-600 mt-2 whitespace-pre-wrap break-words">
                  {this.state.error.message || String(this.state.error)}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-estate-800 hover:bg-estate-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-estate-800/20 hover:shadow-xl text-sm cursor-pointer"
              >
                <FaRedo className="h-3 w-3" />
                Try Again
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-all duration-200 text-sm"
              >
                <FaHome className="h-3.5 w-3.5" />
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

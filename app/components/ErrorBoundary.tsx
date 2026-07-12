"use client"

import { Component, ReactNode, ErrorInfo } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("KADS LABS ErrorBoundary caught:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-navy-950 text-white p-6">
            <div className="max-w-md text-center glass-card rounded-2xl p-8 glow-border">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
              <p className="text-white/70 mb-6">
                The page encountered an error. Please try refreshing or reopening the file.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-lg bg-electric text-white font-semibold hover:bg-electric-glow transition-colors"
              >
                Reload Page
              </button>
              {this.state.error && (
                <p className="mt-4 text-xs text-white/40 font-mono break-words">
                  {this.state.error.message}
                </p>
              )}
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

import { Component } from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application error boundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-4 py-10 sm:px-6">
          <section
            role="alert"
            aria-live="polite"
            className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_24px_70px_rgba(249,115,22,0.12)]"
          >
            <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 sm:p-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-orange-600 shadow-sm">
                Something went wrong
              </span>

              <h1 className="mt-5 text-[clamp(2.2rem,5vw,3.75rem)] font-black tracking-tight text-stone-950">
                We hit an unexpected issue.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
                The store is still available. You can return home or continue shopping from a fresh page without losing your place in the rest of the site.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link
                  to="/"
                  onClick={this.handleReset}
                  className="btn btn-primary w-full py-4 text-base font-bold"
                >
                  Home
                </Link>

                <Link
                  to="/"
                  onClick={this.handleReset}
                  className="btn btn-secondary w-full py-4 text-base font-bold"
                >
                  Continue Shopping
                </Link>
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                If the issue keeps happening, refresh the page and try again.
              </p>
            </div>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
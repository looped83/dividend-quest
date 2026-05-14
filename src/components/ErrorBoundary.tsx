import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Dividend Quest] Render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-screen" role="alert">
          <h1 className="error-screen__title">
            Fehler beim Laden
          </h1>
          <p className="error-screen__message">
            {this.state.message || 'Ein unbekannter Fehler ist aufgetreten.'}
          </p>
          <button
            className="btn-primary"
            style={{ width: 'auto', marginTop: '16px' }}
            onClick={() => window.location.reload()}
          >
            Seite neu laden
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

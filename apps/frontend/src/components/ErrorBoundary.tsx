import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ServerErrorPage } from '../pages/errors/ServerErrorPage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary capturó:', error, info);
    // Enviar a servicio de monitoreo (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return <ServerErrorPage error={this.state.error} />;
    }
    return this.props.children;
  }
}
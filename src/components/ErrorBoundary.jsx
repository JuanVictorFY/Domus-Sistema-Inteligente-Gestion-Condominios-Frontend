import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '40vh' }}>
          <div className="text-center p-5">
            <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '3rem' }}></i>
            <h4 className="text-white mt-3">Algo salió mal</h4>
            <p className="text-secondary">Ocurrió un error inesperado en esta sección.</p>
            <button className="btn btn-outline-info" onClick={() => this.setState({ hasError: false, error: null })}>
              Reintentar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

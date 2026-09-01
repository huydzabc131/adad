import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error in component tree:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleResetStorage = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div id="error-boundary-screen" className="min-h-screen w-full bg-[#0A0C10] text-[#E6EDF3] flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-lg w-full bg-[#161B22] border border-[#30363D] rounded-xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 flex-shrink-0" size={28} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#F0F6FC] tracking-tight">Đã xảy ra sự cố hiển thị</h2>
              <p className="text-sm text-[#8B949E] leading-relaxed">
                {this.state.error?.message || 'Ứng dụng đã gặp lỗi không mong muốn khi tải giao diện.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                id="btn-error-retry"
                type="button"
                onClick={this.handleRetry}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
              >
                <RefreshCw className="w-3.5 h-3.5 flex-shrink-0" size={14} />
                <span>Thử tải lại thành phần</span>
              </button>

              <button
                id="btn-error-reload"
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2.5 bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] border border-[#30363D] rounded-lg text-xs font-medium inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Tải lại trang</span>
              </button>

              <button
                id="btn-error-reset-storage"
                type="button"
                onClick={this.handleResetStorage}
                className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" size={14} />
                <span>Khôi phục dữ liệu mặc định</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


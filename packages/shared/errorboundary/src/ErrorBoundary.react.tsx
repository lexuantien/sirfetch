import React from "react";
import { ErrorPubSub, getErrorSafe } from "@farfetchd/fblogger"
import { getReactElementDisplayName } from "@farfetchd/utils";
import ErrorSerializer from "@farfetchd/fblogger/src/ErrorSerializer";
import { Error2, ErrorProps } from "@farfetchd/common";

function getReactDisplayName(children: any) {
  children = React.Children.count(children) > 1 ? React.Children.toArray(children)[0] : children;
  return getReactElementDisplayName(children)
}

type ErrorBoundaryProps = typeof ErrorBoundaryReact.defaultProps & {
  children?: React.ReactNode
  fallback?: (error?: Error2, moduleName?: string) => any
  forceResetErrorCount?: number
  context?: ErrorProps
  onError?: (error: Error2, ...args) => any
  description?: string
}

interface States {
  moduleName: string
  error: Error2 | null
}

class ErrorBoundaryReact extends React.Component<ErrorBoundaryProps, States> {

  static defaultProps = {
    forceResetErrorCount: 0
  };

  suppressReactDefaultErrorLogging: boolean;

  static getDerivedStateFromError(error: Error) {
    return {
      error: getErrorSafe(error)
    }
  }

  constructor(props) {
    super(props);

    this.suppressReactDefaultErrorLogging = true;

    this.state = {
      error: null,
      moduleName: getReactDisplayName(props.children)
    }
  }

  componentDidCatch(e: Error, errorInfo: React.ErrorInfo) {
    const componentStack = errorInfo.componentStack;
    let { context, description, } = this.props;
    const { onError } = this.props

    context === undefined && (context = {})
    description === undefined && (description = "base")

    if (context.messageFormat == null) {
      context.messageFormat = "caught error in module %s (%s)"
      context.messageParams = [this.state.moduleName, description]
    }

    const { error, moduleName } = this.state;

    if (error != null) {
      ErrorSerializer.aggregateError(error, {
        componentStack,
        loggingSource: "ERROR_BOUNDARY",
        ...context
      } as ErrorProps)
      ErrorPubSub.reportError(error)
      typeof onError === "function" && onError(error, moduleName)
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.error && (this.props.forceResetErrorCount != null && this.props.forceResetErrorCount != prevProps.forceResetErrorCount)) {
      this.setState({
        error: null
      });
      return
    }
  }

  render() {
    const { error, moduleName } = this.state
    if (error) {
      const { fallback } = this.props;
      return fallback != null ? fallback(error, moduleName) : null
    }
    return this.props.children != null ? this.props.children : null
  }
}

export default ErrorBoundaryReact
export { ErrorBoundaryReact, ErrorBoundaryProps }
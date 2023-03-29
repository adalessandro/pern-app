import { Alert } from 'antd';
import React from 'react';
import { connect } from 'react-redux';

import { resetCache } from '../app/services/api';


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidMount() {
    //console.log('mount');
    //console.log(this.state.hasError);

    if (this.state.hasError) {
      this.props.reset();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //console.log('update');
    //console.log(this.state.hasError);
    if (prevState.hasError === false && this.state.hasError === true) {
      this.props.reset();
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  /*
      componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        logErrorToMyService(error, errorInfo);
      }
    */
  render() {
    if (this.state.hasError) {
      return (
        <Alert
          message="Error"
          description="There was an error, please contact IT"
          type="error"
          closable
          onClose={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reset: () => dispatch(resetCache()),
  };
};

export default connect(null, mapDispatchToProps)(ErrorBoundary);

import React from 'react';
import './App.css';

import Private from './features/private/Layout'
import Public from './features/public/Layout'
import { useAppSelector } from './app/hooks';
import { isLogged } from './features/user/userSlice'
import  ErrorBoundary  from './utils/ErrorBoundary';



const App: React.FC = () => {
  const privateLayout = useAppSelector(isLogged);

  if (privateLayout) {
    return (<Private />);
  }

  return (
    <ErrorBoundary>
      <Public />
    </ErrorBoundary>);


}


export default App;
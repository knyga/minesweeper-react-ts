import React from 'react';
import Grid from './components/Grid';
import './App.css'

function App() {
  return (
    <div className='app'>
      <div>Disclaimer: App is created to be used during the QA challenge and has numerous bugs which are supposed to be discovered.</div>
      <div>
          <Grid rows={8} cols={8} />
      </div>
    </div>
  );
}

export default App;

import React from 'react';
import './App.scss';
import { DashTop } from './dashparts/dash-top/dash-top';
import { Tabs, TabsSwitch } from './dashparts/tabs/tabs';

const App: React.FC = () => {

  return (
    <div className="App">
      <DashTop />
      <TabsSwitch />
      <Tabs />
    </div>
  );
}

export default App;

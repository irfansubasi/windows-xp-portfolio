import { Desktop } from './components/Desktop/Desktop';
import { Taskbar } from './components/Taskbar/Taskbar';
import { WindowManager } from './components/Windows/WindowManager/WindowManager';
import { WebampManager } from './components/Webamp/WebampManager';
import { WindowProvider } from './context/WindowContext';

function App() {
  return (
    <WindowProvider>
      <Desktop />
      <Taskbar />
      <WindowManager />
      <WebampManager />
    </WindowProvider>
  );
}

export default App;

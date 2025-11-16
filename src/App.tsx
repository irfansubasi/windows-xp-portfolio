import { Desktop } from './components/Desktop/Desktop';
import { Taskbar } from './components/Taskbar/Taskbar';
import { WindowManager } from './components/Windows/WindowManager/WindowManager';
import { WindowProvider } from './context/WindowContext';

function App() {
  return (
    <WindowProvider>
      <Desktop />
      <Taskbar />
      <WindowManager />
    </WindowProvider>
  );
}

export default App;

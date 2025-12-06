import { Desktop } from './components/Desktop/Desktop';
import { Taskbar } from './components/Taskbar/Taskbar';
import { WindowManager } from './components/Windows/WindowManager/WindowManager';
import { WebampManager } from './components/Webamp/WebampManager';
import { WindowProvider } from './context/WindowContext';
import { VolumeProvider } from './context/VolumeContext';
import StartMenu from './components/StartMenu/StartMenu';

function App() {
  return (
    <VolumeProvider>
      <WindowProvider>
        <StartMenu />
        <Desktop />
        <Taskbar />
        <WindowManager />
        <WebampManager />
      </WindowProvider>
    </VolumeProvider>
  );
}

export default App;

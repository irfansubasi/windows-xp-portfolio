import { Desktop } from './components/Desktop/Desktop';
import { Taskbar } from './components/Taskbar/Taskbar';
import { Window } from './components/Windows/Window/Window';
import { WindowContent } from './components/Windows/WindowContent/WindowContent';

function App() {
  return (
    <>
      <Desktop />
      <Taskbar />
      <Window title="My Window" icon="/assets/mail.png">
        <WindowContent />
      </Window>
    </>
  );
}

export default App;

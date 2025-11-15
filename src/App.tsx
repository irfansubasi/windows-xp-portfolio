import { Desktop } from './components/Desktop/Desktop';
import { Taskbar } from './components/Taskbar/Taskbar';
import { Window } from './components/Windows/Window/Window';

function App() {
  return (
    <>
      <Desktop />
      <Taskbar />
      <Window title="My Window" icon="/assets/mail.png">
        <div>Hello, world!</div>
      </Window>
    </>
  );
}

export default App;

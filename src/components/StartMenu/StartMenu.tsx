import { gameDefinitions } from '../../config/gameDefinitions';
import { desktopIcons } from '../../config/windowDefinitions';
import { useWindowContext } from '../../context/useWindowContext';
import styles from './StartMenu.module.css';

export default function StartMenu() {
  const { openWindow } = useWindowContext();

  const resumeItem = desktopIcons.find((icon) => icon.id === 'resume');
  const contactItem = desktopIcons.find((icon) => icon.id === 'contact');

  const otherItems = desktopIcons.filter(
    (icon) =>
      icon.id !== 'resume' && icon.id !== 'contact' && icon.id !== 'gamesFolder'
  );

  const featuredGames = gameDefinitions.filter((game) =>
    ['minesweeper', 'quake', 'spiderSolitaire'].includes(game.id)
  );

  const handleOpenApp = (
    icon: (typeof desktopIcons)[0] | (typeof gameDefinitions)[0]
  ) => {
    openWindow(
      icon.id,
      icon.name,
      icon.icon,
      icon.windowContent,
      icon.windowConfig?.size,
      icon.windowConfig?.toolbarItems,
      {
        hideAddressBar: icon.windowConfig?.hideAddressBar,
        hideToolbar: icon.windowConfig?.hideToolbar,
        hideMenubar: icon.windowConfig?.hideMenubar,
        disableResize: icon.windowConfig?.disableResize,
      }
    );
  };

  return (
    <div className={styles.startMenu}>
      <div className={styles.topBar}></div>
      <div className={styles.orangeLine}></div>
      <div className={styles.content}>
        <div className={styles.leftPanel}>
          {resumeItem && (
            <div
              className={styles.startMenuIconGroup}
              onClick={() => handleOpenApp(resumeItem)}
            >
              <div
                className={styles.startMenuIcon}
                style={{ backgroundImage: `url(${resumeItem.icon})` }}
              ></div>
              <div className={`${styles.startMenuText} ${styles.boldText}`}>
                {resumeItem.name}
              </div>
            </div>
          )}

          {contactItem && (
            <div
              className={styles.startMenuIconGroup}
              onClick={() => handleOpenApp(contactItem)}
            >
              <img
                src={contactItem.icon}
                alt={contactItem.name}
                className={styles.startMenuIcon}
              />
              <div className={`${styles.startMenuText} ${styles.boldText}`}>
                {contactItem.name}
              </div>
            </div>
          )}

          <div className={styles.startMenuIconGroupSeparator}></div>

          {otherItems.map((icon) => (
            <div
              key={icon.id}
              className={styles.startMenuIconGroup}
              onClick={() => handleOpenApp(icon)}
            >
              <img
                src={icon.icon}
                alt={icon.name}
                className={styles.startMenuIcon}
              />
              <div className={styles.startMenuText}>{icon.name}</div>
            </div>
          ))}

          {featuredGames.map((game) => (
            <div
              key={game.id}
              className={styles.startMenuIconGroup}
              onClick={() => handleOpenApp(game)}
            >
              <img
                src={game.icon}
                alt={game.name}
                className={styles.startMenuIcon}
              />
              <div className={styles.startMenuText}>{game.name}</div>
            </div>
          ))}

          <div className={styles.startMenuIconGroupSeparator}></div>

          <div className={styles.allAppsButton}>
            <div className={styles.allAppsButtonText}>All Programs</div>
            <div className={styles.allAppsButtonIcon}></div>
          </div>
        </div>
        <div className={styles.rightPanel}></div>
      </div>
      <div className={styles.bottomBar}></div>
    </div>
  );
}

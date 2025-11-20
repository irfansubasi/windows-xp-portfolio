import styles from './AboutMe.module.css';

export const AboutMeContent = () => {
  return (
    <div className={styles.content}>
      <div className={styles.contentInner}>
        <h2>About Me</h2>
        <h3>I’m İrfan Subaşı, a Full-Stack Developer from Turkey.</h3>
        <div className={styles.contentBody}>
          <p>
            My curiosity for technology goes back to my childhood, but my
            professional journey started elsewhere. Even while completing my
            Bachelor’s degree in Agricultural Engineering at Ege University, I
            always felt my true interest lay in the world of software and
            technology. That’s why I later pursued Web Design & Coding at
            Anadolu University, fully turning my path toward software
            development.
          </p>
          <p>
            Actually, the roots of this journey go even further back. I’ve been
            surrounded by computers since I was a child—so much so that people
            around me used to call me a “computer addict.” Over time, this
            curiosity evolved from a mere interest into a dream and a passion.
            Eventually, I made a radical decision to turn that passion into my
            profession.
          </p>
          <p>
            When I first started learning software development, my only goal was
            to find the answer to the question, “How do you write code?” But as
            I grew, I realized that software development is not just about
            coding; it’s about thinking, designing, questioning,
            problem-solving, and constantly learning. Every project, every line,
            and every error taught me something new.
          </p>
          <p>
            In my projects, I always adopt a solution-oriented approach that
            adds value to the user. I pay attention to details while coding and
            prioritize building sustainable and clean structures. Discovering
            new technologies and learning something from each project is the
            most exciting part of the process for me. My goal? Simple but
            ambitious: to become a developer who is asked, “Teach me, master!”,
            and to keep learning every day, taking lessons from mistakes, and
            adding value both to myself and the users while writing code.
          </p>
        </div>
      </div>
    </div>
  );
};

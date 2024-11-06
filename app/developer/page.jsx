import BackButton from '@/components/BackButton/BackButton';
import { ProjectsList } from '@/components/ProjectsList/ProjectsList';

export default function Developer() {
  return (
    <main>
      <BackButton />
      <h1>Developer</h1>
      <p>
        Currently, I'm working as a <span style={{background: 'white'}}>Senior Web UI Application Developer</span> at <b>UScellular</b>.
      </p>
      <ProjectsList type="developer"/>
    </main>
  );
}

import PageTitle from '@/components/PageTitle/PageTitle';
import { ProjectsList } from '@/components/ProjectsList/ProjectsList';

export default function Developer() {
  return (
    <main>
      <PageTitle>Developer</PageTitle>
      <p>
        Currently, I&lsquo;m working as a <span style={{background: 'white'}}>Senior Web UI Application Developer</span> at <b>UScellular</b>.
      </p>
      <ProjectsList type="developer"/>
    </main>
  );
}

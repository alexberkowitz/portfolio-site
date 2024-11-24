import Text from '@/components/Text/Text';
import { ProjectsList } from '@/components/ProjectsList/ProjectsList';

export default function Developer() {
  return (
    <main>
      <p style={{padding: 'calc(var(--pagePadding) * 2) 0', marginLeft: 'var(--pagePadding)'}}>
        <Text>
          I&lsquo;ve been developing websites and apps for over a fifteen years. My passion is front-end development&mdash;I&lsquo;m one of the few developers who actually loves CSS&mdash;and I&lsquo;m well-versed in many common frameworks and libraries. Currently, I&lsquo;m working as a <Text style="accent">Senior Web UI Application Developer</Text> at <b>UScellular</b>.
          <br/><br/>
          In case you were wondering, this site is built with Next.js, with P5.js for some of the fancier effects. All other effects are pure CSS/JavaScript.
        </Text>
      </p>
      <ProjectsList type="developer"/>
    </main>
  );
}

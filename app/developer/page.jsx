import PageTitle from '@/components/PageTitle/PageTitle';
import TextWrapper from '@/components/TextWrapper/TextWrapper';
import { ProjectsList } from '@/components/ProjectsList/ProjectsList';

export default function Developer() {
  return (
    <main>
      <PageTitle marquee>Developer</PageTitle>
      <p>
        <TextWrapper>
          Currently, I&lsquo;m working as a <span style={{background: 'white'}}>Senior Web UI Application Developer</span> at <b>UScellular</b>. In sed lectus eu purus elementum vulputate eget sed mauris. Aenean dapibus luctus aliquam. Nunc rutrum lobortis dui sed tempus. Praesent porta quam vitae massa elementum, sit amet malesuada mi rutrum. Donec at posuere nisl. Curabitur diam augue, ornare sit amet erat vitae, suscipit faucibus tortor. 
        </TextWrapper>
      </p>
      <ProjectsList type="developer"/>
    </main>
  );
}

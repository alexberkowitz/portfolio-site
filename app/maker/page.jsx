import PageTitle from '@/components/PageTitle/PageTitle';
import TextWrapper from '@/components/TextWrapper/TextWrapper';
import { ProjectsList } from '@/components/ProjectsList/ProjectsList';

export default function Maker() {
  return (
    <main>
      <PageTitle>Maker</PageTitle>
      <p>
        <TextWrapper>
          Fusce semper semper felis eget mattis. In sed lectus eu purus elementum vulputate eget sed mauris. Aenean dapibus luctus aliquam. Nunc rutrum lobortis dui sed tempus. Praesent porta quam vitae massa elementum, sit amet malesuada mi rutrum. Donec at posuere nisl. Curabitur diam augue, ornare sit amet erat vitae, suscipit faucibus tortor. 
        </TextWrapper>
      </p>
      <ProjectsList type="maker"/>
    </main>
  );
}

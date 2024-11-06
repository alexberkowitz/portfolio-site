import BackButton from '@/components/BackButton/BackButton';
import PageTitle from '@/components/PageTitle/PageTitle';
import { ProjectsList } from '@/components/ProjectsList/ProjectsList';

export default function Designer() {

  return (
    <main>
      <BackButton />
      <PageTitle>Designer</PageTitle>
      <p>
        Fusce semper semper felis eget mattis. In sed lectus eu purus elementum vulputate eget sed mauris. Aenean dapibus luctus aliquam. Nunc rutrum lobortis dui sed tempus. Praesent porta quam vitae massa elementum, sit amet malesuada mi rutrum. Donec at posuere nisl. Curabitur diam augue, ornare sit amet erat vitae, suscipit faucibus tortor. 
      </p>
      <ProjectsList type="designer"/>
    </main>
  );
}
import Text from '@/components/Text/Text';
import { ProjectsList } from '@/components/ProjectsList/ProjectsList';
import dynamic from 'next/dynamic';

const DynamicPageTitle = dynamic(() => import('@/components/PageTitle/PageTitle'), {
  ssr: false,
});

export default function Maker() {
  return (
    <main>
      <DynamicPageTitle marquee>Maker</DynamicPageTitle>
      <p style={{padding: 'calc(var(--pagePadding) * 2) 0', marginLeft: 'var(--pagePadding)'}}>
        <Text>
          Fusce semper semper felis eget mattis. In sed lectus eu purus elementum vulputate eget sed mauris. Aenean dapibus luctus aliquam. Nunc rutrum lobortis dui sed tempus. Praesent porta quam vitae massa elementum, sit amet malesuada mi rutrum. Donec at posuere nisl. Curabitur diam augue, ornare sit amet erat vitae, suscipit faucibus tortor. 
        </Text>
      </p>
      <ProjectsList type="maker"/>
    </main>
  );
}

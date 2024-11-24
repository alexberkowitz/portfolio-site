import Text from '@/components/Text/Text';
import Link from '@/components/Link/Link';
import { ProjectsList } from '@/components/ProjectsList/ProjectsList';

export default function Maker() {
  return (
    <main>
      <p style={{padding: 'calc(var(--pagePadding) * 2) 0', marginLeft: 'var(--pagePadding)'}}>
        <Text>
          Fusce semper semper felis eget mattis. In sed lectus eu purus elementum vulputate eget sed mauris. Aenean dapibus luctus aliquam. Nunc rutrum lobortis dui sed tempus. Praesent porta quam vitae massa elementum, sit amet malesuada mi rutrum. Donec at posuere nisl. Curabitur diam augue, ornare sit amet erat vitae, suscipit faucibus tortor. 
        </Text>
      </p>
      <Link href="/designer">To Designer</Link>
      <ProjectsList type="maker"/>
    </main>
  );
}
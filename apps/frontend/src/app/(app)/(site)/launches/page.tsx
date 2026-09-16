export const dynamic = 'force-dynamic';
import { LaunchesComponent } from '@gitroom/frontend/components/launches/launches.component';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
import { getT } from '@gitroom/react/translation/get.translation.service.backend';
export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  const general = isGeneralServerSide();
  return {
    title: `${general ? 'Postiz' : 'Gitroom'} ${general ? t('calendar') : t('launches')}`,
    description: general
      ? t('calendar_description')
      : t('launches_description'),
  };
}
export default async function Index() {
  return <LaunchesComponent />;
}

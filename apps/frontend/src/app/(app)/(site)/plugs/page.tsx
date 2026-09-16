import { Plugs } from '@gitroom/frontend/components/plugs/plugs';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
import { getT } from '@gitroom/react/translation/get.translation.service.backend';
export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: `${isGeneralServerSide() ? 'Postiz' : 'Gitroom'} ${t('plugs')}`,
    description: t('plugs_description'),
  };
}
export default async function Index() {
  return <Plugs />;
}

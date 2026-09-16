'use client';

import { FC } from 'react';
import {
  PostComment,
  withProvider,
} from '@gitroom/frontend/components/new-launch/providers/high.order.provider';
import { Input } from '@gitroom/react/form/input';
import { Select } from '@gitroom/react/form/select';
import { useSettings } from '@gitroom/frontend/components/launches/helpers/use.values';
import { WordpressPostType } from '@gitroom/frontend/components/new-launch/providers/wordpress/wordpress.post.type';
import { WordpressTerms } from '@gitroom/frontend/components/new-launch/providers/wordpress/wordpress.terms';
import { MediaComponent } from '@gitroom/frontend/components/media/media.component';
import { WordpressDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/wordpress.dto';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

const WordpressSettings: FC = () => {
  const t = useT();
  const form = useSettings();
  return (
    <>
      <Input label={t('title')} {...form.register('title')} />
      <WordpressPostType {...form.register('type')} />
      <Select
        label={t('wordpress_post_status')}
        {...form.register('status', { value: 'publish' })}
      >
        <option value="publish">{t('publish')}</option>
        <option value="draft">{t('draft')}</option>
        <option value="pending">{t('pending')}</option>
        <option value="private">{t('private')}</option>
      </Select>
      <WordpressTerms
        label={t('categories')}
        func="categoriesList"
        {...form.register('categories')}
      />
      <WordpressTerms
        label={t('wordpress_tags')}
        func="tagsList"
        {...form.register('tags')}
      />
      <MediaComponent
        label={t('cover_picture')}
        description={t('add_a_cover_picture')}
        {...form.register('main_image')}
      />
    </>
  );
};
export default withProvider({
  postComment: PostComment.COMMENT,
  minimumCharacters: [],
  SettingsComponent: WordpressSettings,
  CustomPreviewComponent: undefined, // WordpressPreview,
  dto: WordpressDto,
  maximumCharacters: 100000,
});

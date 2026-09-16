import i18next from '@gitroom/react/translation/i18next';
import { areYouSure } from '@gitroom/frontend/components/layout/new-modal';

// Outside of React, so it can't use useT() - the root i18next instance's
// own .t is typed to combine every namespace (to support multi-namespace
// apps calling it from anywhere), which under strict key checking requires
// the "translation:key" namespace prefix instead of a bare key.
export const deleteDialog = async (
  message: string,
  confirmButton?: string,
  title?: string,
  cancelButton?: string
) => {
  return areYouSure({
    title: title || i18next.t('translation:are_you_sure', 'Are you sure?'),
    description: message,
    approveLabel:
      confirmButton ||
      i18next.t('translation:yes_delete_it', 'Yes, delete it!'),
    cancelLabel:
      cancelButton || i18next.t('translation:no_cancel', 'No, cancel!'),
  });
};

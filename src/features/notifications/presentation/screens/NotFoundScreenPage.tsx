import { useNotFoundScreen } from '../hooks/useNotFoundScreen';
import { useTranslation } from '@/src/i18n';
import { ScreenNotFoundFallback } from '@/src/ui';

export function NotFoundScreenPage() {
  const { t } = useTranslation();
  const { onBackPress } = useNotFoundScreen();

  return <ScreenNotFoundFallback title={t('common.pageNotFound')} onBackPress={onBackPress} />;
}

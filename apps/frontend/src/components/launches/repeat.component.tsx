'use client';

import { FC, useMemo, useState } from 'react';
import { Select } from '@gitroom/react/form/select';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useClickOutside } from '@mantine/hooks';
import { isUSCitizen } from '@gitroom/frontend/components/launches/helpers/isuscitizen.utils';
import clsx from 'clsx';
import { RepeatIcon, DropdownArrowIcon } from '@gitroom/frontend/components/ui/icons';
const getList = (t: (key: string, fallback?: string) => string) => [
  {
    value: 1,
    label: t('day'),
  },
  {
    value: 2,
    label: t('two_days'),
  },
  {
    value: 3,
    label: t('three_days'),
  },
  {
    value: 4,
    label: t('four_days'),
  },
  {
    value: 5,
    label: t('five_days'),
  },
  {
    value: 6,
    label: t('six_days'),
  },
  {
    value: 7,
    label: t('week'),
  },
  {
    value: 14,
    label: t('two_weeks'),
  },
  {
    value: 30,
    label: t('month'),
  },
  {
    value: null,
    label: t('cancel'),
  },
];
export const RepeatComponent: FC<{
  repeat: number | null;
  onChange: (newVal: number) => void;
}> = (props) => {
  const { repeat } = props;
  const t = useT();
  const list = getList(t);
  const [isOpen, setIsOpen] = useState(false);

  const ref = useClickOutside(() => {
    if (!isOpen) {
      return;
    }
    setIsOpen(false);
  });

  const everyLabel = useMemo(() => {
    if (!repeat) {
      return '';
    }
    return list.find((p) => p.value === repeat)?.label;
  }, [repeat, list]);

  return (
    <div
      ref={ref}
      className={clsx(
        'border rounded-[8px] justify-center flex items-center relative h-[44px] text-[15px] font-[600] select-none',
        isOpen ? 'border-btnPrimary' : 'border-newTextColor/10',
      )}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-[16px] justify-center flex gap-[8px] items-center h-full select-none flex-1"
      >
        <div className="cursor-pointer">
          <RepeatIcon />
        </div>
        <div className="cursor-pointer">
          {repeat
            ? `${t('repeat_post_every_label')} ${everyLabel}`
            : t('repeat_post_every')}
        </div>
        <div className="cursor-pointer">
          <DropdownArrowIcon rotated={isOpen} />
        </div>
      </div>
      {isOpen && (
        <div className="z-[300] absolute start-0 bottom-[100%] w-[240px] bg-newBgColorInner p-[12px] menu-shadow -translate-y-[10px] flex flex-col">
          {list.map((p) => (
            <div
              onClick={() => {
                props.onChange(Number(p.value));
                setIsOpen(false);
              }}
              key={p.label}
              className="h-[40px] py-[8px] px-[20px] -mx-[12px] hover:bg-newBgColor"
            >
              {p.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

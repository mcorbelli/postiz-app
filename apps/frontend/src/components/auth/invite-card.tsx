'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { Button } from '@gitroom/react/form/button';

type InviteInfo =
  | { valid: true; organizationName: string }
  | { valid: false }
  | null;

export const InviteCard: FC<{
  isInvited: boolean;
  onDecline: () => void;
}> = ({ isInvited, onDecline }) => {
  const t = useT();
  const fetchData = useFetch();
  const [info, setInfo] = useState<InviteInfo>(null);
  const [declining, setDeclining] = useState(false);
  // Guards against setting state after unmount and against the effect
  // ever firing twice for the same "became invited" transition - this
  // hits a globally rate-limited endpoint, so it must run at most once.
  const requested = useRef(false);

  const decline = async () => {
    setDeclining(true);
    try {
      // Same-origin call into this Next.js app (clears the httpOnly org
      // cookie), not the NestJS backend - fetchData/useFetch would send
      // this to the wrong service.
      await fetch('/api/decline-invite', { method: 'POST' });
    } finally {
      onDecline();
    }
  };

  useEffect(() => {
    if (!isInvited || requested.current) {
      return;
    }
    requested.current = true;

    let cancelled = false;
    (async () => {
      try {
        const response = await fetchData('/auth/invite-info');
        const data = await response.json();
        if (cancelled) {
          return;
        }
        if (data?.valid === true && data?.organizationName) {
          setInfo({ valid: true, organizationName: data.organizationName });
        } else if (data?.valid === false) {
          // The invite is genuinely dead (expired/garbled) - not a
          // network hiccup - so clear it the same way a manual decline
          // would, otherwise the card would just reappear on reload.
          setInfo({ valid: false });
          decline();
        }
        // Any other shape: leave `info` as null and fall through to the
        // generic fallback sentence below - never treated as invalid.
      } catch {
        // Network error or non-JSON response: same fallback, no decline.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isInvited]);

  if (!isInvited || (info && !info.valid)) {
    return null;
  }

  return (
    <div className="bg-sixth border border-forth rounded-[12px] p-[16px] mt-[24px] flex flex-col gap-[16px]">
      <div className="text-[14px]">
        {info?.valid
          ? t(
              'invited_you_will_join_organization',
              "You've been invited to join {{- name}} - your account will be added to it automatically.",
              { name: info.organizationName }
            )
          : t(
              'invited_you_will_join_an_existing_team',
              "You've been invited to join a team - your account will be added to it automatically."
            )}
      </div>
      <Button
        type="button"
        loading={declining}
        onClick={decline}
        className="self-end rounded-[10px] !h-[36px] !px-[16px] text-[13px]"
      >
        {t('decline_invite', 'Decline')}
      </Button>
    </div>
  );
};

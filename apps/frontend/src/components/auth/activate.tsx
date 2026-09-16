'use client';

import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { Button } from '@gitroom/react/form/button';
import { Input } from '@gitroom/react/form/input';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type ResendInputs = {
  email: string;
};

type ResendStatus = 'idle' | 'sent' | 'already_activated';

const COOLDOWN_SECONDS = 60;

export function Activate() {
  const t = useT();
  const fetch = useFetch();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<ResendStatus>('idle');
  const [cooldown, setCooldown] = useState(0);
  const form = useForm<ResendInputs>();

  useEffect(() => {
    if (cooldown <= 0) return;
    
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const resetToForm = useCallback(() => {
    setStatus('idle');
    setCooldown(COOLDOWN_SECONDS);
  }, []);

  const onSubmit: SubmitHandler<ResendInputs> = async (data) => {
    setLoading(true);
    try {
      const response = await fetch('/auth/resend-activation', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        setStatus('sent');
        setCooldown(COOLDOWN_SECONDS);
      } else if (result.message === 'Account is already activated') {
        setStatus('already_activated');
      } else {
        form.setError('email', {
          message: result.message || t('failed_to_resend'),
        });
      }
    } catch (e) {
      form.setError('email', {
        message: t('error_occurred'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div>
        <h1 className="text-3xl font-bold text-start mb-4 cursor-pointer">
          {t('activate_your_account')}
        </h1>
      </div>
      <div className="text-textColor">
        {t('thank_you_for_registering')}
        <br />
        {t(
          'please_check_your_email_to_activate_your_account'
        )}
      </div>

      <div className="mt-8 border-t border-fifth pt-6">
        <h2 className="text-lg font-semibold mb-4">
          {t('didnt_receive_email')}
        </h2>
        {status === 'sent' ? (
          <div className="flex flex-col gap-4">
            <div className="text-green-400">
              {t(
                'activation_email_sent'
              )}
            </div>
            {cooldown > 0 ? (
              <p className="text-sm text-textColor">
                {t('resend_available_in')} {cooldown}s
              </p>
            ) : (
              <Button
                onClick={resetToForm}
                className="rounded-[10px] !h-[52px]"
              >
                {t('send_again')}
              </Button>
            )}
          </div>
        ) : status === 'already_activated' ? (
          <div className="flex flex-col gap-4">
            <div className="text-green-400">
              {t(
                'account_already_activated'
              )}
            </div>
            <Link href="/auth/login">
              <Button className="rounded-[10px] !h-[52px] w-full">
                {t('go_to_login')}
              </Button>
            </Link>
          </div>
        ) : (
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Input
                label={t('label_email')}
                translationKey="label_email"
                {...form.register('email', { required: true })}
                type="email"
                placeholder={t('email_address')}
              />
              <Button
                type="submit"
                className="rounded-[10px] !h-[52px]"
                loading={loading}
                disabled={cooldown > 0}
              >
                {cooldown > 0
                  ? `${t('resend_available_in')} ${cooldown}s`
                  : t('resend_activation_email')}
              </Button>
            </form>
          </FormProvider>
        )}
        {status !== 'already_activated' && (
          <p className="mt-4 text-sm text-textColor">
            {t('already_activated')}&nbsp;
            <Link href="/auth/login" className="underline cursor-pointer">
              {t('sign_in')}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

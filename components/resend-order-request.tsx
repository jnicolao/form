'use client';

import { useEffect, useState } from 'react';
import { Loader2, RotateCw, Check, MessageCircle, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDisplayPhone, getPhoneError, toLocalDigits } from '@/lib/phone';
import { cn } from '@/lib/utils';

const RESEND_DELAY_SECONDS = 30;

export function ResendOrderRequest({
  phone,
  reference,
  onResend,
}: {
  phone: string;
  reference: string;
  onResend: (phone: string) => Promise<string | null>;
}) {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_DELAY_SECONDS);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Counts down after each order request (a new request has a new order number).
  // It reads the clock on every tick instead of counting ticks, so it is still
  // right after the page was in the background, as it is on a phone while the
  // shopper is in WhatsApp.
  useEffect(() => {
    const deadline = Date.now() + RESEND_DELAY_SECONDS * 1000;
    const timer = setInterval(() => {
      const left = Math.max(Math.ceil((deadline - Date.now()) / 1000), 0);
      setSecondsLeft(left);
      if (left === 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [reference]);

  const send = async (target: string) => {
    setSending(true);
    setError('');
    setResent(false);
    const failure = await onResend(target);
    setSending(false);
    if (failure) {
      setError(failure);
      return;
    }
    setSecondsLeft(RESEND_DELAY_SECONDS);
    setResent(true);
    setEditing(false);
  };

  const handleSendToNewNumber = () => {
    const validation = getPhoneError(newPhone);
    if (!validation && toLocalDigits(newPhone) === toLocalDigits(phone)) {
      setPhoneError('This is the number we already sent to.');
      return;
    }
    setPhoneError(validation);
    if (!validation) send(newPhone);
  };

  const startEditing = () => {
    setNewPhone(toLocalDigits(phone));
    setPhoneError('');
    setError('');
    setEditing(true);
  };

  const progress =
    ((RESEND_DELAY_SECONDS - secondsLeft) / RESEND_DELAY_SECONDS) * 100;

  return (
    <div
      className="mt-6 rounded-xl border border-border bg-card p-5"
      aria-live="polite"
    >
      {editing ? (
        <div className="animate-fade-up">
          <label htmlFor="new-phone" className="text-base font-medium">
            Send to a different number
          </label>
          <p className="mt-0.5 text-sm text-muted-foreground">
            We&apos;ll send a new order request for the same items.
          </p>
          <div
            className={cn(
              'mt-3 flex items-stretch overflow-hidden rounded-lg border focus-within:ring-2 focus-within:ring-ring',
              phoneError ? 'border-destructive' : 'border-input',
            )}
          >
            <span className="flex items-center gap-1.5 border-r border-input bg-secondary px-3 text-sm font-medium text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              +254
            </span>
            <input
              id="new-phone"
              type="tel"
              inputMode="numeric"
              autoFocus
              placeholder="7XX XXX XXX"
              value={newPhone}
              onChange={(e) => {
                setNewPhone(e.target.value);
                if (phoneError) setPhoneError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendToNewNumber();
              }}
              className="flex-1 bg-transparent px-3 py-3 text-base outline-hidden placeholder:text-muted-foreground/50"
              disabled={sending}
            />
          </div>
          {phoneError && (
            <p className="mt-2 text-sm text-destructive">{phoneError}</p>
          )}
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="ghost"
              onClick={() => setEditing(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button onClick={handleSendToNewNumber} disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                'Send request'
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-medium">
              Didn&apos;t get the message?
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {resent ? (
                <span className="inline-flex items-center gap-1.5 text-foreground">
                  <Check className="h-4 w-4" />
                  New request sent to {formatDisplayPhone(phone)}
                </span>
              ) : (
                <>Sent to {formatDisplayPhone(phone)}</>
              )}
            </p>
            <button
              type="button"
              onClick={startEditing}
              disabled={sending}
              className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-foreground/80  disabled:opacity-50"
            >
              <Pencil className="h-3.5 w-3.5" fill="currentColor" />
              Wrong number?<span className="underline">Change it</span>
            </button>
          </div>
          <Button
            variant="outline"
            className="relative overflow-hidden sm:min-w-[180px]"
            disabled={secondsLeft > 0 || sending}
            onClick={() => send(phone)}
          >
            {secondsLeft > 0 && (
              <span
                className="absolute inset-y-0 left-0 bg-secondary transition-[width] duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
                aria-hidden
              />
            )}
            <span className="relative flex items-center">
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : secondsLeft > 0 ? (
                <>Resend in 0:{String(secondsLeft).padStart(2, '0')}</>
              ) : (
                <>
                  <RotateCw className="mr-2 h-4 w-4" />
                  Resend request
                </>
              )}
            </span>
          </Button>
        </div>
      )}
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </div>
  );
}

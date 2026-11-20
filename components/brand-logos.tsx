import Image from 'next/image';
import { cn } from '@/lib/utils';

export function FormLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'font-display text-xl font-bold tracking-[0.15em] text-foreground select-none',
        className,
      )}
    >
      FORM<span className="text-muted-foreground">.</span>
    </span>
  );
}

export function PickSpotLogo({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <Image
      src="/icons/image.png"
      alt="PickSpot"
      width={2972}
      height={748}
      // The logo is never shown wider than this, so the browser asks for a
      // small copy instead of the full 2972px file.
      sizes="96px"
      className={cn(
        'h-5 w-auto select-none',
        dark && 'brightness-0 invert',
        className,
      )}
    />
  );
}

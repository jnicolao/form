'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

export function ProductImage({
  src,
  alt,
  className,
  fill,
  sizes,
  priority,
}: ProductImageProps) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-secondary text-muted-foreground',
          className,
        )}
      >
        <span className="font-display text-sm font-bold tracking-wider">
          FORM<span className="text-muted-foreground/50">.</span>
        </span>
      </div>
    );
  }
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
        onError={() => setError(true)}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={800}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setError(true)}
    />
  );
}

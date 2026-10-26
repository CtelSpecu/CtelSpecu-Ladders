import { Star } from 'lucide-react'

import { cn } from '@/lib/utils'

export function StarRating({
  value,
  className,
  size = 'sm',
}: {
  value: number
  className?: string
  size?: 'sm' | 'md'
}) {
  const iconSize = size === 'md' ? 'size-4' : 'size-3.5'
  return (
    <span
      role="img"
      className={cn('flex items-center gap-0.5', className)}
      aria-label={`推荐指数 ${value} / 5`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden
          className={cn(
            iconSize,
            index < value ? 'fill-primary text-primary' : 'text-muted-foreground/40',
          )}
        />
      ))}
    </span>
  )
}

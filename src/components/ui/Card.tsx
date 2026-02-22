'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        className={cn(
          'rounded-xl transition-all duration-200',
          {
            'bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700': variant === 'default',
            'border-2 border-gray-300 dark:border-gray-700': variant === 'outline',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export default Card
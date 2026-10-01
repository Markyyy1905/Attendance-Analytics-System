import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';
export function Button({ children, variant = 'primary', className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost'; children: ReactNode }) { return <button className={cn('button', `button-${variant}`, className)} {...props}>{children}</button>; }

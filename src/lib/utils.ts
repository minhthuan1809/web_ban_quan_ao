import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

export function cn(...classes: (string | undefined | null | false | 0)[]) {
  return classes.filter(Boolean).join(' ');
} 
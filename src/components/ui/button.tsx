import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
const variants=cva('button',{variants:{variant:{default:'button-primary',secondary:'button-secondary',ghost:'button-ghost',danger:'button-danger'}},defaultVariants:{variant:'default'}});
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof variants>{}
// shadcn/ui button pattern, using the dependencies already installed.
export const Button=React.forwardRef<HTMLButtonElement,ButtonProps>(({className,variant,...props},ref)=><button ref={ref} className={twMerge(clsx(variants({variant}),className))} {...props}/>);
Button.displayName='Button';

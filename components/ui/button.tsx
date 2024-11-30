'use client'

import * as React from "react"

type ButtonBaseProps = {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

type ButtonAsButtonProps = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    asChild?: false
  }

type ButtonAsAnchorProps = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    asChild: true
  }

type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ 
    className = "", 
    variant = "default", 
    size = "default", 
    asChild = false,
    ...props 
  }, ref) => {
    const Comp = asChild ? 'a' : 'button'

    const variantStyles = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    } as const

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10"
    } as const

    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    return React.createElement(
      Comp,
      {
        className: `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`,
        ref,
        ...props
      }
    )
  }
)

Button.displayName = "Button"

export { Button }
export type { ButtonProps }
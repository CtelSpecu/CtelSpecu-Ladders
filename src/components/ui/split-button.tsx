"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface SplitButtonAction {
  label: string
  onSelect?: () => void
  disabled?: boolean
  destructive?: boolean
  icon?: React.ReactNode
}

function SplitButton({
  label,
  onClick,
  actions,
  icon,
  variant = "primary",
  disabled = false,
  menuLabel,
  className,
}: {
  label: string
  onClick?: () => void
  actions: SplitButtonAction[]
  icon?: React.ReactNode
  variant?: "primary" | "secondary"
  disabled?: boolean
  menuLabel?: string
  className?: string
}) {
  const primary = variant === "primary"

  return (
    <div
      data-slot="split-button"
      data-variant={variant}
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-full border",
        primary
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground",
        disabled && "opacity-50",
        className,
      )}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors disabled:pointer-events-none",
          primary ? "hover:bg-primary/90" : "hover:bg-muted",
        )}
      >
        {icon}
        {label}
      </button>
      <span
        aria-hidden
        className={cn("w-px shrink-0", primary ? "bg-primary-foreground/25" : "bg-border")}
      />
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={disabled}
          aria-label={menuLabel ?? `${label} · 更多选项`}
          className={cn(
            "inline-flex items-center justify-center px-1.5 outline-none transition-colors data-[popup-open]:opacity-90 disabled:pointer-events-none",
            primary ? "hover:bg-primary/90" : "hover:bg-muted",
          )}
        >
          <ChevronDownIcon className="size-3.5" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44" positionerClassName="z-[200]">
          {actions.map((action) => (
            <DropdownMenuItem
              key={action.label}
              onClick={action.onSelect}
              disabled={action.disabled}
              variant={action.destructive ? "destructive" : "default"}
            >
              {action.icon}
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export { SplitButton }
export type { SplitButtonAction }

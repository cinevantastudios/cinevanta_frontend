import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "ink" | "yellow" | "outline";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  withArrow?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
    ref?: Ref<HTMLButtonElement>;
  };

type ButtonAsAnchor = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
    external?: boolean;
    ref?: Ref<HTMLAnchorElement>;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn("h-3.5 w-3.5", className)}
    >
      <path
        d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const variantClasses: Record<ButtonVariant, string> = {
  ink: "bg-ink text-cream border-2 border-ink hover:bg-yellow hover:text-ink",
  yellow: "bg-yellow text-ink border-2 border-transparent hover:bg-ink hover:text-cream hover:border-ink",
  outline: "bg-transparent text-ink border-2 border-ink hover:bg-ink hover:text-cream",
};

const iconCircleClasses: Record<ButtonVariant, string> = {
  ink: "bg-yellow text-ink group-hover:bg-ink group-hover:text-yellow",
  yellow: "bg-ink text-yellow group-hover:bg-yellow group-hover:text-ink",
  outline: "bg-ink text-cream group-hover:bg-yellow group-hover:text-ink",
};

function isExternalHref(href: string, explicitExternal?: boolean): boolean {
  if (explicitExternal) return true;
  return /^(https?:|mailto:|tel:)/.test(href);
}

export function Button(props: ButtonProps) {
  const {
    variant = "ink",
    withArrow = false,
    loading = false,
    fullWidth = false,
    className,
    children,
  } = props;

  const showTrailingCircle = withArrow && !loading;

  const baseClasses = cn(
    "group inline-flex min-h-[44px] items-center justify-center gap-3 rounded-pill text-[14px] font-semibold leading-none select-none",
    "transition-[background-color,color,border-color] duration-200 ease-[var(--ease-move)]",
    "disabled:pointer-events-none disabled:opacity-55",
    showTrailingCircle ? "py-[14px] pl-6 pr-[14px]" : "px-6 py-[14px]",
    variantClasses[variant],
    fullWidth && "w-full",
    className,
  );

  const contentNode = (
    <>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      <span>{children}</span>
      {showTrailingCircle ? (
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
            "transition-[transform,background-color,color] duration-200 ease-[var(--ease-move)]",
            "group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px] motion-reduce:transform-none",
            iconCircleClasses[variant],
          )}
        >
          <ArrowRightIcon />
        </span>
      ) : null}
    </>
  );

  if (typeof props.href === "string") {
    const {
      href,
      external,
      variant: _variant,
      withArrow: _withArrow,
      loading: _loading,
      fullWidth: _fullWidth,
      className: _className,
      children: _children,
      rel,
      target,
      ...anchorProps
    } = props;

    if (isExternalHref(href, external)) {
      const safeRel = target === "_blank" ? rel || "noopener noreferrer" : rel;
      return (
        <a href={href} target={target} rel={safeRel} className={baseClasses} {...anchorProps}>
          {contentNode}
        </a>
      );
    }

    return (
      <Link href={href} className={baseClasses} {...anchorProps}>
        {contentNode}
      </Link>
    );
  }

  const {
    variant: _variant,
    withArrow: _withArrow,
    loading: _loading,
    fullWidth: _fullWidth,
    className: _className,
    children: _children,
    disabled,
    type = "button",
    ...buttonProps
  } = props;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={baseClasses}
      {...buttonProps}
    >
      {contentNode}
    </button>
  );
}


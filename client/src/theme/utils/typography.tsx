/**
 * Утилиты для работы с типографикой
 * Помогают применять типографические стили в компонентах
 */

import * as React from "react";
import {
  typographyClasses,
  getTypographyClass,
  type TypographyVariant,
} from "../semantic/typography";
import { cn } from "@/lib/utils";

/**
 * Применяет типографический стиль к элементу
 * Автоматически объединяет классы, обрабатывая конфликты
 *
 * @example
 * <h1 className={applyTypography("h1")}>Заголовок</h1>
 * <p className={applyTypography("body", "text-muted-foreground")}>Текст</p>
 * <Link className={applyTypography("body", "flex items-center gap-2 font-medium")}>Link</Link>
 */
export const applyTypography = (
  variant: TypographyVariant,
  ...additionalClasses: (string | undefined)[]
): string => {
  return cn(getTypographyClass(variant), ...additionalClasses);
};

/**
 * Готовые компоненты для типографики (для использования в JSX)
 */
export const Typography = {
  // Headings
  h1: ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={applyTypography("h1", className)} {...props}>
      {children}
    </h1>
  ),
  h2: ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={applyTypography("h2", className)} {...props}>
      {children}
    </h2>
  ),
  h3: ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={applyTypography("h3", className)} {...props}>
      {children}
    </h3>
  ),
  h4: ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className={applyTypography("h4", className)} {...props}>
      {children}
    </h4>
  ),
  h5: ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className={applyTypography("h5", className)} {...props}>
      {children}
    </h5>
  ),
  h6: ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 className={applyTypography("h6", className)} {...props}>
      {children}
    </h6>
  ),

  // Body text
  body: ({
    className,
    children,
    as,
    ...props
  }: React.HTMLAttributes<HTMLParagraphElement> & {
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
    [key: string]: any;
  }) => {
    if (as && typeof as !== "string") {
      // React component (like Link from react-router-dom)
      const Component = as as React.ComponentType<any>;
      return (
        <Component className={applyTypography("body", className)} {...(props as any)}>
          {children}
        </Component>
      );
    }
    const Component = (as || "p") as keyof JSX.IntrinsicElements;
    return (
      <Component className={applyTypography("body", className)} {...props}>
        {children}
      </Component>
    );
  },
  bodySm: ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={applyTypography("body-sm", className)} {...props}>
      {children}
    </p>
  ),
  bodyLg: ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={applyTypography("body-lg", className)} {...props}>
      {children}
    </p>
  ),

  // Labels
  label: ({ className, children, ...props }: React.HTMLAttributes<HTMLLabelElement>) => (
    <label className={applyTypography("label", className)} {...props}>
      {children}
    </label>
  ),
  labelSm: ({ className, children, ...props }: React.HTMLAttributes<HTMLLabelElement>) => (
    <label className={applyTypography("label-sm", className)} {...props}>
      {children}
    </label>
  ),

  // Captions
  caption: ({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span className={applyTypography("caption", className)} {...props}>
      {children}
    </span>
  ),

  // Special variants
  lead: ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={applyTypography("lead", className)} {...props}>
      {children}
    </p>
  ),
  large: ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={applyTypography("large", className)} {...props}>
      {children}
    </p>
  ),
  small: ({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span className={applyTypography("small", className)} {...props}>
      {children}
    </span>
  ),
  muted: ({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span className={applyTypography("muted", className)} {...props}>
      {children}
    </span>
  ),
};

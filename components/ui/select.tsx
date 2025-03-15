import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check } from "lucide-react";


export const Select = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>) => {
  return <SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>;
};


export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ children, ...props }, ref) => (
  <SelectPrimitive.Trigger ref={ref} {...props}>
    <SelectPrimitive.Value placeholder="Select an option" />
    <SelectPrimitive.Icon />
    {children}
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";


export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ children, ...props }, ref) => (
  <SelectPrimitive.Content ref={ref} {...props}>
    {children}
  </SelectPrimitive.Content>
));
SelectContent.displayName = "SelectContent";


export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ children, ...props }, ref) => (
  <SelectPrimitive.Item ref={ref} {...props}>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator>
      <Check />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";

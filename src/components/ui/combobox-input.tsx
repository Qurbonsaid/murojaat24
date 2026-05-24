import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export type ComboboxInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "type"
> & {
  value: string;
  onValueChange: (value: string) => void;
  suggestions: string[];
};

export function ComboboxInput({
  value,
  onValueChange,
  suggestions,
  className,
  disabled,
  id,
  ...props
}: ComboboxInputProps) {
  const listboxId = id ? `${id}-listbox` : undefined;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const filteredSuggestions = React.useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return suggestions;
    return suggestions.filter((item) => item.toLowerCase().includes(query));
  }, [suggestions, value]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [value]);

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (rootRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const handleSelect = (nextValue: string) => {
    onValueChange(nextValue);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!open) {
      setOpen(true);
    }

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      }

      case "ArrowUp": {
        event.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      }

      case "Enter": {
        if (!open) return;
        event.preventDefault();
        const selected = filteredSuggestions[selectedIndex];
        if (selected) {
          handleSelect(selected);
        }
        break;
      }

      case "Escape": {
        setOpen(false);
        break;
      }

      default:
        break;
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <Input
        type="text"
        value={value}
        disabled={disabled}
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        id={id}
        aria-autocomplete="list"
        onPointerDown={() => {
          if (!disabled) setOpen(true);
        }}
        onFocus={() => {
          if (!disabled) setOpen(true);
        }}
        onChange={(event) => {
          onValueChange(event.target.value);
          if (!disabled) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        className={cn(className)}
        {...props}
      />

      {open ? (
        <div
          data-combobox-content
          className="absolute left-0 right-0 top-full z-[100] mt-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
          onMouseDown={(event) => event.preventDefault()}
        >
          <div
            className="max-h-56 overflow-y-auto p-1"
            role="listbox"
            id={listboxId}
          >
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item, index) => (
                <div
                  key={item}
                  role="option"
                  aria-selected={index === selectedIndex}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    handleSelect(item);
                  }}
                  className={cn(
                    "cursor-pointer rounded-sm px-3 py-2 text-sm",
                    index === selectedIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  {item}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Natija topilmadi
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

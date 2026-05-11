import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";

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
  ...props
}: ComboboxInputProps) {
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Input
          type="text"
          value={value}
          disabled={disabled}
          onFocus={() => {
            if (!disabled) setOpen(true);
          }}
          onBlur={() => setOpen(false)}
          onChange={(event) => {
            onValueChange(event.target.value);
            if (!disabled) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={cn(className)}
          {...props}
        />
      </PopoverAnchor>

      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-1"
        align="start"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <div className="max-h-56 overflow-y-auto">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((item, index) => (
              <button
                key={item}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSelect(item);
                }}
                className={cn(
                  "w-full rounded-sm px-3 py-2 text-left text-sm",
                  index === selectedIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted",
                )}
              >
                {item}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Natija topilmadi
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

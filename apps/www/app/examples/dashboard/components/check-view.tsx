"use client";

import * as React from "react";
import { CheckIcon, SunIcon } from "@radix-ui/react-icons";



import { cn } from "@/lib/utils";
import { Badge } from "@/registry/new-york/ui/badge";
import { Button } from "@/registry/new-york/ui/button";
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from "@/registry/new-york/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/new-york/ui/popover";
import { Separator } from "@/registry/new-york/ui/separator";





interface DataTableFacetedFilterProps {
  title?: string
  onSelectedChange: (selectedValues: Set<string>) => void
}

const options = [
  { value: "hl_up", label: "涨停", icon: {} },
  { value: "hl_low", label: "跌停", icon: {} },
  { value: "hl_zero", label: "平盘", icon: {} },
  { value: "hl_newHigh", label: "新高", icon: {} },
  { value: "hl_newLow", label: "新低", icon: {} },
]

export function CheckView({
  title,
  onSelectedChange,
}: DataTableFacetedFilterProps) {
  const [selectedValues, setSelectedValues] = React.useState(new Set<string>())

  const handleSelect = (value: string) => {
    console.log("选中的值:", value)
    const newSelectedValues = new Set(selectedValues)
    if (newSelectedValues.has(value)) {
      newSelectedValues.delete(value)
    } else {
      newSelectedValues.add(value)
    }
    setSelectedValues(newSelectedValues)
    onSelectedChange(newSelectedValues)
  }

  const handleClear = () => {
    const newSelectedValues = new Set<string>()
    setSelectedValues(newSelectedValues)
    onSelectedChange(newSelectedValues)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-sm border-dashed h-9"
        >
          <SunIcon className="w-4 h-4 mr-2" />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="h-4 mx-2" />
              <Badge
                variant="secondary"
                className="px-1 font-normal rounded-sm lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="px-1 font-normal rounded-sm"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="px-1 font-normal rounded-sm"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selectedValues.has(option.value)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <CheckIcon className={cn("h-4 w-4")} />
                  </div>
                  <span>{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClear}
                    className="justify-center text-center text-red-500"
                  >
                    清除高亮
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { PopoverProps } from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/registry/new-york/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"

import { Factor, factors } from "../data/factors"
import { Preset } from "../data/presets"

interface PresetSelectorProps extends PopoverProps {
  title?: string
  presets: Preset[]
  onPresetSelect?: (selectedPreset: Factor) => void // 添加这一行
}

export function PresetSelector({
  title,
  presets,
  onPresetSelect,
  ...props
}: PresetSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedPreset, setSelectedPreset] = React.useState<Factor>()
  const router = useRouter()
  // Flatten all children into a single array
  const allChildren = factors.reduce(
    (acc, factor) => acc.concat(factor.children),
    [] as Factor[]
  )

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="选择因子指标"
          aria-expanded={open}
          className="flex-1 justify-between md:max-w-[200px] lg:max-w-[250px]"
        >
          <div className="flex flex-1 min-w-0">
            <span className="pr-2 opacity-50">{title}</span>
            <span className="truncate">
              {selectedPreset ? selectedPreset.factorName : "选择指标..."}
            </span>
          </div>

          <CaretSortIcon className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 max-h-[400px] overflow-y-auto">
        <Command>
          <CommandInput placeholder="Search presets..." />
          <CommandEmpty>No presets found.</CommandEmpty>
          <CommandGroup heading="所有因子指标">
            {allChildren.map((subFactor: Factor) => (
              <CommandItem
                key={subFactor.factorId}
                onSelect={() => {
                  setSelectedPreset(subFactor)
                  setOpen(false)
                  onPresetSelect?.(subFactor) // 调用回调函数
                }}
              >
                {subFactor.factorName}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedPreset?.factorId === subFactor.factorId
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
          {/* <CommandGroup className="pt-0">
            <CommandItem onSelect={() => router.push("/examples")}>
              More examples
            </CommandItem>
          </CommandGroup> */}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

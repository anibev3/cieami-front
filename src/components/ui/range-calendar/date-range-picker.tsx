/* eslint-disable max-lines */
'use client'

import React, { type FC, useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { DateInput } from '@/components/ui/range-calendar/date-input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ChevronUpIcon, ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'

export interface DateRangePickerProps {
  /** Click handler for applying the updates from DateRangePicker. */
  onUpdate?: (values: { range: DateRange, rangeCompare?: DateRange }) => void
  /** Initial value for start date */
  initialDateFrom?: Date | string
  /** Initial value for end date */
  initialDateTo?: Date | string
  /** Initial value for start date for compare */
  initialCompareFrom?: Date | string
  /** Initial value for end date for compare */
  initialCompareTo?: Date | string
  /** Alignment of popover */
  align?: 'start' | 'center' | 'end'
  /** Option for locale */
  locale?: string
  /** Option for showing compare feature */
  showCompare?: boolean
  /** Option for class name */
  className?: string
}

const formatDate = (date: Date, locale: string = 'fr-FR'): string => {
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
  if (typeof dateInput === 'string') {
    const parts = dateInput.split('-').map((part) => parseInt(part, 10))
    const date = new Date(parts[0], parts[1] - 1, parts[2])
    return date
  } else {
    return dateInput
  }
}

interface DateRange {
  from: Date
  to: Date | undefined
}

interface Preset {
  name: string
  label: string
}

const PRESETS: Preset[] = [
  { name: 'today', label: 'Aujourd\'hui' },
  { name: 'yesterday', label: 'Hier' },
  { name: 'last7', label: '7 derniers jours' },
  { name: 'last14', label: '14 derniers jours' },
  { name: 'last30', label: '30 derniers jours' },
  { name: 'thisWeek', label: 'Cette semaine' },
  { name: 'lastWeek', label: 'Semaine dernière' },
  { name: 'thisMonth', label: 'Ce mois' },
  { name: 'lastMonth', label: 'Mois dernier' }
]

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker: FC<DateRangePickerProps> & {
  filePath: string
} = ({
  initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
  initialDateTo,
  initialCompareFrom,
  initialCompareTo,
  onUpdate,
  align = 'end',
  locale = 'fr-FR',
  showCompare = true,
  className
}): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)

  const [range, setRange] = useState<DateRange>({
    from: getDateAdjustedForTimezone(initialDateFrom),
    to: initialDateTo
      ? getDateAdjustedForTimezone(initialDateTo)
      : getDateAdjustedForTimezone(initialDateFrom)
  })
  const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
    initialCompareFrom
      ? {
          from: new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
          to: initialCompareTo
            ? new Date(new Date(initialCompareTo).setHours(0, 0, 0, 0))
            : new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0))
        }
      : undefined
  )

  const openedRangeRef = useRef<DateRange | undefined>(undefined)
  const openedRangeCompareRef = useRef<DateRange | undefined>(undefined)
  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined)

  // Breakpoints plus précis pour différents cas d'usage
  const [screenSize, setScreenSize] = useState<'xs' | 'sm' | 'md' | 'lg'>('lg')

  useEffect(() => {
    const updateScreenSize = (): void => {
      const width = window.innerWidth
      if (width < 480) {
        setScreenSize('xs') // Très petits écrans (mobiles)
      } else if (width < 768) {
        setScreenSize('sm') // Petits écrans (tablettes portrait)
      } else if (width < 1024) {
        setScreenSize('md') // Écrans moyens (tablettes paysage)
      } else {
        setScreenSize('lg') // Grands écrans (desktop)
      }
    }

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)

    return () => {
      window.removeEventListener('resize', updateScreenSize)
    }
  }, [])

  const getPresetRange = (presetName: string): DateRange => {
    const preset = PRESETS.find(({ name }) => name === presetName)
    if (!preset) throw new Error(`Unknown date range preset: ${presetName}`)
    const from = new Date()
    const to = new Date()
    const first = from.getDate() - from.getDay()

    switch (preset.name) {
      case 'today':
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case 'yesterday':
        from.setDate(from.getDate() - 1)
        from.setHours(0, 0, 0, 0)
        to.setDate(to.getDate() - 1)
        to.setHours(23, 59, 59, 999)
        break
      case 'last7':
        from.setDate(from.getDate() - 6)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case 'last14':
        from.setDate(from.getDate() - 13)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case 'last30':
        from.setDate(from.getDate() - 29)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case 'thisWeek':
        from.setDate(first)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case 'lastWeek':
        from.setDate(from.getDate() - 7 - from.getDay())
        to.setDate(to.getDate() - to.getDay() - 1)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case 'thisMonth':
        from.setDate(1)
        from.setHours(0, 0, 0, 0)
        to.setHours(23, 59, 59, 999)
        break
      case 'lastMonth':
        from.setMonth(from.getMonth() - 1)
        from.setDate(1)
        from.setHours(0, 0, 0, 0)
        to.setDate(0)
        to.setHours(23, 59, 59, 999)
        break
    }

    return { from, to }
  }

  const setPreset = (preset: string): void => {
    const range = getPresetRange(preset)
    setRange(range)
    if (rangeCompare) {
      const rangeCompare = {
        from: new Date(
          range.from.getFullYear() - 1,
          range.from.getMonth(),
          range.from.getDate()
        ),
        to: range.to
          ? new Date(
            range.to.getFullYear() - 1,
            range.to.getMonth(),
            range.to.getDate()
          )
          : undefined
      }
      setRangeCompare(rangeCompare)
    }
  }

  const checkPreset = (): void => {
    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name)

      const normalizedRangeFrom = new Date(range.from);
      normalizedRangeFrom.setHours(0, 0, 0, 0);
      const normalizedPresetFrom = new Date(
        presetRange.from.setHours(0, 0, 0, 0)
      )

      const normalizedRangeTo = new Date(range.to ?? 0);
      normalizedRangeTo.setHours(0, 0, 0, 0);
      const normalizedPresetTo = new Date(
        presetRange.to?.setHours(0, 0, 0, 0) ?? 0
      )

      if (
        normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
        normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
      ) {
        setSelectedPreset(preset.name)
        return
      }
    }

    setSelectedPreset(undefined)
  }

  const resetValues = (): void => {
    setRange({
      from:
        typeof initialDateFrom === 'string'
          ? getDateAdjustedForTimezone(initialDateFrom)
          : initialDateFrom,
      to: initialDateTo
        ? typeof initialDateTo === 'string'
          ? getDateAdjustedForTimezone(initialDateTo)
          : initialDateTo
        : typeof initialDateFrom === 'string'
          ? getDateAdjustedForTimezone(initialDateFrom)
          : initialDateFrom
    })
    setRangeCompare(
      initialCompareFrom
        ? {
            from:
              typeof initialCompareFrom === 'string'
                ? getDateAdjustedForTimezone(initialCompareFrom)
                : initialCompareFrom,
            to: initialCompareTo
              ? typeof initialCompareTo === 'string'
                ? getDateAdjustedForTimezone(initialCompareTo)
                : initialCompareTo
              : typeof initialCompareFrom === 'string'
                ? getDateAdjustedForTimezone(initialCompareFrom)
                : initialCompareFrom
          }
        : undefined
    )
  }

  useEffect(() => {
    checkPreset()
  }, [range])

  const PresetButton = ({
    preset,
    label,
    isSelected
  }: {
    preset: string
    label: string
    isSelected: boolean
  }): React.JSX.Element => (
    <Button
      className={cn(
        "w-full justify-start text-left text-xs",
        isSelected && 'pointer-events-none'
      )}
      variant="ghost"
      size="xs"
      onClick={() => {
        setPreset(preset)
      }}
    >
      <>
        <span className={cn('pr-2 opacity-0', isSelected && 'opacity-70')}>
          <CheckIcon width={16} height={16} />
        </span>
        {label}
      </>
    </Button>
  )

  const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
    if (!a || !b) return a === b
    return (
      a.from.getTime() === b.from.getTime() &&
      (!a.to || !b.to || a.to.getTime() === b.to.getTime())
    )
  }

  useEffect(() => {
    if (isOpen) {
      openedRangeRef.current = range
      openedRangeCompareRef.current = rangeCompare
    }
  }, [isOpen])

  // Configuration responsive pour le popover
  const getPopoverWidth = () => {
    switch (screenSize) {
      case 'xs':
        return 'w-[95vw] max-w-[350px]'
      case 'sm':
        return 'w-[90vw] max-w-[450px]'
      case 'md':
        return 'w-[600px]'
      default:
        return 'w-[800px]'
    }
  }

  const showPresetsSidebar = screenSize === 'lg'
  const numberOfMonths = screenSize === 'xs' ? 1 : screenSize === 'sm' ? 1 : screenSize === 'md' ? 1 : 2

  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          resetValues()
        }
        setIsOpen(open)
      }}
    >
      <PopoverTrigger asChild>
        <Button 
          size={screenSize === 'xs' ? 'default' : ''} 
          variant="outline"
          className="min-w-fit"
        >
          <div className="text-right">
            <div className="py-1">
              <div className={cn(
                "truncate",
                screenSize === 'xs' && "max-w-[200px] text-xs"
              )}>
                {`${formatDate(range.from, locale)}${
                  range.to != null ? ' - ' + formatDate(range.to, locale) : ''
                }`}
              </div>
            </div>
            {rangeCompare != null && (
              <div className={cn(
                "opacity-60 -mt-1",
                screenSize === 'xs' ? "text-[10px]" : "text-xs"
              )}>
                <>
                  vs. {formatDate(rangeCompare.from, locale)}
                  {rangeCompare.to != null
                    ? ` - ${formatDate(rangeCompare.to, locale)}`
                    : ''}
                </>
              </div>
            )}
          </div>
          <div className="pl-1 opacity-60 -mr-2 scale-125">
            {isOpen ? (<ChevronUpIcon width={20} />) : (<ChevronDownIcon width={20} />)}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        align={screenSize === 'xs' ? 'center' : align} 
        className={cn(getPopoverWidth(), "p-0 overflow-y-auto", className)}
        sideOffset={8}
      >
        <div className="flex flex-col overflow-y-auto">
          {/* Header avec contrôles */}
          <div className="flex-shrink-0 border-b">
            <div className="space-y-4 px-14 flex items-center justify-between">
              <div className="">
                {/* Switch de comparaison */}
                {/* {showCompare && (
                  <div className="flex items-center justify-between">
                    <Label htmlFor="compare-mode" className="text-sm font-medium">
                      Comparer les périodes
                    </Label>
                    <Switch
                      defaultChecked={Boolean(rangeCompare)}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) {
                          if (!range.to) {
                            setRange({
                              from: range.from,
                              to: range.from
                            })
                          }
                          setRangeCompare({
                            from: new Date(
                              range.from.getFullYear(),
                              range.from.getMonth(),
                              range.from.getDate() - 365
                            ),
                            to: range.to
                              ? new Date(
                                range.to.getFullYear() - 1,
                                range.to.getMonth(),
                                range.to.getDate()
                              )
                              : new Date(
                                range.from.getFullYear() - 1,
                                range.from.getMonth(),
                                range.from.getDate()
                              )
                          })
                        } else {
                          setRangeCompare(undefined)
                        }
                      }}
                      id="compare-mode"
                    />
                  </div>
                )} */}

                {/* Inputs de dates */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 h-10">
                    <DateInput
                      value={range.from}
                      onChange={(date) => {
                        const toDate =
                          range.to == null || date > range.to ? date : range.to
                        setRange((prevRange) => ({
                          ...prevRange,
                          from: date,
                          to: toDate
                        }))
                      }}
                      className="flex-1 h-8"
                    />
                    <span className="text-muted-foreground">-</span>
                    <DateInput
                      value={range.to}
                      onChange={(date) => {
                        const fromDate = date < range.from ? date : range.from
                        setRange((prevRange) => ({
                          ...prevRange,
                          from: fromDate,
                          to: date
                        }))
                      }}
                      className="flex-1 h-8"
                    />
                  </div>

                  {/* {rangeCompare != null && (
                    <div className="flex items-center gap-2">
                      <DateInput
                        value={rangeCompare?.from}
                        onChange={(date) => {
                          if (rangeCompare) {
                            const compareToDate =
                              rangeCompare.to == null || date > rangeCompare.to
                                ? date
                                : rangeCompare.to
                            setRangeCompare((prevRangeCompare) => ({
                              ...prevRangeCompare,
                              from: date,
                              to: compareToDate
                            }))
                          } else {
                            setRangeCompare({
                              from: date,
                              to: new Date()
                            })
                          }
                        }}
                        className="flex-1"
                      />
                      <span className="text-muted-foreground">-</span>
                      <DateInput
                        value={rangeCompare?.to}
                        onChange={(date) => {
                          if (rangeCompare && rangeCompare.from) {
                            const compareFromDate =
                              date < rangeCompare.from
                                ? date
                                : rangeCompare.from
                            setRangeCompare({
                              ...rangeCompare,
                              from: compareFromDate,
                              to: date
                            })
                          }
                        }}
                        className="flex-1"
                      />
                    </div>
                  )} */}
                </div>

                {/* Select pour les presets sur petits écrans */}
                {!showPresetsSidebar && (
                  <Select 
                    value={selectedPreset} 
                    onValueChange={(value) => { setPreset(value) }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une période..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PRESETS.map((preset) => (
                        <SelectItem key={preset.name} value={preset.name}>
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => {
                    setIsOpen(false)
                    resetValues()
                  }}
                  variant="outline"
                  // size={screenSize === 'xs' ? 'sm' : 'default'}
                  size={'xs'}
                >
                  Annuler
                </Button>
                <Button
                  onClick={() => {
                    setIsOpen(false)
                    if (
                      !areRangesEqual(range, openedRangeRef.current) ||
                      !areRangesEqual(rangeCompare, openedRangeCompareRef.current)
                    ) {
                      onUpdate?.({ range, rangeCompare })
                    }
                  }}
                  // size={screenSize === 'xs' ? 'sm' : 'default'}
                  size={'xs'}
                >
                  Appliquer
                </Button>
              </div>
            </div>
          </div>

          {/* Contenu principal avec calendrier et presets */}
          <div className="flex flex-1 overflow-y-auto">
            {/* Zone du calendrier */}
            <div className="flex-1 p-4 overflow-auto">
              <Calendar
                mode="range"
                onSelect={(value: { from?: Date, to?: Date } | undefined) => {
                  if (value?.from != null) {
                    setRange({ from: value.from, to: value?.to })
                  }
                }}
                selected={range}
                numberOfMonths={numberOfMonths}
                defaultMonth={
                  new Date(
                    new Date().setMonth(
                      new Date().getMonth() - (numberOfMonths === 2 ? 1 : 0)
                    )
                  )
                }
                className="w-full"
              />
            </div>

            {/* Sidebar des presets pour grands écrans */}
            {showPresetsSidebar && (
              <div className="flex-shrink-0 w-48 p-4 border-l bg-muted/20">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium mb-3">Périodes rapides</h4>
                  {PRESETS.map((preset) => (
                    <PresetButton
                      key={preset.name}
                      preset={preset.name}
                      label={preset.label}
                      isSelected={selectedPreset === preset.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

DateRangePicker.displayName = 'DateRangePicker'
DateRangePicker.filePath =
  'libs/shared/ui-kit/src/lib/date-range-picker/date-range-picker.tsx'
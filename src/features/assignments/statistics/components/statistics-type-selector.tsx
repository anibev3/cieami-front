import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { STATISTICS_TYPES, StatisticsType } from '@/types/statistics'
import { cn } from '@/lib/utils'

interface StatisticsTypeSelectorProps {
  selectedType: StatisticsType
  onTypeChange: (type: StatisticsType) => void
  availableTypes?: StatisticsType[]
  className?: string
}

export function StatisticsTypeSelector({ 
  selectedType, 
  onTypeChange, 
  availableTypes,
  className 
}: StatisticsTypeSelectorProps) {
  // Filtrer les types disponibles selon les permissions
  const filteredTypes = availableTypes 
    ? STATISTICS_TYPES.filter(typeConfig => availableTypes.includes(typeConfig.type))
    : STATISTICS_TYPES

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {filteredTypes.map((typeConfig) => (
        <Card
          key={typeConfig.type}
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-md shadow-none",
            "border-2",
            selectedType === typeConfig.type
              ? "border-primary bg-primary/5 shadow-md"
              : "border-border hover:border-primary/50"
          )}
          onClick={() => onTypeChange(typeConfig.type)}
        >
          <CardHeader className="">
            <CardTitle className="flex items-center gap-3 text-lg">
              <span className="text-2xl">{typeConfig.icon}</span>
              <div className="flex flex-col">
                <span>{typeConfig.label}</span>
                <Badge 
                  variant={selectedType === typeConfig.type ? "default" : "outline"}
                  className="w-fit mt-1"
                >
                  {typeConfig.type}
                </Badge>
              </div>
            </CardTitle>
             <p className="text-sm text-muted-foreground leading-relaxed">
              {typeConfig.description}
            </p>
          </CardHeader>
          {/* <CardContent>
            <div className="mt-3 flex flex-wrap gap-1">
              {typeConfig.filters.slice(0, 3).map((filter) => (
                <Badge key={filter} variant="outline" className="text-xs">
                  {filter}
                </Badge>
              ))}
              {typeConfig.filters.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{typeConfig.filters.length - 3} autres
                </Badge>
              )}
            </div>
          </CardContent> */}
        </Card>
      ))}
    </div>
  )
}

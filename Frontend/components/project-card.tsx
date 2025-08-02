import { Card, CardContent } from "@/components/ui/card"

interface ProjectCardProps {
  title: string
  system: string
  isEmpty?: boolean
}

export function ProjectCard({ title, system, isEmpty = false }: ProjectCardProps) {
  return (
    <Card className={`${isEmpty ? "border-dashed border-2 border-gray-300" : "bg-teal-50 border-teal-200"}`}>
      <CardContent className="p-4">
        <div className="text-center">
          <h3 className={`font-medium ${isEmpty ? "text-gray-400" : "text-gray-900"}`}>{title}</h3>
          <p className={`text-sm mt-1 ${isEmpty ? "text-gray-400" : "text-gray-600"}`}>{system}</p>
        </div>
      </CardContent>
    </Card>
  )
}

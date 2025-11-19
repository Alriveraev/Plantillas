import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ActivityChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Mensual</CardTitle>
        <CardDescription>
          Usuarios activos en los últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          Gráfico de actividad (Implementar con recharts o similar)
        </div>
      </CardContent>
    </Card>
  );
};

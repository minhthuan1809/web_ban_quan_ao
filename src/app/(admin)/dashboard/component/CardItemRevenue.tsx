import { formatCurrency } from "@/app/_util/formatCurrency";
import GetIconComponent from "@/app/_util/Icon";
import { Card, CardBody } from "@nextui-org/react";
import { Metric, Text } from "@tremor/react";
import React from "react";

export default function CardItemRevenue({
  stats,
  icon = {
    icon: "Calendar",
    className: "w-3 h-3 text-primary",
  },
  title = "Tổng doanh thu",
  description = "Tính theo ngày",
}: {
  stats: any;
  icon: {
    icon: string;
    className: string;
  };
  title: string;
  description: string;
}) {
  return (
    <Card className="border-none shadow-md hover:shadow-xl transition-all duration-200 bg-content1">
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Text className="text-foreground/80 font-medium">{title}</Text>
            <Metric className="text-3xl font-bold text-foreground">
              {formatCurrency(stats)}
            </Metric>
            <div className="flex items-center mt-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                <GetIconComponent
                  icon={icon.icon as any}
                  className="w-4 h-4 text-primary"
                />
              </div>
              <Text className="text-sm text-foreground/60">{description}</Text>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transform transition-transform duration-200 hover:scale-110">
            <GetIconComponent 
              icon={icon.icon as any} 
              className="w-6 h-6 text-primary"
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

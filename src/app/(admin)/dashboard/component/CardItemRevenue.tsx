import { formatCurrency } from "@/app/_util/formatCurrency";
import GetIconComponent from "@/app/_util/Icon";
import { Card, CardBody } from "@nextui-org/react";
import { Metric, Text } from "@tremor/react";
import React from "react";

export default function CardItemRevenue({
  stats,
  icon = {
    icon: "Calendar",
    className: "w-3 h-3 text-blue-500",
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
    <div>
      <Card className="border border-gray-200 shadow-sm">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Text className="text-gray-500 text-sm">{title}</Text>
              <Metric className="text-2xl font-semibold">
                {formatCurrency(stats)} 
              </Metric>
              <div className="flex items-center mt-2">
                <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <GetIconComponent
                    icon={icon.icon as any}
                    className="w-3 h-3 text-blue-500"
                  />
                </div>
                <Text className="text-xs text-gray-500">{description}</Text>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <GetIconComponent icon={icon.icon as any} className={icon?.className} />
                </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

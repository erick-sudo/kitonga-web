// import { CodeBracketIcon } from "@heroicons/react/24/outline";
// import {
//   ApacheEChart,
//   areaChartOptions,
//   pieChartOptions,
// } from "../ui/ApacheEChart";
// import { KTooltip } from "../ui/KTooltip";

import { CSSProperties } from "react";



export default function Home() {
  const brands = [
    "Asus",
    "Dell",
    "Hp",
    { Lenovo: "age" },
    { linux: ["Kali", "Ubuntu", "Zorin", "Arch"] },
  ];
  return (
    <div className="p-12">
      <h3>Home</h3>

      {/* <DisplayObject
        entryClassName="flex"
        className="text-sm"
        indent={16}
        value={{ name: "Erick", schools: "jkuat", brands }}
      /> */}

      {/* <KTooltip
        tooltipContent={
          <div className="">He sells sea shells at the sea shore</div>
        }
      >
        More
      </KTooltip> */}

      {/* <Card
        icon={{
          content: <CodeBracketIcon height={24} />,
          height: 96,
          width: 96,
        }}
        border={{
          color: "teal",
          width: 12,
        }}
        background="white"
      >
        <div className="h-48"></div>
      </Card> */}
      {/* <ApacheEChart
        options={areaChartOptions({
          title: "Brand Sales",
          xAxisLabels: ["Asus", "Dell", "Hp", "Lenovo"],
          series: [{ name: "Sales", color: "teal", data: [10, 67, 23, 45] }],
        })}
        className="h-96"
      />

      <ApacheEChart
        options={pieChartOptions({
          title: "Brand Purchases",
          series: [
            {
              name: "Purchases",
              radius: "50%",
              data: brands.map((b) => ({
                name: b,
                value: Math.random() * 100,
                color: "red",
              })),
            },
          ],
        })}
        className="h-96"
      /> */}
    </div>
  );
}

export function Card({
  icon,
  children,
  border: { color, width },
  background,
}: {
  icon: {
    content: React.ReactNode;
    height: number;
    width: number;
  };
  children?: React.ReactNode;
  border: {
    color: string;
    width: number;
  };
  background: string;
}) {
  return (
    <div
      style={{
        padding: `${width}px`,
        backgroundColor: color,
        borderRadius: `${width}px`,
        borderTopLeftRadius: `${width * 4}px`,
      }}
    >
      <div
        style={{
          display: "flex",
          backgroundColor: background,
        }}
      >
        <div
          style={{
            paddingLeft: `${width * 0.5}px`,
            paddingTop: `${width * 0.5}px`,
            paddingBottom: `${width}px`,
            paddingRight: `${width}px`,
            backgroundColor: color,
            borderBottomRightRadius: `${width * 5}px`,
          }}
        >
          <div
            style={{
              height: `${icon.height}px`,
              width: `${icon.width}px`,
              backgroundColor: background,
              borderRadius: `${width * 0.5}px`,
              borderTopLeftRadius: `${width * 3.3}px`,
              borderBottomRightRadius: `${width * 4.3}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon.content}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexGrow: 1,
            backgroundColor: color,
          }}
        >
          <div
            style={{
              flexGrow: 1,
              borderTopLeftRadius: `${width * 1.5}px`,
              borderTopRightRadius: `${width}px`,
              backgroundColor: background,
            }}
          ></div>
        </div>
      </div>
      <div
        style={{
          backgroundColor: background,
          borderTopLeftRadius: `${width * 1.5}px`,
          borderBottomRightRadius: `${width}px`,
          borderBottomLeftRadius: `${width}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

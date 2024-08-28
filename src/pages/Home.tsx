import { CodeBracketIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="p-12">
      <h3>Home</h3>

      <Card
        icon={{
          content: <CodeBracketIcon height={24} />,
          height: 196,
          width: 96,
        }}
        border={{
          color: "teal",
          width: 8,
        }}
        background="white"
      >
        <div className="h-48"></div>
      </Card>
    </div>
  );
}

function Card({
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
              borderTopLeftRadius: `${width * 3.5}px`,
              borderBottomRightRadius: `${width * 5}px`,
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

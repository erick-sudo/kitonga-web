consider the following components:

```js
export function TanstackSuspense<T>({
  keepPrevious,
  queryKey,
  queryFn,
  fallback,
  RenderError,
  RenderData,
  defaultErrorClassName,
}: TanstackSuspenseFNProps<T>) {
  const { data, isPending, error, isError } = useQuery({
    queryKey,
    queryFn,
    placeholderData: keepPrevious ? keepPreviousData : undefined,
  });

  if (isPending) return <>{fallback}</>;

  if (isError)
    return (
      <>
        {RenderError ? (
          <RenderError error={error} />
        ) : (
          <div className={`${defaultErrorClassName}`}>{error.message}</div>
        )}
      </>
    );

  return <RenderData data={data} />;
}

export function InputField({
  name,
  options,
  label,
  required,
  value,
  onChange,
  sx = MUI_STYLES.FilledInputTextField3,
}: ControlledMuiFieldOptions) {
  return options.type === "select" ? (
    <InputSelection
      required={required}
      name={name}
      label={label}
      sx={sx}
      options={options.options}
      value={value}
      onChange={(v) => onChange(v)}
    />
  ) : (
    <TextField
      type={options.type}
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={sx}
      variant="filled"
      margin="none"
      required={required}
      fullWidth
      id="identity"
      label={label}
      name={label}
      multiline={options.type === "textarea"}
      rows={options.type === "textarea" ? options.rows || 4 : undefined}
    />
  );
}
```

Why do you think the input fields wrapped inside my custom Suspense component via the RenderData prop which is also React.FC, loose focus immediately after i enter a single letter or character via the keyboard.

For example. consider the following usage:

```js
export function OpenNewCaseModal() {
  const handleRequest = useAPI();
  const queryClient = useQueryClient();
  const [newCase, setNewCase] = useState<Record<string, string | number>>({
    client_id: "",
    title: "",
    description: "",
    case_no_or_parties: "",
  });
  const [creating, setCreating] = useState(false);
  const [openNewCaseModal, setOpenNewCaseModal] = useState(false);

  function handleCreateCase() {
    setCreating(true);
    handleRequest({
      func: axiosPost,
      args: [APIS.cases.postCase, newCase],
    })
      .then((res) => {
        if (res.status === "ok") {
          alert("Hurray!");
        } else {
          console.log(res);
          alert("Error");
        }
      })
      .finally(() => {
        setCreating(false);
      });
  }
  return (
    <TanstackSuspense
      fallback={
        <div className="flex items-center gap-2 bg-white shadow p-4 rounded">
          <span className=" animate-spin">
            <Cog8ToothIcon height={20} />
          </span>
          <div>Fetching clients...</div>
        </div>
      }
      queryKey={[TANSTACK_QUERY_KEYS.ALL_CLIENTS]}
      queryFn={() =>
        handleRequest<PartialClient[]>({
          func: axiosGet,
          args: [APIS.clients.getAllClients],
        })
      }
      RenderData={({ data }) => {
        return (
          <div>
            <InputField
              name="title"
              value={newCase["title"]}
              onChange={(v) => {
                setNewCase({ ...newCase, title: v });
              }}
              options={{ type: "text" }}
              label="Title"
            />
          </div>
        );
      }}
    />
  )
}
```

```js
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const PieChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const options = {
      title: {
        text: 'Pie Chart Example',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    chartInstance.setOption(options);

    // Clean up the chart on unmount
    return () => {
      chartInstance.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default PieChart;

```
```js
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const AreaChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const options = {
      title: {
        text: 'Area Chart Example',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Data',
          type: 'line',
          areaStyle: {},
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
    };

    chartInstance.setOption(options);

    // Clean up the chart on unmount
    return () => {
      chartInstance.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default AreaChart;

```
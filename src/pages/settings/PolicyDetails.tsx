import { useParams } from "react-router-dom";
import { TanstackSuspense } from "../../ui/TanstackSuspense";
import { CaseDetailsSkeleton } from "../../ui/Skeletons";
import useAPI from "../../hooks/useAPI";
import { TANSTACK_QUERY_KEYS } from "../../lib/KEYS";
import { AccessPolicy } from "../../lib/definitions";
import { axiosGet } from "../../lib/axiosLib";
import { APIS } from "../../lib/apis";
import { Alert } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import TableValues from "../../ui/TableValues";
import { snakeCaseToTitleCase } from "../../lib/utils";
import { RequestErrorsWrapperNode } from "../../ui/DisplayObject";

export function PolicyDetails() {
  const { policyId } = useParams();
  const accessPolicyId = `${policyId}`;
  const handleRequest = useAPI();
  const accessPolicyKey = `${TANSTACK_QUERY_KEYS.ACCESS_POLICY_DETAILS}#${accessPolicyId}`;

  return (
    <div className="p-2">
      <TanstackSuspense
        fallback={<CaseDetailsSkeleton />}
        queryKey={[accessPolicyKey]}
        queryFn={() =>
          handleRequest<AccessPolicy>({
            func: axiosGet,
            args: [
              APIS.authorization.accessPolicies.show.replace(
                "<:policyId>",
                accessPolicyId
              ),
            ],
          })
        }
        RenderData={({ data }) => {
          if (data.status === "ok" && data.result) {
            const {
              id,
              name,
              description,
              effect,
              actions,
              principals,
              resources,
              conditions,
              created_at,
              updated_at,
            } = data.result;

            return (
              <div className="grid gap-2">
                <div className="flex flex-col lg:flex-row gap-2">
                  <div className="grid gap-2 max-w-lg">
                    <h3>Policy Details</h3>
                    <TableValues
                      transformKeys={(k) => snakeCaseToTitleCase(k)}
                      className="rounded"
                      values={{
                        id,
                        name,
                        description,
                        effect,
                        created: `${new Date(
                          created_at
                        ).toDateString()} at ${new Date(
                          created_at
                        ).toLocaleTimeString()}`,
                        last_updated: `${new Date(
                          updated_at
                        ).toDateString()} at ${new Date(
                          updated_at
                        ).toLocaleTimeString()}`,
                      }}
                      keyClassName="px-4"
                      valueClassName="gap-2"
                      copy={{
                        fields: ["id", "name"],
                        copyContentProps: {
                          iconClassName: "p-0.5",
                          className:
                            "flex items-center border border-gray-500 text-gray-500 rounded",
                        },
                      }}
                    />

                    <TableValues
                      transformKeys={(k) => snakeCaseToTitleCase(k)}
                      className="rounded"
                      values={{
                        created: `${new Date(
                          created_at
                        ).toDateString()} at ${new Date(
                          created_at
                        ).toLocaleTimeString()}`,
                        last_updated: `${new Date(
                          updated_at
                        ).toDateString()} at ${new Date(
                          updated_at
                        ).toLocaleTimeString()}`,
                      }}
                      keyClassName="px-4"
                      valueClassName="gap-2"
                    />

                    <p>
                      The listed principals are either&nbsp;<b>Allowed</b>
                      &nbsp;or&nbsp;
                      <b>Denied</b>&nbsp;based on specific conditions if
                      specified&nbsp;,&nbsp;to perform the specified actions on
                      these resources
                    </p>

                    <div>
                      <h4>Actions</h4>
                      <p></p>
                      <div className="border rounded">
                        {actions.map((krn, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-2 py-1 border-b last:border-none"
                          >
                            <span className="bg-gray-400 h-1 w-1 rounded-full"></span>
                            <span className="grid flex-grow">
                              <span className="flex-grow block truncate text-gray-600">
                                {krn}
                              </span>
                            </span>
                            <span className="h-5 w-5 flex items-center justify-center border border-gray-400 text-gray-400 rounded">
                              <ContentCopy className="p-1" fontSize="small" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4>Principals</h4>
                      <div className="border rounded">
                        {principals.map((krn, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-2 py-1 border-b last:border-none"
                          >
                            <span className="bg-gray-400 h-1 w-1 rounded-full"></span>
                            <span className="grid flex-grow">
                              <span className="flex-grow block truncate text-gray-600">
                                {krn}
                              </span>
                            </span>
                            <span className="h-5 w-5 flex items-center justify-center border border-gray-400 text-gray-400 rounded">
                              <ContentCopy className="p-1" fontSize="small" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4>Resources</h4>
                      <div className="border rounded">
                        {resources.map((krn, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-2 py-1 border-b last:border-none"
                          >
                            <span className="bg-gray-400 h-1 w-1 rounded-full"></span>
                            <span className="grid flex-grow">
                              <span className="flex-grow block truncate text-gray-600">
                                {krn}
                              </span>
                            </span>
                            <span className="h-5 w-5 flex items-center justify-center border border-gray-400 text-gray-400 rounded">
                              <ContentCopy className="p-1" fontSize="small" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4>Conditions</h4>
                      <div className="border rounded">
                        {conditions.length > 0 ? (
                          conditions.map((krn, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 px-2 py-1 border-b last:border-none"
                            >
                              <span className="bg-gray-400 h-1 w-1 rounded-full"></span>
                              <span className="grid flex-grow">
                                <span className="flex-grow block truncate text-gray-600">
                                  {krn}
                                </span>
                              </span>
                              <span className="h-5 w-5 flex items-center justify-center border border-gray-400 text-gray-400 rounded">
                                <ContentCopy className="p-1" fontSize="small" />
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="p-2">None specified</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border rounded flex-grow bg-gray-50 shadow max-w-lg">
                    <div className="flex justify-between py-2 px-4">
                      <span>JSON</span>
                      <span className="h-5 w-5 flex items-center justify-center border border-gray-400 text-gray-400 rounded">
                        <ContentCopy className="p-1" fontSize="small" />
                      </span>
                    </div>
                    {/* <textarea className="w-full h-full outline-none px-4 bg-transparent"></textarea> */}
                  </div>
                </div>

                <div className="flex">
                  <div className="max-w-[12rem] flex-grow">
                    <LoadingButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ ...MUI_STYLES.Button, borderRadius: 1 }}
                    >
                      Save Changes
                    </LoadingButton>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div className="rounded border shadow overflow-hidden">
              <Alert severity="error">
                <RequestErrorsWrapperNode
                  fallbackMessage="Could not fetch policy details."
                  requestError={data}
                />
              </Alert>
            </div>
          );
        }}
      />
    </div>
  );
}

import { MUI_STYLES } from "../../lib/MUI_STYLES";
import { useState } from "react";
import {
  CreateAccessPolicyDto,
  PrincipalResourceType,
  ResourceAction,
  ResourceType,
} from "../../lib/definitions";
import useAPI from "../../hooks/useAPI";
import { AlertResponse } from "../../ui/definitions";
import { APIS } from "../../lib/apis";
import { axiosGet, axiosPost } from "../../lib/axiosLib";
import { LoadingButton } from "@mui/lab";
import { Add, Check } from "@mui/icons-material";
import { LazySearch } from "../../ui/Search";
import { insertQueryParams, joinArrays } from "../../lib/utils";
import KRadioGroup from "../../ui/KRadioGroup";
import { Alert } from "@mui/material";
import { KValidationErrors } from "../../ui/KValidationErrors";

export function BuildNewPolicyForm({
  onNewRecord,
}: {
  onNewRecord: () => void;
}) {
  const [principalGroup, setPrincipalGroup] = useState<
    PrincipalResourceType | "all"
  >("all");
  const [resourceGroup, setResourceGroup] = useState<ResourceType | "all">(
    "all"
  );
  const [createRes, setCreateRes] = useState<AlertResponse | null>(null);
  const handleRequest = useAPI();
  const [submitting, setSubmitting] = useState(false);
  const [createPolicyFormData, setCreatePolicyFormData] =
    useState<CreateAccessPolicyDto>({
      name: "",
      description: "",
      effect: "Allow",
      actions: [],
      principals: [],
      resources: [],
      conditions: [],
    });
  const clearFormData = () =>
    setCreatePolicyFormData({
      name: "",
      description: "",
      effect: "Allow",
      actions: [],
      principals: [],
      resources: [],
      conditions: [],
    });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const actionStaged = (_id: string, name: string) =>
    createPolicyFormData.actions.includes(`krn:resourceaction:name:${name}`);

  const principalStaged = (
    principalType: PrincipalResourceType,
    k: string,
    v: string
  ) =>
    createPolicyFormData.principals.includes(`krn:${principalType}:${k}:${v}`);

  const resourceStaged = (resourceType: ResourceType, k: string, v: string) =>
    createPolicyFormData.resources.includes(`krn:${resourceType}:${k}:${v}`);

  const handleSubmit = () => {
    setSubmitting(true);
    handleRequest({
      func: axiosPost,
      args: [APIS.authorization.accessPolicies.create, createPolicyFormData],
    })
      .then((res) => {
        if (res.status === "ok") {
          setCreateRes({
            status: "success",
            message: "Action created successfully",
          });
          clearFormData();
          onNewRecord();
        } else if (res.status === "422") {
          setCreateRes({
            status: "error",
            message:
              "Error processing your input fields please check and try again.",
          });
          setErrors(res.errors.errors as Record<string, string[]>);
        } else if (res.status === "error") {
          setCreateRes({
            status: "error",
            message: res.message,
          });
        }
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="grid gap-2">
      <h3 className="font-bold">Build new policy</h3>
      {createRes && (
        <div className="border shadow">
          <Alert severity={createRes.status}>{createRes.message}</Alert>
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="text-gray-500 flex flex-col gap-2"
      >
        {/* Name */}
        <div>
          <label className="text-sm">
            Enter a policy name <span className="text-red-500">*</span>
          </label>
          <input
            value={createPolicyFormData.name || ""}
            onChange={(e) => {
              setCreatePolicyFormData((p) => ({ ...p, name: e.target.value }));
            }}
            name="name"
            className="w-full bg-gray-50 px-2 py-1 text-sm outline-none border shadow-sm focus:border-teal-600 focus:bg-teal-50/50"
          />
          <KValidationErrors errorKey="name" errors={errors} />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm">
            Briefly describe the policy&nbsp;
            <span className="text-gray-400 font-semibold text-xs">
              [100 characters]
            </span>
            &nbsp;
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={createPolicyFormData.description?.slice(0, 100) || ""}
            onChange={(e) => {
              setCreatePolicyFormData((p) => ({
                ...p,
                description: e.target.value.slice(0, 100) || "",
              }));
            }}
            rows={3}
            name="name"
            className="w-full bg-gray-50 px-2 py-1 text-sm outline-none border shadow-sm focus:border-teal-600 focus:bg-teal-50/50"
          ></textarea>
          <KValidationErrors errorKey="description" errors={errors} />
        </div>

        {/* Effect */}
        <div className="text-sm">
          <label className="mb-0">Select effect</label>
          <div className="flex items-center">
            <KRadioGroup
              labels={["Allow", "Deny"]}
              checkedIcon={<Check />}
              onChange={(v) =>
                setCreatePolicyFormData((p) => ({ ...p, effect: v }))
              }
              value={createPolicyFormData.effect}
              name="effect"
            />
          </div>
          <KValidationErrors errorKey="effect" errors={errors} />
        </div>

        {/* Actions */}
        <div>
          <label className="text-sm">
            Select actions <span className="text-red-500">*</span>
          </label>
          {/* Selected actions */}
          <div className="grid gap-2">
            <div className="flex flex-wrap gap-x-1 gap-y-1">
              {createPolicyFormData.actions.map((action, index) => {
                const name = action.slice(action.lastIndexOf(":") + 1);
                return (
                  <div
                    key={index}
                    className="cursor-pointer border text-sm pl-1.5 bg-white flex gap-2 overflow-hidden"
                  >
                    <span>{name}</span>
                    <span
                      onClick={() =>
                        setCreatePolicyFormData((p) => ({
                          ...p,
                          actions: p.actions.filter((a) => a !== action),
                        }))
                      }
                      className="flex items-center justify-center font-bold w-6 bg-teal-800 text-white hover:bg-teal-600 duration-300"
                    >
                      x
                    </span>
                  </div>
                );
              })}
            </div>
            <LazySearch
              zIndex={20}
              viewPortClassName="max-h-36 vertical-scrollbar"
              className="border bg-gray-50 shadow-sm"
              fetchItems={(q: string) =>
                handleRequest<ResourceAction[]>({
                  func: axiosGet,
                  args: [
                    insertQueryParams(
                      APIS.authorization.searchResource.replace(
                        "<:resource>",
                        "resourceaction"
                      ),
                      { q }
                    ),
                  ],
                }).then((res) => {
                  if (res.status === "ok" && res.result) {
                    return res.result;
                  }
                  return [];
                })
              }
              RenderItem={({ item: { id, name } }) => (
                <div
                  onClick={() => {
                    if (!actionStaged(id, name)) {
                      setCreatePolicyFormData((p) => ({
                        ...p,
                        actions: [
                          ...p.actions,
                          `krn:resourceaction:name:${name}`,
                        ],
                      }));
                    }
                  }}
                  className="flex justify-between border-t w-full text-start text-sm hover:bg-teal-600 hover:border-t-teal-600 hover:text-white px-4 py-0.5 duration-300"
                >
                  <span>{name}</span>
                  {actionStaged(id, name) && (
                    <span>
                      <Check fontSize="small" />
                    </span>
                  )}
                </div>
              )}
            />
          </div>
          <KValidationErrors errorKey="resourceactions" errors={errors} />
        </div>

        {/* Principals */}
        <div>
          <label className="text-sm">
            Select principals <span className="text-red-500">*</span>
          </label>

          {/* Selected Principals */}
          <div className="flex flex-wrap gap-x-1 gap-y-1">
            {createPolicyFormData.principals.map((principal, index) => {
              const [, resource, attribute, value] = principal.split(":");
              return (
                <div
                  key={index}
                  className="cursor-pointer border shadow-sm text-sm pl-1.5 bg-white flex gap-2 overflow-hidden"
                >
                  <span className="border-r pr-2">{resource}</span>
                  <span className="border-r pr-2">{attribute}</span>
                  <span className="grid">
                    <span className="max-w-80 truncate">{value}</span>
                  </span>
                  <span
                    onClick={() =>
                      setCreatePolicyFormData((p) => ({
                        ...p,
                        principals: p.principals.filter((a) => a !== principal),
                      }))
                    }
                    className="flex items-center justify-center font-bold w-6 bg-teal-800 text-white hover:bg-teal-600 duration-300"
                  >
                    x
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-sm">
            Principals are either users, clients, roles or groups
          </div>

          <div className="flex items-center flex-wrap text-sm">
            <KRadioGroup
              labels={["all", "iam", "role", "group", "client"]}
              checkedIcon={<Check />}
              onChange={(v) => setPrincipalGroup(v)}
              value={principalGroup}
              name="effect"
            />
          </div>

          <div className="grid">
            <LazySearch
              zIndex={19}
              viewPortClassName="max-h-44 vertical-scrollbar gap-2"
              className="border bg-gray-50 shadow-sm"
              fetchItems={(q: string) =>
                handleRequest<Record<string, string>[]>({
                  func: axiosGet,
                  args: [
                    insertQueryParams(
                      APIS.authorization.searchResource.replace(
                        "<:resource>",
                        principalGroup
                      ),
                      { q, except: "case,resourceaction" }
                    ),
                  ],
                }).then((res) => {
                  if (res.status === "ok" && res.result) {
                    return res.result;
                  }
                  return [];
                })
              }
              childClassName=""
              RenderItem={({ q, item }) => {
                const principalType = item["entity"] as PrincipalResourceType;
                const p_type =
                  principalGroup === "all" ? principalType : principalGroup;
                return (
                  <fieldset className="group text-start text-sm bg-white hover:bg-teal-600 hover:border-teal-600 hover:text-white p-2 duration-300 border shadow-sm mr-2">
                    {principalGroup === "all" && (
                      <legend className="border text-sm px-2 bg-white group-hover:bg-teal-600 group-hover:border-teal-500 shadow-sm">
                        {principalType}
                      </legend>
                    )}
                    <div>
                      {Object.entries(item)
                        .filter(([k]) =>
                          principalGroup === "all" ? k !== "entity" : true
                        )
                        .map(([k, v], index) => (
                          <div className="text-sm" key={index}>
                            <span className="font-semibold">{k}:</span>&nbsp;
                            <span className="break-all">
                              {joinArrays(
                                String(v),
                                String(q),
                                "bg-black text-white rounded px-0.5"
                              )}
                            </span>
                          </div>
                        ))}
                    </div>
                    <div className="flex gap-x-1 gap-y-0.5">
                      {Object.entries(item)
                        .filter(([k]) =>
                          principalGroup === "all" ? k !== "entity" : true
                        )
                        .map(([k, v], index) => (
                          <div
                            key={index}
                            className="flex items-center border group-hover:border-teal-500 duration-300"
                          >
                            <span className="px-2">{k}</span>

                            {!principalStaged(p_type, k, v) ? (
                              <span
                                onClick={() => {
                                  setCreatePolicyFormData((p) => ({
                                    ...p,
                                    principals: [
                                      ...p.principals,
                                      `krn:${p_type}:${k}:${v}`,
                                    ],
                                  }));
                                }}
                                className="px-1 hover:bg-teal-800 border-l group-hover:border-teal-500"
                              >
                                <Add fontSize="small" />
                              </span>
                            ) : (
                              <span className="px-1 text-teal-500 group-hover:text-gray-200">
                                <Check fontSize="small" />
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </fieldset>
                );
              }}
            />
          </div>
          <KValidationErrors errorKey="principals" errors={errors} />
        </div>

        {/* Resources */}
        <div>
          <label className="text-sm">
            Select resources <span className="text-red-500">*</span>
          </label>

          {/* Selected Reources */}
          <div className="flex flex-wrap gap-x-1 gap-y-1">
            {createPolicyFormData.resources.map((res, index) => {
              const [, resource, attribute, value] = res.split(":");
              return (
                <div
                  key={index}
                  className="cursor-pointer border shadow-sm text-sm pl-1.5 bg-white flex gap-2 overflow-hidden"
                >
                  <span className="border-r pr-2">{resource}</span>
                  <span className="border-r pr-2">{attribute}</span>
                  <span className="grid">
                    <span className="max-w-80 truncate">{value}</span>
                  </span>
                  <span
                    onClick={() =>
                      setCreatePolicyFormData((p) => ({
                        ...p,
                        resources: p.resources.filter((a) => a !== res),
                      }))
                    }
                    className="flex items-center justify-center font-bold w-6 bg-teal-800 text-white hover:bg-teal-600 duration-300"
                  >
                    x
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-sm">
            Users(iam), clients, roles, groups, and cases are all resources.
          </div>

          <div className="flex items-center flex-wrap text-sm">
            <KRadioGroup
              labels={["all", "iam", "role", "group", "client", "case"]}
              checkedIcon={<Check />}
              onChange={(v) => setResourceGroup(v)}
              value={resourceGroup}
              name="effect"
            />
          </div>

          <div className="grid">
            <LazySearch
              zIndex={18}
              viewPortClassName="max-h-52 vertical-scrollbar gap-2"
              className="border bg-gray-50 shadow-sm"
              fetchItems={(q: string) =>
                handleRequest<Record<string, string>[]>({
                  func: axiosGet,
                  args: [
                    insertQueryParams(
                      APIS.authorization.searchResource.replace(
                        "<:resource>",
                        resourceGroup
                      ),
                      { q, except: "resourceaction" }
                    ),
                  ],
                }).then((res) => {
                  if (res.status === "ok" && res.result) {
                    return res.result;
                  }
                  return [];
                })
              }
              childClassName=""
              RenderItem={({ q, item }) => {
                const resourceType = item["entity"] as ResourceType;
                const res_type =
                  resourceGroup === "all" ? resourceType : resourceGroup;
                return (
                  <fieldset className="group text-start text-sm bg-white hover:bg-teal-600 hover:border-teal-600 hover:text-white p-2 duration-300 border shadow-sm mr-2">
                    {resourceGroup === "all" && (
                      <legend className="border text-sm px-2 bg-white group-hover:bg-teal-600 group-hover:border-teal-500 shadow-sm">
                        {resourceType}
                      </legend>
                    )}
                    <div>
                      {Object.entries(item)
                        .filter(([k]) =>
                          resourceGroup === "all" ? k !== "entity" : true
                        )
                        .map(([k, v], index) => (
                          <div className="text-sm" key={index}>
                            <span className="font-semibold">{k}:</span>&nbsp;
                            <span className="break-all">
                              {joinArrays(
                                String(v),
                                String(q),
                                "bg-black text-white rounded px-0.5"
                              )}
                            </span>
                          </div>
                        ))}
                    </div>
                    <div className="flex gap-x-1 gap-y-0.5 flex-wrap">
                      {Object.entries(item)
                        .filter(([k]) =>
                          resourceGroup === "all" ? k !== "entity" : true
                        )
                        .map(([k, v], index) => (
                          <div
                            key={index}
                            className="flex items-center border group-hover:border-teal-500 duration-300"
                          >
                            <span className="px-2">{k}</span>

                            {!resourceStaged(res_type, k, v) ? (
                              <span
                                onClick={() => {
                                  setCreatePolicyFormData((p) => ({
                                    ...p,
                                    resources: [
                                      ...p.resources,
                                      `krn:${res_type}:${k}:${v}`,
                                    ],
                                  }));
                                }}
                                className="px-1 hover:bg-teal-800 border-l group-hover:border-teal-500"
                              >
                                <Add fontSize="small" />
                              </span>
                            ) : (
                              <span className="px-1 text-teal-500 group-hover:text-gray-200">
                                <Check fontSize="small" />
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </fieldset>
                );
              }}
            />
          </div>
          <KValidationErrors errorKey="resources" errors={errors} />
        </div>

        <div className="max-w-[12rem] w-full self-end">
          <LoadingButton
            type="submit"
            fullWidth
            loading={submitting}
            variant="contained"
            sx={{ ...MUI_STYLES.Button, borderRadius: 0 }}
          >
            Submit
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}

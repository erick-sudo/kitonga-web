import { Radio } from "@mui/material";
import { MUI_STYLES } from "../../lib/MUI_STYLES";
import { useState } from "react";
import { CreateAccessPolicyDto, ResourceAction } from "../../lib/definitions";
import useAPI from "../../hooks/useAPI";
import { AlertResponse } from "../../ui/definitions";
import { APIS } from "../../lib/apis";
import { axiosGet, axiosPost } from "../../lib/axiosLib";
import { LoadingButton } from "@mui/lab";
import { Check } from "@mui/icons-material";
import { LazySearch } from "../../ui/Search";
import { insertQueryParams } from "../../lib/utils";
import KRadioGroup from "../../ui/KRadioGroup";

export function BuildNewPolicyForm({
  onNewRecord,
}: {
  onNewRecord: () => void;
}) {
  const [principalGroup, setPrincipalGroup] = useState("All");
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
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const actionStaged = (id: string, name: string) =>
    createPolicyFormData.actions.includes(`${id}#${name}`);

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
    <div className="">
      <h3 className="font-bold">Build new policy</h3>
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
            name="name"
            className="w-full px-2 py-1 text-sm outline-none border shadow-sm focus:border-teal-600 focus:bg-teal-50/50"
          />
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
        </div>

        {/* Actions */}
        <div>
          <label className="text-sm">
            Select actions <span className="text-red-500">*</span>
          </label>
          <div className="grid gap-2">
            <div className="flex flex-wrap gap-x-1 gap-y-1">
              {createPolicyFormData.actions
                .map((a) => a.split("#"))
                .map(([id, name], index) => (
                  <div
                    key={index}
                    className="cursor-pointer border text-xs pl-1.5 rounded-full bg-white flex gap-2 overflow-hidden"
                  >
                    <span>{name}</span>
                    <span
                      onClick={() =>
                        setCreatePolicyFormData((p) => ({
                          ...p,
                          actions: p.actions.filter(
                            (a) => a !== `${id}#${name}`
                          ),
                        }))
                      }
                      className="flex items-center justify-center font-bold w-6 bg-teal-800 text-white hover:bg-teal-600 duration-300"
                    >
                      x
                    </span>
                  </div>
                ))}
            </div>
            <LazySearch
              zIndex={20}
              viewPortClassName="max-h-36 vertical-scrollbar"
              className="border bg-white shadow-sm"
              fetchItems={(q: string) =>
                handleRequest<ResourceAction[]>({
                  func: axiosGet,
                  args: [
                    insertQueryParams(
                      APIS.authorization.resourceActions.search,
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
                        actions: [...p.actions, `${id}#${name}`],
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
        </div>

        {/* Principals */}
        <div>
          <label className="text-sm">
            Select principals <span className="text-red-500">*</span>
          </label>

          <div className="text-sm">Principals are either users, clients, roles or groups</div>

          <div className="flex items-center flex-wrap text-sm">
            <KRadioGroup
              labels={["All", "Users", "Clients", "Roles", "Groups"]}
              checkedIcon={<Check />}
              onChange={(v) => setPrincipalGroup(v)}
              value={principalGroup}
              name="effect"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex flex-wrap gap-x-1 gap-y-1">
              {createPolicyFormData.principals
                .map((a) => a.split("#"))
                .map(([id, name], index) => (
                  <div
                    key={index}
                    className="cursor-pointer border text-xs pl-1.5 rounded-full bg-white flex gap-2 overflow-hidden"
                  >
                    <span>{name}</span>
                    <span
                      onClick={() =>
                        setCreatePolicyFormData((p) => ({
                          ...p,
                          actions: p.actions.filter(
                            (a) => a !== `${id}#${name}`
                          ),
                        }))
                      }
                      className="flex items-center justify-center font-bold w-6 bg-teal-800 text-white hover:bg-teal-600 duration-300"
                    >
                      x
                    </span>
                  </div>
                ))}
            </div>
            <LazySearch
              zIndex={19}
              viewPortClassName="max-h-36 vertical-scrollbar"
              className="border bg-white shadow-sm"
              fetchItems={(q: string) =>
                handleRequest<ResourceAction[]>({
                  func: axiosGet,
                  args: [
                    insertQueryParams(
                      APIS.authorization.resourceActions.search,
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
                        actions: [...p.actions, `${id}#${name}`],
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
        </div>

        <div className="max-w-[12rem] w-full self-end">
          <LoadingButton
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

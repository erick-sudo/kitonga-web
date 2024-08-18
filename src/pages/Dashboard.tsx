import { useQueryClient } from "@tanstack/react-query";
import { TANSTACK_QUERY_KEYS } from "../lib/KEYS";

export function Dashboard() {
  const queryClient = useQueryClient();
  return (
    <div>
      <h3>Dashboard</h3>
      <button
        onClick={() =>
          queryClient.invalidateQueries({
            queryKey: [TANSTACK_QUERY_KEYS.CURRENT_USER],
          })
        }
      >
        logout
      </button>
    </div>
  );
}

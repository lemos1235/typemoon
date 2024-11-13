import useSWR from "swr";
import { getVergeConfig, patchVergeConfig } from "@/services/cmds";

/**
 * Returns the current Verge configuration and two utility functions to
 * mutate it.
 *
 * @returns An object with the following properties:
 *
 * - `verge`: The current Verge configuration.
 * - `mutateVerge`: A function to mutate the Verge configuration.
 * - `patchVerge`: A function to patch the Verge configuration.
 */
export const useVerge = () => {
  const { data: verge, mutate: mutateVerge } = useSWR(
    "getVergeConfig",
    getVergeConfig,
  );

  const patchVerge = async (value: Partial<IVergeConfig>) => {
    await patchVergeConfig(value);
    mutateVerge();
  };

  return {
    verge,
    mutateVerge,
    patchVerge,
  };
};

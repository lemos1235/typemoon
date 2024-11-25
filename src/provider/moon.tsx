import {
  getMoonConfig,
  patchClashConfig,
  patchMoonConfig,
} from "@/services/cmds";
import { globToRegex } from "@/utils/glob";
import React, { createContext, useContext, useEffect, useRef } from "react";
import useSWR from "swr";

interface MoonContextType {
  moon: IMoonConfig | undefined;
  saveProxy: (data: IMoonProxy) => Promise<void>;
  deleteProxy: (proxy: IMoonProxy) => Promise<void>;
  saveProxyGroup: (data: IMoonProxyGroup) => Promise<void>;
  saveGroupProxies: (data: IMoonProxyGroup) => Promise<void>;
  saveGroupAutoRefresh: (data: IMoonProxyGroup) => Promise<void>;
  deleteProxyGroup: (group: IMoonProxyGroup) => Promise<void>;
  saveRule: (rule: IMoonRule) => Promise<void>;
  deleteRule: (rule: IMoonRule) => Promise<void>;
  patchMoonToClash: (data?: IMoonConfig) => Promise<void>;
}

// Context
const MoonContext = createContext<MoonContextType | undefined>(undefined);

// Hook
export const useMoon = (): MoonContextType => {
  const context = useContext(MoonContext);

  if (!context) {
    throw new Error("useMoon must be used within a MoonProvider");
  }

  return context;
};

// Provider
export const MoonProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: moonConfig, mutate: mutateMoonConfig } = useSWR(
    "getMoonConfig",
    getMoonConfig,
  );

  const moonRef = useRef(undefined as IMoonConfig | undefined);

  useEffect(() => {
    moonRef.current = moonConfig;
  }, [moonConfig]);

  const saveProxy = async (data: IMoonProxy) => {
    const proxy = { ...data };
    const oldGroupList = moonRef.current?.proxy_group_list ?? [];
    const groupIndex = oldGroupList.findIndex((g) => g.uid === proxy.group_uid);
    const newGroupList = [...oldGroupList];
    if (groupIndex === -1) {
      const defaultGroup: IMoonProxyGroup = {
        uid: proxy.group_uid || "0",
        name: "本地节点",
        proxy_list: [proxy],
      };
      newGroupList.push(defaultGroup);
    } else {
      const oldGroup = oldGroupList[groupIndex];
      const proxyList = oldGroup.proxy_list ?? [];
      const proxyIndex = proxyList.findIndex((p) => p.uid === proxy.uid);
      const newProxyList = [...proxyList];
      if (proxyIndex === -1) {
        newProxyList.push(proxy);
      } else {
        newProxyList[proxyIndex] = proxy;
      }
      newGroupList[groupIndex] = { ...oldGroup, proxy_list: newProxyList };
    }
    await patchMoon({ proxy_group_list: newGroupList });
  };

  const deleteProxy = async (proxy: IMoonProxy) => {
    const oldGroupList = moonRef.current?.proxy_group_list ?? [];
    const groupIndex = oldGroupList.findIndex((g) => g.uid === proxy.group_uid);
    const newGroupList = [...oldGroupList];
    if (groupIndex !== -1) {
      const oldGroup = oldGroupList[groupIndex];
      const proxyList =
        oldGroup.proxy_list?.filter((p) => p.uid !== proxy.uid) || [];
      if (proxyList.length === 0) {
        newGroupList.splice(groupIndex, 1);
      } else {
        newGroupList[groupIndex] = { ...oldGroup, proxy_list: proxyList };
      }
    }
    await patchMoon({ proxy_group_list: newGroupList });
  };

  const saveProxyGroup = async (data: IMoonProxyGroup) => {
    const group = { ...data };
    const oldGroupList = moonRef.current?.proxy_group_list ?? [];
    const groupIndex = oldGroupList.findIndex((g) => g.uid === group.uid);
    const newGroupList = [...oldGroupList];
    if (groupIndex === -1) {
      newGroupList.push(group);
    } else {
      newGroupList[groupIndex] = group;
    }
    await patchMoon({ proxy_group_list: newGroupList });
  };

  const saveGroupProxies = async (
    data: Pick<IMoonProxyGroup, "uid" | "proxy_list">,
  ) => {
    const group = { ...data };
    const oldGroupList = moonRef.current?.proxy_group_list ?? [];
    const oldGroup = oldGroupList.find((g) => g.uid === group.uid);
    if (oldGroup) {
      const newGroup: IMoonProxyGroup = {
        ...oldGroup,
        proxy_list: group.proxy_list,
      };
      const newGroupList = oldGroupList.map((i) =>
        i.uid === newGroup.uid ? newGroup : i,
      );
      await patchMoon({ proxy_group_list: newGroupList });
    }
  };

  const saveGroupAutoRefresh = async (
    group: Pick<IMoonProxyGroup, "uid" | "auto_refresh">,
  ) => {
    const oldGroupList = moonRef.current?.proxy_group_list ?? [];
    const oldGroup = oldGroupList.find((g) => g.uid === group.uid);
    if (oldGroup) {
      const newGroup: IMoonProxyGroup = {
        ...oldGroup,
        auto_refresh: group.auto_refresh,
      };
      const newGroupList = oldGroupList.map((i) =>
        i.uid === newGroup.uid ? newGroup : i,
      );
      await patchMoon({ proxy_group_list: newGroupList });
    }
  };

  const deleteProxyGroup = async (group: IMoonProxyGroup) => {
    const oldGroupList = moonRef.current?.proxy_group_list ?? [];
    const newGroupList = oldGroupList.filter((g) => g.uid !== group.uid);
    await patchMoon({ proxy_group_list: newGroupList });
  };

  const saveRule = async (rule: IMoonRule) => {
    const oldRuleList = moonRef.current?.rule_list ?? [];
    const ruleIndex = oldRuleList.findIndex((g) => g.uid === rule.uid);
    const newRuleList = [...oldRuleList];
    if (ruleIndex === -1) {
      newRuleList.push(rule);
    } else {
      newRuleList[ruleIndex] = rule;
    }
    await patchMoon({ rule_list: newRuleList });
  };

  const deleteRule = async (rule: IMoonRule) => {
    const oldRuleList = moonRef.current?.rule_list ?? [];
    const newRuleList = oldRuleList.filter((g) => g.uid !== rule.uid);
    await patchMoon({ rule_list: newRuleList });
  };

  const patchMoonToClash = async ({
    proxy_group_list: newProxyGroupList,
    rule_list: newRuleList,
  }: IMoonConfig = {}) => {
    const proxyList =
      (newProxyGroupList ?? moonRef.current?.proxy_group_list)
        ?.reduce(
          (acc, g) => (g.proxy_list ? [...acc, ...g.proxy_list] : acc),
          [] as IMoonProxy[],
        )
        .map((proxy) => ({
          name: proxy.group_uid + ":" + proxy.uid,
          type: proxy.scheme as any,
          server: proxy.host,
          port: proxy.port,
          username: proxy.username,
          password: proxy.password,
        })) ?? [];

    const ruleList = (newRuleList ?? moonRef.current?.rule_list)
      ?.reduce((acc, item) => {
        if (item.process === "MATCH") {
          acc.push(item);
        } else {
          acc.unshift(item);
        }
        return acc;
      }, [] as IMoonRule[])
      ?.map((rule) => {
        const payload = rule.process!;
        let proxy = rule.action!;
        if (payload === "MATCH") {
          return `${payload},${proxy}`;
        }
        const ruleItems: string[] = [];
        payload.split(";").forEach((item) => {
          let type = "PROCESS-NAME";
          if (!isNaN(Number(item))) {
            type = "PID";
          } else if (item.includes("*") || item.includes("?")) {
            item = globToRegex(item);
            if (item.includes("/") || item.includes("\\")) {
              type = "PROCESS-PATH-REGEX";
            } else {
              type = "PROCESS-NAME-REGEX";
            }
          } else if (item.includes("/") || item.includes("\\")) {
            type = "PROCESS-PATH";
          }
          ruleItems.push(`${type},${item}`);
        });
        if (ruleItems.length === 1) {
          const ruleItem = ruleItems.pop()!;
          return `${ruleItem},${proxy}`;
        } else {
          const conditions = ruleItems.map((i) => `(${i})`).join(",");
          return `OR,(${conditions}),${proxy}`;
        }
      });

    await patchClashConfig({
      proxies: proxyList,
      rules: ruleList,
    });
  };

  const patchMoon = async (patch: IMoonConfig) => {
    moonRef.current = { ...moonRef.current, ...patch };
    await patchMoonConfig(patch);
    await mutateMoonConfig();
    patchMoonToClash({ ...patch });
  };

  return (
    <MoonContext.Provider
      value={{
        moon: moonConfig,
        saveProxy,
        deleteProxy,
        saveProxyGroup,
        saveGroupProxies,
        saveGroupAutoRefresh,
        deleteProxyGroup,
        saveRule,
        deleteRule,
        patchMoonToClash,
      }}>
      {children}
    </MoonContext.Provider>
  );
};

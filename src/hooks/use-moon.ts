import {
  getMoonConfig,
  patchClashConfig,
  patchMoonConfig,
} from "@/services/cmds";
import useSWR from "swr";

export const useMoon = () => {
  const { data: moon, mutate: mutateMoon } = useSWR(
    "getMoonConfig",
    getMoonConfig
  );

  const saveProxy = async (data: IMoonProxy) => {
    const proxy = { ...data };
    const oldGroupList = moon?.proxy_group_list ?? [];
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
    await patchMoonConfig({ proxy_group_list: newGroupList });
    await mutateMoon();
    patchMoonToClash({ proxy_group_list: newGroupList });
  };

  const deleteProxy = async (proxy: IMoonProxy) => {
    const oldGroupList = moon?.proxy_group_list ?? [];
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
    await patchMoonConfig({ proxy_group_list: newGroupList });
    await mutateMoon();
    patchMoonToClash({ proxy_group_list: newGroupList });
  };

  const saveProxyGroup = async (data: IMoonProxyGroup) => {
    const group = { ...data };
    const oldGroupList = moon?.proxy_group_list ?? [];
    const groupIndex = oldGroupList.findIndex((g) => g.uid === group.uid);
    const newGroupList = [...oldGroupList];
    if (groupIndex === -1) {
      newGroupList.push(group);
    } else {
      newGroupList[groupIndex] = group;
    }
    await patchMoonConfig({ proxy_group_list: newGroupList });
    await mutateMoon();
    patchMoonToClash({ proxy_group_list: newGroupList });
  };

  const saveGroupProxies = async (data: IMoonProxyGroup) => {
    const group = { ...data };
    const oldGroupList = moon?.proxy_group_list ?? [];
    const oldGroup = oldGroupList.find((g) => g.uid === group.uid);
    if (oldGroup) {
      const newGroup: IMoonProxyGroup = {
        ...oldGroup,
        proxy_list: group.proxy_list,
      };
      const newGroupList = oldGroupList.map((i) =>
        i.uid === newGroup.uid ? newGroup : i
      );
      await patchMoonConfig({ proxy_group_list: newGroupList });
      await mutateMoon();
      patchMoonToClash({ proxy_group_list: newGroupList });
    }
  };

  const deleteProxyGroup = async (group: IMoonProxyGroup) => {
    const oldGroupList = moon?.proxy_group_list ?? [];
    const newGroupList = oldGroupList.filter((g) => g.uid !== group.uid);
    await patchMoonConfig({ proxy_group_list: newGroupList });
    await mutateMoon();
    patchMoonToClash({ proxy_group_list: newGroupList });
  };

  const saveRule = async (rule: IMoonRule) => {
    const oldRuleList = moon?.rule_list ?? [];
    const ruleIndex = oldRuleList.findIndex((g) => g.uid === rule.uid);
    const newRuleList = [...oldRuleList];
    if (ruleIndex === -1) {
      newRuleList.push(rule);
    } else {
      newRuleList[ruleIndex] = rule;
    }
    await patchMoonConfig({ rule_list: newRuleList });
    await mutateMoon();
    patchMoonToClash({ rule_list: newRuleList });
  };

  const deleteRule = async (rule: IMoonRule) => {
    const oldRuleList = moon?.rule_list ?? [];
    const newRuleList = oldRuleList.filter((g) => g.uid !== rule.uid);
    await patchMoonConfig({ ...moon, rule_list: newRuleList });
    await mutateMoon();
    patchMoonToClash({ rule_list: newRuleList });
  };

  const patchMoonToClash = async ({
    proxy_group_list: newProxyGroupList,
    rule_list: newRuleList,
  }: IMoonConfig = {}) => {
    const proxyList: IProxyConfig[] =
      (newProxyGroupList ?? moon?.proxy_group_list)
        ?.reduce(
          (acc, g) => (g.proxy_list ? [...acc, ...g.proxy_list] : acc),
          [] as IMoonProxy[]
        )
        .map((proxy) => ({
          name: proxy.uid,
          type: proxy.scheme as any,
          server: proxy.host,
          port: proxy.port,
          username: proxy.username,
          password: proxy.password,
        })) ?? [];
    const ruleList = (newRuleList ?? moon?.rule_list)
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
        let type = "PROCESS-NAME";
        if (!isNaN(Number(payload))) {
          type = "PROCESS-PID";
        } else if (payload.includes(".*")) {
          if (payload.includes("/") || payload.includes("\\")) {
            type = "PROCESS-PATH-REGEX";
          } else {
            type = "PROCESS-NAME-REGEX";
          }
        } else if (payload.includes("/") || payload.includes("\\")) {
          type = "PROCESS-PATH";
        }
        return `${type},${payload},${proxy}`;
      });
    await patchClashConfig({
      proxies: proxyList,
      rules: ruleList,
    });
  };

  return {
    moon,
    saveProxy,
    deleteProxy,
    saveProxyGroup,
    saveGroupProxies,
    deleteProxyGroup,
    saveRule,
    deleteRule,
    patchMoonToClash,
  };
};

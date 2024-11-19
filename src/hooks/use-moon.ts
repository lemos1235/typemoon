import { getMoonConfig, patchMoonConfig } from "@/services/cmds";
import useSWR from "swr";

export const useMoon = () => {
  const { data: moon, mutate: mutateMoon } = useSWR(
    "getMoonConfig",
    getMoonConfig,
  );

  const saveProxy = async (proxy: IMoonProxy) => {
    const oldGroupList = moon?.proxy_group_list ?? []; 
    const groupIndex = oldGroupList.findIndex((g) => g.uid === proxy.group_uid);
    const newGroupList = [...oldGroupList];
    if (groupIndex === -1) {
      const defaultGroup: IMoonProxyGroup = {
        uid: proxy.group_uid || "0",
        name: "local",
        proxy_list: [proxy],
      };
      newGroupList.push(defaultGroup);
    } else {
      const oldGroup = oldGroupList[groupIndex];
      const proxyList = oldGroup.proxy_list ?? [];
      const proxyIndex = proxyList.findIndex(p => p.uid === proxy.uid);
      const newProxyList = [...proxyList];
      if (proxyIndex === -1) {
        newProxyList.push(proxy);
      } else {
        newProxyList[proxyIndex] = proxy;
      }
      newGroupList[groupIndex] = { ...oldGroup, proxy_list: newProxyList };
    }
    await patchMoonConfig({ proxy_group_list: newGroupList });
    mutateMoon();
  };

  const deleteProxy = async (proxy: IMoonProxy) => {
    const oldGroupList = moon?.proxy_group_list ?? []; 
    const groupIndex = oldGroupList.findIndex((g) => g.uid === proxy.group_uid);
    const newGroupList = [...oldGroupList];
    if (groupIndex !== -1) {
      const oldGroup = oldGroupList[groupIndex];
      const proxyList = oldGroup.proxy_list
        ? oldGroup.proxy_list.filter((p) => p.uid !== proxy.uid)
        : [];
      newGroupList[groupIndex] = { ...oldGroup, proxy_list: proxyList };
    }
    await patchMoonConfig({ proxy_group_list: newGroupList });
    mutateMoon();
  };

  const saveProxyGroup = async (group: IMoonProxyGroup) => {
    const oldGroupList = moon?.proxy_group_list ?? [];
    const groupIndex = oldGroupList.findIndex((g) => g.uid === group.uid);
    const newGroupList = [...oldGroupList];
    if (groupIndex === -1) {
      newGroupList.push(group);
    } else {
      newGroupList[groupIndex] = group;
    }
    await patchMoonConfig({ proxy_group_list: newGroupList });
    mutateMoon();
  };

  const deleteProxyGroup = async (group: IMoonProxyGroup) => {
    const oldGroupList = moon?.proxy_group_list ?? [];
    const newGroupList = oldGroupList.filter((g) => g.uid !== group.uid);
    await patchMoonConfig({ proxy_group_list: newGroupList });
    mutateMoon();
  };

  const saveRule = async (rule: IMoonRule) => {
    const oldRuleList = moon?.rule_list ?? [];
    console.log('oldRuleList', oldRuleList, rule);
    const ruleIndex = oldRuleList.findIndex((g) => g.uid === rule.uid);
    const newRuleList = [...oldRuleList];
    if (ruleIndex === -1) {
      newRuleList.push(rule);
    } else {
      newRuleList[ruleIndex] = rule;
    }
    await patchMoonConfig({ rule_list: newRuleList });
    mutateMoon();
  };

  const deleteRule = async (rule: IMoonRule) => {
    const oldRuleList = moon?.rule_list ?? [];
    const newRuleList = oldRuleList.filter((g) => g.uid !== rule.uid);
    await patchMoonConfig({ ...moon, rule_list: newRuleList });
    mutateMoon();
  };

  return {
    moon,
    saveProxy,
    deleteProxy,
    saveProxyGroup,
    deleteProxyGroup,
    saveRule,
    deleteRule
  };
}

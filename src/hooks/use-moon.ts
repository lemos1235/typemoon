import { getMoonConfig, patchMoonConfig } from "@/services/cmds";
import useSWR from "swr";

export const useMoon = () => {
  const { data: moon, mutate: mutateMoon } = useSWR(
    "getMoonConfig",
    getMoonConfig,
  );

  const saveProxy = async (proxy: IMoonProxy) => {
    const { proxy_group_list: oldGroupList = [] } = { ...moon };
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
      const proxyList = oldGroup.proxy_list || [];
      const proxyIndex = proxyList.findIndex(p => p.uid === proxy.uid);
      const newProxyList = [...proxyList];
      if (proxyIndex === -1) {
        newProxyList.push(proxy);
      } else {
        newProxyList[proxyIndex] = proxy;
      }
      newGroupList[groupIndex] = { ...oldGroup, proxy_list: newProxyList };
    }
    await patchMoonConfig({ ...moon, proxy_group_list: newGroupList });
    mutateMoon();
  };

  const deleteProxy = async (proxy: IMoonProxy) => {
    const { proxy_group_list: oldGroupList = [] } = { ...moon };
    const groupIndex = oldGroupList.findIndex((g) => g.uid === proxy.group_uid);
    const newGroupList = [...oldGroupList];
    if (groupIndex !== -1) {
      const oldGroup = oldGroupList[groupIndex];
      const proxyList = oldGroup.proxy_list
        ? oldGroup.proxy_list.filter((p) => p.uid !== proxy.uid)
        : [];
      newGroupList[groupIndex] = { ...oldGroup, proxy_list: proxyList };
    }
    await patchMoonConfig({ ...moon, proxy_group_list: newGroupList });
    mutateMoon();
  };

  const saveProxyGroup = async (group: IMoonProxyGroup) => {
    const { proxy_group_list: oldGroupList = [] } = { ...moon };
    const groupIndex = oldGroupList.findIndex((g) => g.uid === group.uid);
    const newGroupList = [...oldGroupList];
    if (groupIndex === -1) {
      newGroupList.push(group);
    } else {
      newGroupList[groupIndex] = group;
    }
    await patchMoonConfig({ ...moon, proxy_group_list: newGroupList });
    mutateMoon();
  };

  const deleteProxyGroup = async (group: IMoonProxyGroup) => {
    const { proxy_group_list: oldGroupList = [] } = { ...moon };
    const newGroupList = oldGroupList.filter((g) => g.uid !== group.uid);
    await patchMoonConfig({ ...moon, proxy_group_list: newGroupList });
    mutateMoon();
  };

  return {
    moon,
    saveProxy,
    deleteProxy,
    saveProxyGroup,
    deleteProxyGroup,
  };
}
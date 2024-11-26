import { runAtLeast } from "@/utils/async";
import axios, { AxiosInstance } from "axios";

let axiosIns2: AxiosInstance = null!;

/// initialize some information
/// enable force update axiosIns
export const getAxios = async (force: boolean = false) => {
  if (axiosIns2 && !force) return axiosIns2;

  axiosIns2 = axios.create({
    timeout: 15000,
  });
  axiosIns2.interceptors.response.use((r) => r.data);
  return axiosIns2;
};

export const getSubscription = async (url: string) => {
  const instance = await getAxios();
  return instance.get(url) as Promise<ISubroupInfo>;
};

export const refreshSubscription = async (url: string) => {
  try {
    const sub: ISubroupInfo = await runAtLeast(
      () => getSubscription(url),
      1000,
    );
    if (!sub) {
      throw new Error("response is null");
    }
    console.log("refreshSubscription date", new Date());
    const newData = {} as IMoonProxyGroup;
    newData.uid = sub.id;
    newData.proxy_list = sub.proxyList.map((p) => {
      return {
        uid: p.id,
        group_uid: p.groupId,
        name: p.host?.split(".").pop() || p.id,
        label: p.label || "" + p.id,
        scheme: p.scheme === "socks" ? "socks5" : p.scheme,
        host: p.host,
        port: p.port,
        username: p.username,
        password: p.password,
      };
    });
    return newData;
  } catch (error) {
    console.log("更新订阅失败", error);
    throw error;
  }
};

export const saveSubscription = async (data: IMoonProxyGroup) => {
  try {
    const newData = { ...data };
    const sub: ISubroupInfo = await runAtLeast(
      () => getSubscription(data.url!),
      1000,
    );
    if (!sub) {
      throw new Error("response is null");
    }
    console.log("saveSubscription date", new Date());
    newData.uid = sub.id;
    newData.name = data.remark?.trim() || sub.groupName;
    newData.interval = data.interval ?? sub.refreshInterval;
    newData.auto_refresh = newData.interval ? newData.interval > 0 : false;
    newData.proxy_list = sub.proxyList.map((p) => {
      return {
        uid: p.id,
        group_uid: p.groupId,
        name: p.host?.split(".").pop() || p.id,
        label: p.label || "" + p.id,
        scheme: p.scheme === "socks" ? "socks5" : p.scheme,
        host: p.host,
        port: p.port,
        username: p.username,
        password: p.password,
      };
    });
    return newData;
  } catch (error) {
    console.log("保存订阅失败", error);
    throw error;
  }
};

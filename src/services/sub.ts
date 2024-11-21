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

export const refreshSubscription = async (data: IMoonProxyGroup) => {
  const newData = { ...data };
  const sub: ISubroupInfo = await getSubscription(data.url!);
  console.log("sub response:", sub);
  newData.uid = sub.id;
  newData.name = data.remark?.trim() || sub.groupName;
  newData.interval = data.interval || sub.refreshInterval;
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
};

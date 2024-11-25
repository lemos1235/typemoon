import { BasePage } from "@/components/base";
import { LocalProxies } from "@/components/proxies/proxy-group";

const ProxiesPage = () => {
  return (
    <BasePage full contentStyle={{ height: "100%" }}>
      <LocalProxies />
    </BasePage>
  );
};

export default ProxiesPage;

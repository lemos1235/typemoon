import { BaseDialog } from "@/components/base/base-dialog";
import { useMoon } from "@/provider/moon";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useLockFn } from "ahooks";
import { nanoid } from "nanoid";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {}

export interface ProxyEditDialogRef {
  create: () => void;
  edit: (item: IMoonProxy) => void;
}

export const ProxyEditDialog = forwardRef<ProxyEditDialogRef, Props>(
  (props, ref) => {
    const [open, setOpen] = useState(false);
    const [openType, setOpenType] = useState<"new" | "edit">("new");
    const { moon, saveProxy } = useMoon();

    const localProxyList =
      moon?.proxy_group_list?.find((g) => g.uid === "0")?.proxy_list ?? [];

    const {
      control,
      watch,
      register,
      formState: { errors },
      ...formIns
    } = useForm<IMoonProxy>({
      defaultValues: {
        uid: "",
        group_uid: "",
        name: "",
        scheme: "",
        host: "",
        port: undefined,
        username: "",
        password: "",
        label: "",
      },
    });

    useImperativeHandle(ref, () => ({
      create: () => {
        setOpenType("new");
        setOpen(true);
      },
      edit: (item) => {
        if (item) {
          Object.entries(item).forEach(([key, value]) => {
            formIns.setValue(key as any, value);
          });
        }
        setOpenType("edit");
        setOpen(true);
      },
    }));

    const handleOk = useLockFn(
      formIns.handleSubmit(async (form) => {
        const data = { ...form };
        if (openType === "new") {
          data.uid = nanoid();
          data.group_uid = "0";
          const lastProxy = localProxyList[localProxyList.length - 1];
          data.label = "" + (parseInt(lastProxy?.label || "0") + 1);
        }
        data.port = Number(data.port);
        data.name = data.host?.split(".").pop() || data.uid;
        await saveProxy(data);
        setOpen(false);
        setTimeout(() => formIns.reset(), 500);
      }),
    );

    const handleClose = () => {
      setOpen(false);
      setTimeout(() => formIns.reset(), 500);
    };

    return (
      <BaseDialog
        open={open}
        contentSx={{ width: 375, pb: 0, maxHeight: "80%" }}
        okBtn={"保存"}
        cancelBtn={"取消"}
        onClose={handleClose}
        onCancel={handleClose}
        onOk={handleOk}>
        <Controller
          name="scheme"
          control={control}
          rules={{
            required: "协议是必选项",
          }}
          render={({ field }) => (
            <FormControl error={!!errors.scheme}>
              <InputLabel>协议</InputLabel>
              <Select {...field} label="协议">
                <MenuItem value={"http"}>HTTP</MenuItem>
                <MenuItem value={"socks5"}>SOCKS5</MenuItem>
              </Select>
              <FormHelperText>{errors.scheme?.message}</FormHelperText>
            </FormControl>
          )}
        />
        <Controller
          name="host"
          control={control}
          rules={{
            required: "地址是必填项",
            pattern: {
              value:
                /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/,
              message: "请输入有效的IP地址",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label={"地址"}
              placeholder="必填，请输入节点的IP地址"
              error={!!errors.host}
              helperText={errors.host?.message}
            />
          )}
        />
        <Controller
          name="port"
          control={control}
          rules={{
            required: "端口是必填项",
            min: {
              value: 1,
              message: "端口范围为1-65535",
            },
            max: {
              value: 65535,
              message: "端口范围为1-65535",
            },
          }}
          render={({ field }) => (
            <TextField
              type="number"
              {...field}
              label={"端口"}
              placeholder="必填，1-65535"
              error={!!errors.port}
              helperText={errors.port?.message}
            />
          )}
        />
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField {...field} label={"用户名"} placeholder="选填" />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField {...field} label={"密码"} placeholder="选填" />
          )}
        />
      </BaseDialog>
    );
  },
);

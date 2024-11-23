import { useMoon } from "@/hooks/use-moon";
import { saveSubscription } from "@/services/sub";
import { TextField } from "@mui/material";
import { useLockFn } from "ahooks";
import { nanoid } from "nanoid";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BaseDialog, Notice } from "../base";

interface Props {}

export interface ProxyGroupEditDialogRef {
  create: () => void;
  edit: (item: IMoonProxyGroup) => void;
}

export const ProxyGroupEditDialog = forwardRef<ProxyGroupEditDialogRef, Props>(
  (props, ref) => {
    const [open, setOpen] = useState(false);
    const { saveProxyGroup } = useMoon();

    const {
      control,
      watch,
      register,
      formState: { errors },
      ...formIns
    } = useForm<IMoonProxyGroup>({
      defaultValues: {
        uid: "",
        name: "",
        url: "",
        interval: undefined,
        remark: "",
        proxy_list: [],
      },
    });

    useImperativeHandle(ref, () => ({
      create: () => {
        setOpen(true);
      },
      edit: (item) => {
        if (item) {
          Object.entries(item).forEach(([key, value]) => {
            formIns.setValue(key as any, value);
          });
        }
        setOpen(true);
      },
    }));

    const handleOk = useLockFn(
      formIns.handleSubmit(async (form) => {
        let data = { ...form };
        if (!data.uid) {
          data.uid = nanoid();
        }
        data.url = data.url?.trim();
        data.interval = isNaN(parseInt(data.interval as any))
          ? undefined
          : Number(data.interval);
        // get node list from url
        if (!data.url) {
          data.name = data.remark?.trim();
          data.proxy_list = [];
        } else {
          try {
            const subData = await saveSubscription(data);
            await saveProxyGroup(subData);
            setOpen(false);
            setTimeout(() => formIns.reset(), 500);
          } catch (err: any) {
            console.error(err);
            Notice.error("获取订阅失败");
          }
        }
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
        onOk={handleOk}
      >
        <Controller
          name="url"
          control={control}
          rules={{
            required: "订阅地址是必填项",
            pattern: {
              value: /^(https?:\/\/).+$/,
              message: "订阅地址必须以 http:// 或 https:// 开头",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label={"订阅地址"}
              placeholder="请输入订阅地址"
              error={!!errors.url}
              helperText={errors.url?.message}
            />
          )}
        />
        <Controller
          name="interval"
          control={control}
          rules={{
            min: {
              value: 0,
              message: "自动刷新间隔为0-200秒",
            },
            max: {
              value: 200,
              message: "自动刷新间隔为0-200秒",
            },
          }}
          render={({ field }) => (
            <TextField
              type="number"
              {...field}
              label={"自动刷新"}
              placeholder="选填，单位秒；值为 0 不自动刷新"
              error={!!errors.interval}
              helperText={errors.interval?.message}
            />
          )}
        />
        <Controller
          name="remark"
          control={control}
          rules={{
            maxLength: {
              value: 20,
              message: "长度不超过20字",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label={"备注"}
              placeholder="选填"
              error={!!errors.remark}
              helperText={errors.remark?.message}
            />
          )}
        />
      </BaseDialog>
    );
  },
);

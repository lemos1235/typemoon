import { Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText, TextField } from '@mui/material'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Controller, useForm } from "react-hook-form";
import { BaseDialog } from '@/components/base/base-dialog';
import { useLockFn } from "ahooks";
import { useMoon } from '@/hooks/use-moon';
import { nanoid } from "nanoid";

interface Props {

}

export interface ProxyEditDialogRef {
  create: () => void;
  edit: (item: IMoonProxy) => void;
}

export const ProxyEditDialog = forwardRef<ProxyEditDialogRef, Props>((props, ref) => {
  const [open, setOpen] = useState(false);
  const [openType, setOpenType] = useState<"new" | "edit">("new");
  const { saveProxy } = useMoon();

  const { control, watch, register, ...formIns } = useForm<IMoonProxy>({
    defaultValues: {
      uid: "",
      group_uid: "",
      name: "",
      scheme: "socks",
      host: "",
      port: undefined,
      username: "",
      password: "",
      remark: "",
    },
  });

  useImperativeHandle(ref, () => ({
    create: () => {
      console.log('create');
      setOpenType("new");
      setOpen(true);
    },
    edit: item => {
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
    formIns.handleSubmit(async form => {
      const data = { ...form };
      if (openType === "new") {
        data.uid = nanoid();
        data.group_uid = "0";
        data.name = data.host?.split(".").pop() || "-";
      }
      data.port = Number(data.port);
      await saveProxy(data);
      setOpen(false);
      setTimeout(() => formIns.reset(), 500);
    }),
  );

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => formIns.reset(), 500);
  };

  const text = {
    fullWidth: true,
    size: "small",
    margin: "normal",
    variant: "outlined",
    autoComplete: "off",
    autoCorrect: "off",
    autoCaptialize: "off",
    spellCheck: false,
  } as const;

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
        name="host"
        control={control}
        render={({ field }) => (
          <TextField {...text} {...field} label={"地址"} placeholder='必填，请输入节点的IP地址' />
        )}
      />
      <Controller
        name="port"
        control={control}
        render={({ field }) => (
          <TextField {...text} type="number" {...field} label={"端口"} placeholder='必填，1-65535' />
        )}
      />
      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <TextField {...text} {...field} label={"用户名"} placeholder='选填' />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField {...text} {...field} label={"密码"} placeholder='选填' />
        )}
      />
    </BaseDialog>
  )
});

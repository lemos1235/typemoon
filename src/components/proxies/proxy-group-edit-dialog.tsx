import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { BaseDialog } from '../base';
import { useLockFn } from 'ahooks';
import { Controller, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { useMoon } from '@/hooks/use-moon';
import { nanoid } from 'nanoid';

interface Props {

}

export interface ProxyGroupEditDialogRef {
  create: () => void;
  edit: (item: IMoonProxyGroup) => void;
}

export const ProxyGroupEditDialog = forwardRef<ProxyGroupEditDialogRef, Props>((props, ref) => {
  const [open, setOpen] = useState(false);
  const { saveProxyGroup } = useMoon();

  const { control, watch, register, formState: { errors }, ...formIns } = useForm<IMoonProxyGroup>({
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
    edit: item => {
      if (item) {
        Object.entries(item).forEach(([key, value]) => {
          formIns.setValue(key as any, value);
        });
      }
      setOpen(true);
    },
  }));

  const handleOk = useLockFn(
    formIns.handleSubmit(async form => {
      const data = { ...form };
      if (!data.uid) {
        data.uid = nanoid();
      }
      data.url = data.url?.trim();
      data.interval = Number(data.interval);
      //TODO get node list from url
      data.proxy_list = [];
      await saveProxyGroup(data);
      setOpen(false);
      setTimeout(() => formIns.reset(), 500);
    }),
  );

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => formIns.reset(), 500);
  };

  return <BaseDialog
    open={open}
    contentSx={{ width: 375, pb: 0, maxHeight: "80%" }}
    okBtn={"保存"}
    cancelBtn={"取消"}
    onClose={handleClose}
    onCancel={handleClose}
    onOk={handleOk}>
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
          <TextField {...field} label={"订阅地址"} placeholder='请输入订阅地址'
            error={!!errors.url} helperText={errors.url?.message} />
        )}
      />
      <Controller
        name="interval"
        control={control}
        rules={{
          min: {
            value: 1,
            message: "自动刷新间隔为1-200秒",
          },
          max: {
            value: 200,
            message: "自动刷新间隔为1-200秒",
          },
        }}
        render={({ field }) => (
          <TextField type="number" {...field} label={"自动刷新"} placeholder='选填，单位秒'
            error={!!errors.interval} helperText={errors.interval?.message} />
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
          <TextField {...field} label={"备注"} placeholder='选填'
          error={!!errors.remark} helperText={errors.remark?.message} />
        )}
      />
  </BaseDialog>
});
import { useMoon } from "@/hooks/use-moon";
import { useLockFn } from "ahooks";
import { nanoid } from "nanoid";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BaseDialog } from "../base";
import { FormControl, InputLabel, ListSubheader, MenuItem, Select, TextField } from "@mui/material";

interface Props {

}

export interface RuleEditDialogRef {
  create: () => void;
  edit: (item: IMoonRule) => void;
}

export const RuleEditDialog = forwardRef<RuleEditDialogRef, Props>((props, ref) => {
  const [open, setOpen] = useState(false);
  const [openType, setOpenType] = useState<"new" | "edit">("new");
  const { moon, saveRule } = useMoon();

  const localProxyList = moon?.proxy_group_list?.find(g => g.uid === "0")?.proxy_list ?? [];
  const subscriptionProxyList = moon?.proxy_group_list?.filter(g => g.uid !== "0")
    ?.reduce((acc, g) => g.proxy_list ? [...acc, ...g.proxy_list] : acc, [] as IMoonProxy[]) ?? [];

  const { control, watch, register, formState: { errors }, ...formIns } = useForm<IMoonRule>({
    defaultValues: {
      uid: "",
      name: "",
      process: "",
      action: "",
      enabled: true,
    },
  });

  useImperativeHandle(ref, () => ({
    create: () => {
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
      }
      data.process = data.process?.trim();
      await saveRule(data);
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
        name="name"
        control={control}
        rules={{
          required: "名称是必填项",
        }}
        render={({ field }) => (
          <TextField {...field} label={"名称"} placeholder='请输入规则的名称'
            error={!!errors.name} helperText={errors.name?.message} />
        )}
      />
      <Controller
        name="process"
        control={control}
        rules={{
          required: "程序是必填项",
        }}
        render={({ field }) => (
          <TextField {...field} label={"程序"} placeholder='可输入程序名称或进程ID'
            error={!!errors.process} helperText={errors.process?.message} />
        )}
      />
      <Controller
        name="action"
        control={control}
        rules={{
          required: "操作是必选项",
        }}
        render={({ field }) => (
          <FormControl>
            <InputLabel>操作</InputLabel>
            <Select  {...field} label="操作" placeholder="请选择操作">
              <ListSubheader>通用</ListSubheader>
              <MenuItem value={"DIRECT"}>直连</MenuItem>
              <MenuItem value={"REJECT"}>拒绝</MenuItem>
              {
                localProxyList.length > 0 && <ListSubheader>本地节点</ListSubheader>
              }
              {
                localProxyList.map((p) =>
                  <MenuItem key={p.name} value={p.uid}>{p.name}</MenuItem>
                )
              }
              {
                subscriptionProxyList.length > 0 && <ListSubheader>订阅节点</ListSubheader>
              }
              {
                subscriptionProxyList.map((p) =>
                  <MenuItem key={p.name} value={p.uid}>{p.name}</MenuItem>
                )
              }
            </Select>
          </FormControl>
        )}
      />
    </BaseDialog>
  )
});

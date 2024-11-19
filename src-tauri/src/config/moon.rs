use crate::utils::{dirs, help};
use anyhow::Result;
use serde::{Deserialize, Serialize};

/// ### `moon.yaml` schema
#[derive(Default, Debug, Clone, Deserialize, Serialize)]
pub struct IMoon {
    pub proxy_group_list: Option<Vec<IProxyGroup>>,
    pub rule_list: Option<Vec<IRule>>,
}

#[derive(Default, Debug, Clone, Deserialize, Serialize)]
pub struct IProxyGroup {
    pub uid: Option<String>,
    pub name: Option<String>,
    pub url: Option<String>,
    pub interval: Option<u64>,
    pub remark: Option<String>,
    pub proxy_list: Option<Vec<IProxy>>,
}

#[derive(Default, Debug, Clone, Deserialize, Serialize)]
pub struct IProxy {
    pub uid: Option<String>,
    pub group_uid: Option<String>,
    pub name: Option<String>,
    pub scheme: Option<String>,
    pub host: Option<String>,
    pub port: Option<u16>,
    pub username: Option<String>,
    pub password: Option<String>,
    pub label: Option<String>,
}

#[derive(Default, Debug, Clone, Deserialize, Serialize)]
pub struct IRule {
    pub uid: Option<String>,
    pub name: Option<String>,
    pub process: Option<String>,
    pub action: Option<String>,
    pub enabled: Option<bool>,
}

impl IMoon {
    pub fn new() -> Self {
        match dirs::moon_path().and_then(|path| help::read_yaml::<IMoon>(&path)) {
            Ok(config) => config,
            Err(err) => {
                log::error!(target: "app", "{err}");
                Self::template()
            }
        }
    }

    pub fn template() -> Self {
        Self {
            proxy_group_list: Some(Vec::new()),
            ..Self::default()
        }
    }

    /// Save IMoon Config
    pub fn save_file(&self) -> Result<()> {
        help::save_yaml(&dirs::moon_path()?, &self, Some("# Moon Config"))
    }

    /// patch moon config
    /// only save to file
    pub fn patch_config(&mut self, patch: IMoon) {
        macro_rules! patch {
            ($key: tt) => {
                if patch.$key.is_some() {
                    self.$key = patch.$key;
                }
            };
        }

        patch!(proxy_group_list);
        patch!(rule_list);
    }
}

#![allow(unused)]

use crate::{
    cmds,
    config::Config,
    feat, t,
    utils::{
        dirs,
        resolve::{self, VERSION},
    },
};
use anyhow::Result;
use tauri::AppHandle;
use tauri::{
    menu::CheckMenuItem,
    tray::{MouseButton, MouseButtonState, TrayIconEvent, TrayIconId},
};
use tauri::{
    menu::{MenuEvent, MenuItem, PredefinedMenuItem, Submenu},
    Wry,
};

use super::handle;
pub struct Tray {}

impl Tray {
    pub fn create_systray() -> Result<()> {
        let app_handle = handle::Handle::global().app_handle().unwrap();
        let tray_incon_id = TrayIconId::new("main");
        let tray = app_handle.tray_by_id(&tray_incon_id).unwrap();

        tray.on_tray_icon_event(|_, event| {
            let tray_event = { Config::verge().latest().tray_event.clone() };
            let tray_event: String = tray_event.unwrap_or("main_window".into());

            #[cfg(target_os = "macos")]
            if let TrayIconEvent::Click {
                button: MouseButton::Right,
                button_state: MouseButtonState::Down,
                ..
            } = event
            {
                match tray_event.as_str() {
                    "system_proxy" => feat::toggle_system_proxy(),
                    "tun_mode" => feat::toggle_tun_mode(),
                    "main_window" => feat::open_dashboard(),
                    _ => {}
                }
            }

            #[cfg(not(target_os = "macos"))]
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Down,
                ..
            } = event
            {
                match tray_event.as_str() {
                    "system_proxy" => feat::toggle_system_proxy(),
                    "tun_mode" => feat::toggle_tun_mode(),
                    "main_window" => feat::open_dashboard(),
                    _ => {}
                }
            }
        });
        tray.on_menu_event(on_menu_event);
        Ok(())
    }

    pub fn update_part() -> Result<()> {
        let app_handle = handle::Handle::global().app_handle().unwrap();
        let use_zh = { Config::verge().latest().language == Some("zh".into()) };
        let version = VERSION.get().unwrap();
        let mode = {
            Config::clash()
                .latest()
                .0
                .get("mode")
                .map(|val| val.as_str().unwrap_or("rule"))
                .unwrap_or("rule")
                .to_owned()
        };

        let verge = Config::verge().latest().clone();
        let system_proxy = verge.enable_system_proxy.as_ref().unwrap_or(&false);
        let tun_mode = verge.enable_tun_mode.as_ref().unwrap_or(&false);

        let tray = app_handle.tray_by_id("main").unwrap();

        let _ = tray.set_menu(Some(create_tray_menu(
            &app_handle,
            Some(mode.as_str()),
            *system_proxy,
            *tun_mode,
        )?));

        Ok(())
    }
}

fn create_tray_menu(
    app_handle: &AppHandle,
    mode: Option<&str>,
    system_proxy_enabled: bool,
    tun_mode_enabled: bool,
) -> Result<tauri::menu::Menu<Wry>> {
    let mode = mode.unwrap_or("");
    let use_zh = { Config::verge().latest().language == Some("zh".into()) };
    let version = VERSION.get().unwrap();

    let open_window = &MenuItem::with_id(
        app_handle,
        "open_window",
        t!("Dashboard", "打开面板", use_zh),
        true,
        None::<&str>,
    )
    .unwrap();

    let open_app_dir = &MenuItem::with_id(
        app_handle,
        "open_app_dir",
        t!("Conf Dir", "打开目录", use_zh),
        true,
        None::<&str>,
    )
    .unwrap();

    let restart_clash = &MenuItem::with_id(
        app_handle,
        "restart_clash",
        t!("Restart Clash Core", "重启内核", use_zh),
        true,
        None::<&str>,
    )
    .unwrap();

    let restart_app = &MenuItem::with_id(
        app_handle,
        "restart_app",
        t!("Restart App", "重启应用", use_zh),
        true,
        None::<&str>,
    )
    .unwrap();

    let app_version = &MenuItem::with_id(
        app_handle,
        "app_version",
        // format!("Version {version}"),
        t!(
            format!("Version {version}").to_owned(),
            format!("版本 {version}").to_owned(),
            use_zh
        ),
        true,
        None::<&str>,
    )
    .unwrap();

    let more = &Submenu::with_id_and_items(
        app_handle,
        "more",
        t!("More", "更多", use_zh),
        true,
        &[restart_clash, restart_app, app_version],
    )
    .unwrap();

    let quit = &MenuItem::with_id(
        app_handle,
        "quit",
        t!("Quit", "退出", use_zh),
        true,
        None::<&str>,
    )
    .unwrap();

    let separator = &PredefinedMenuItem::separator(app_handle).unwrap();

    let menu = tauri::menu::MenuBuilder::new(app_handle)
        .items(&[open_window, separator, open_app_dir, more, separator, quit])
        .build()
        .unwrap();
    Ok(menu)
}

fn on_menu_event(_: &AppHandle, event: MenuEvent) {
    match event.id.as_ref() {
        mode @ ("rule_mode" | "global_mode" | "direct_mode") => {
            let mode = &mode[0..mode.len() - 5];
            println!("change mode to: {}", mode);
            feat::change_clash_mode(mode.into());
        }
        "open_window" => feat::open_dashboard(),
        "system_proxy" => feat::toggle_system_proxy(),
        "tun_mode" => feat::toggle_tun_mode(),
        "copy_env" => feat::copy_clash_env(),
        "open_app_dir" => crate::log_err!(cmds::open_app_dir()),
        "open_core_dir" => crate::log_err!(cmds::open_core_dir()),
        "open_logs_dir" => crate::log_err!(cmds::open_logs_dir()),
        "restart_clash" => feat::restart_clash_core(),
        "restart_app" => feat::restart_app(),
        "quit" => {
            println!("quit");
            feat::quit(Some(0));
        }
        _ => {}
    }
}

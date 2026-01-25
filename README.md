# Bandito

NEWS: a new gtk4 frontend is here https://github.com/sigmaSd/bandito-gtk

A frontend for [eltrafico](https://github.com/sigmaSd/Eltrafico)

An AppImage is automatically built with each commit via GitHub CI. The build
script is located at `scripts/appImage.ts`

![Bandito Interface](https://user-images.githubusercontent.com/22427111/187526633-de317357-ce9f-4314-b721-27fa62e0e9ce.png)

### Demo

[Watch Demo Video](https://github.com/user-attachments/assets/bc040724-97b7-4372-8a00-702bb86778e6)

### Usage

Basic command structure:

```
MONITOR=${Monitor} TC=${pathToEltraficoTc} deno run -A --unstable main.ts ${NetInterface}
```

Example usage:

```
MONITOR=bandwhich TC=/dev/rust/cargo_target_dir/debug/tc deno run -A --unstable main.ts wlan0
```

Note: The `MONITOR` variable is optional. Without it, Bandito functions but
won't display live process network usage.

## Notes and Runtime Dependencies

Current Testing Environment:

- Tested on Fedora 40

Functionality:

- Utilizes 'tc' for network traffic shaping

Caution: As with any network-altering software, bugs may occur. In case of
issues, a system reboot will reset all values.

**Runtime Dependencies:**

These dependencies should be integrated into the AppImage in future updates. For
now, they are required:

- libwebgtkkit-4.0
- (Additional dependencies may be required)

## FAQ

- nvidia drivers + waylmand might not work with webview, you can try
  `__NV_DISABLE_EXPLICIT_SYNC=1 ./appimage` to workaround it
  https://github.com/sigmaSd/bandito/issues/3

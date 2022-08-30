# Bandito

Fresh frontend for [eltrafico](https://github.com/sigmaSd/Eltrafico)

![image](https://user-images.githubusercontent.com/22427111/187526633-de317357-ce9f-4314-b721-27fa62e0e9ce.png)


### Usage

```
MONITOR=${Monitor} TC=${pathToEltraficoTc}  deno run -A --unstable main.ts ${NetInterface}
```

*example:*

```
MONITOR=bandwhich TC=/dev/rust/cargo_target_dir/debug/tc  deno run -A --unstable main.ts wlan0
```

Note that `MONITOR` is optional and without it, bandito works but without showing live process network usage.

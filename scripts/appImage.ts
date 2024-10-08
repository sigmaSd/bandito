import { $ } from "jsr:@david/dax";

async function downloadDeno() {
  await $`wget "https://github.com/denoland/deno/releases/download/v1.46.3/deno-x86_64-unknown-linux-gnu.zip"`;
  await $`unzip deno-x86_64-unknown-linux-gnu.zip`;
  return "./deno";
}

async function downloadEltraficoTc() {
  await $`wget "https://github.com/sigmaSd/Eltrafico/releases/download/2.3.6/eltrafico.tar"`;
  await $`tar -xvf eltrafico.tar`;
  return "./target/release/eltrafico_tc";
}

async function downloadBandwich() {
  await $`wget "https://github.com/imsnif/bandwhich/releases/download/v0.23.1/bandwhich-v0.23.1-x86_64-unknown-linux-musl.tar.gz"`;
  await $`tar -xvf bandwhich-v0.23.1-x86_64-unknown-linux-musl.tar.gz`;
  return "./bandwhich";
}

async function downloadAppimagetool() {
  await $`wget "https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage"`;
  await $`chmod +x appimagetool-x86_64.AppImage`;
  return "./appimagetool-x86_64.AppImage";
}

async function downloadZenity() {
  await $`mkdir zenity-dir`;
  $.cd("zenity-dir");
  await $`wget "https://kojipkgs.fedoraproject.org//packages/zenity/4.0.2/1.fc39/x86_64/zenity-4.0.2-1.fc39.x86_64.rpm"`;
  await $`rpm2cpio zenity-4.0.2-1.fc39.x86_64.rpm | cpio -idmv`;
  $.cd("..");
  await $`cp zenity-dir/usr/bin/zenity ./`;
  await $`rm -rf zenity-dir`;
  return "./zenity";
}

if (import.meta.main) {
  const deno = Deno.env.get("DENO") || $.whichSync("deno") ||
    await downloadDeno();
  const eltraficoTc = Deno.env.get("ELTRAFICO_TC") ||
    $.whichSync("eltrafico-tc") ||
    await downloadEltraficoTc();
  const bandwhich = Deno.env.get("BANDWICH") || $.whichSync("bandwhich") ||
    await downloadBandwich();
  const appimagetool = Deno.env.get("APPIMAGETOOL") ||
    $.whichSync("appimagetool") || await downloadAppimagetool();
  const zenity = Deno.env.get("ZENITY") || await downloadZenity();

  await $`rm -rf /tmp/appimage`;
  await $`mkdir /tmp/appimage`;
  await $`mkdir -p /tmp/appimage/Bandito.AppDir/usr/bin`;
  await $`mkdir -p /tmp/appimage/Bandito.AppDir/usr/share/applications`;
  await $`mkdir -p /tmp/appimage/Bandito.AppDir/usr/share/icons/hicolor/256x256/apps`;

  await $`mkdir -p /tmp/appimage/Bandito.AppDir`;
  await $`cp -r . /tmp/appimage/Bandito.AppDir/bandito`;

  const vendor = Deno.env.get("VENDOR");
  if (vendor) {
    await $`cp -r ${vendor} /tmp/appimage/Bandito.AppDir/bandito/vendor-x86-64`;
  } else {
    await $`git clone https://github.com/sigmaSd/bandito-vendor`;
    await $`cp -r ./bandito-vendor/vendor-x86-64 /tmp/appimage/Bandito.AppDir/bandito/vendor-x86-64`;
  }

  await $`cp ${deno} /tmp/appimage/Bandito.AppDir/usr/bin/deno`;
  await $`cp ${eltraficoTc} /tmp/appimage/Bandito.AppDir/usr/bin/eltrafico-tc`;
  await $`cp ${bandwhich} /tmp/appimage/Bandito.AppDir/usr/bin/bandwhich`;
  await $`cp ${zenity} /tmp/appimage/Bandito.AppDir/usr/bin/zenity`;

  await $`chmod +x /tmp/appimage/Bandito.AppDir/usr/bin/deno`;
  await $`chmod +x /tmp/appimage/Bandito.AppDir/usr/bin/eltrafico-tc`;
  await $`chmod +x /tmp/appimage/Bandito.AppDir/usr/bin/bandwhich`;
  await $`chmod +x /tmp/appimage/Bandito.AppDir/usr/bin/zenity`;

  await $`cp ./scripts/assets/bandito.png /tmp/appimage/Bandito.AppDir/usr/share/icons/hicolor/256x256/apps/bandito.png`;
  await $`cp ./scripts/assets/bandito.png /tmp/appimage/Bandito.AppDir/bandito.png`;
  await $`cp ./scripts/assets/bandito.png /tmp/appimage/Bandito.AppDir/.DirIcon`;

  await $`cp ./scripts/assets/bandito.desktop /tmp/appimage/Bandito.AppDir/usr/share/applications/bandito.desktop`;
  await $`cp ./scripts/assets/bandito.desktop /tmp/appimage/Bandito.AppDir/bandito.desktop`;

  await $`cp ./scripts/assets/AppRun /tmp/appimage/Bandito.AppDir/AppRun`;
  await $`chmod +x /tmp/appimage/Bandito.AppDir/AppRun`;

  await $`ARCH=x86_64 ${appimagetool} /tmp/appimage/Bandito.AppDir`;

  await $`rm -rf /tmp/appimage`;
}

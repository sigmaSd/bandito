import { $ } from "jsr:@david/dax";

async function downloadDeno() {
  await $`wget "https://github.com/denoland/deno/releases/download/v1.46.3/deno-x86_64-unknown-linux-gnu.zip"`;
  await $`unzip deno-x86_64-unknown-linux-gnu.zip`;
  await $`ls -lah`;
  return "./deno-x86_64-unknown-linux-gnu/deno";
}

async function downloadEltraficoTc() {
  await $`wget "https://github.com/sigmaSd/Eltrafico/releases/download/2.3.6/eltrafico.tar"`;
  await $`tar -xvf eltrafico.tar`;
  await $`ls -lah`;
  return "./eltrafico/eltrafico-tc";
}

async function downloadBandwich() {
  await $`wget "https://github.com/imsnif/bandwhich/releases/download/v0.23.0/bandwhich-v0.23.0-x86_64-unknown-linux-musl.tar.gz"`;
  await $`ls -lah`;
  return "./bandwhich-v0.23.0-x86_64-unknown-linux-musl/bandwhich";
}

async function downloadAppimagetool() {
  await $`wget "https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage"`;
  await $`chmod +x appimagetool-x86_64.AppImage`;
  return "./appimagetool-x86_64.AppImage";
}

if (import.meta.main) {
  const deno = Deno.env.get("DENO") || $.whichSync("deno") || downloadDeno();
  const eltraficoTc = Deno.env.get("ELTRAFICO_TC") ||
    $.whichSync("eltrafico-tc") ||
    downloadEltraficoTc();
  const bandwhich = Deno.env.get("BANDWICH") || $.whichSync("bandwhich") ||
    downloadBandwich();
  const appimagetool = Deno.env.get("APPIMAGETOOL") ||
    $.whichSync("appimagetool") || await downloadAppimagetool();

  await $`rm -rf /tmp/appimage`;
  await $`mkdir /tmp/appimage`;
  await $`mkdir -p /tmp/appimage/Bandito.AppDir/usr/bin`;
  await $`mkdir -p /tmp/appimage/Bandito.AppDir/usr/share/applications`;
  await $`mkdir -p /tmp/appimage/Bandito.AppDir/usr/share/icons/hicolor/256x256/apps`;

  await $`mkdir -p /tmp/appimage/Bandito.AppDir`;
  await $`cp -r . /tmp/appimage/Bandito.AppDir/bandito`;

  await $`cp ${deno} /tmp/appimage/Bandito.AppDir/usr/bin/deno`;
  await $`cp ${eltraficoTc} /tmp/appimage/Bandito.AppDir/usr/bin/eltrafico-tc`;
  await $`cp ${bandwhich} /tmp/appimage/Bandito.AppDir/usr/bin/bandwhich`;
  await $`chmod +x /tmp/appimage/Bandito.AppDir/usr/bin/deno`;
  await $`chmod +x /tmp/appimage/Bandito.AppDir/usr/bin/eltrafico-tc`;
  await $`chmod +x /tmp/appimage/Bandito.AppDir/usr/bin/bandwhich`;

  await $`cp ./scripts/assets/bandito.png /tmp/appimage/Bandito.AppDir/usr/share/icons/hicolor/256x256/apps/bandito.png`;
  await $`ln -s /tmp/appimage/Bandito.AppDir/usr/share/icons/hicolor/256x256/apps/bandito.png /tmp/appimage/Bandito.AppDir/bandito.png`;

  await $`cp ./scripts/assets/bandito.desktop /tmp/appimage/Bandito.AppDir/bandito.desktop`;

  await $`cp ./scripts/assets/AppRun /tmp/appimage/Bandito.AppDir/AppRun`;
  await $`chmod +x /tmp/appimage/Bandito.AppDir/AppRun`;

  await $`ARCH=x86_64 ${appimagetool} /tmp/appimage/Bandito.AppDir`;

  await $`rm -rf /tmp/appimage`;
}

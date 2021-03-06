<template>
  <div class="settings">
    <span class="pageTitle">Recording Settings</span>

    <div class="setting">
      <span class="title">Video Device:</span>
      <DropDown name="videoDevice" :activeItem="videoDevice" :items="videoDevices" @item-changed="updateSettings" />
    </div>

    <div class="setting">
      <span class="title">Monitor To Record:</span>
      <DropDown name="monitorToRecord" :activeItem="monitorToRecord" :items="monitors" @item-changed="updateSettings" />
    </div>

    <div class="setting">
      <span class="title">FPS:</span>
      <TextBox name="fps" :value="fps" placeholder="30" type="number" @item-changed="updateSettings" />
    </div>

    <div class="setting">
      <span class="title">Resolution:</span>
      <DropDown name="resolution" :activeItem="resolution" :items="resolutions" @item-changed="updateSettings" />
    </div>

    <div class="setting">
      <span class="title">Format:</span>
      <DropDown name="format" :activeItem="format" :items="formats" @item-changed="updateSettings" />
    </div>

    <div v-if="this.isWindows" class="setting">
      <span class="title">Zero Latency:</span>
      <TickBox name="zeroLatency" :ticked="zeroLatency" @item-changed="updateSettings" />
    </div>

    <div v-if="this.isWindows" class="setting">
      <span class="title">Ultra Fast:</span>
      <TickBox name="ultraFast" :ticked="ultraFast" @item-changed="updateSettings" />
    </div>

    <div class="setting">
      <span class="title">Audio Devices To Record:</span>
      <ListBox
        name="audioDevicesToRecord"
        :items="audioDevicesToRecord"
        :enabled="audioDevicesToRecordEnabled"
        @item-changed="updateSettings"
      />
    </div>

    <div class="setting">
      <span class="title">Seperate Audio Tracks:</span>
      <TickBox name="seperateAudioTracks" :ticked="seperateAudioTracks" @item-changed="updateSettings" />
    </div>

    <div class="setting">
      <span class="title">Thumbnail Save Folder:</span>
      <TextBox name="thumbSaveFolder" :value="thumbSaveFolder" @item-changed="updateSettings" :folderSelect="true" />
    </div>

    <div class="setting">
      <span class="title">Video Save Folder:</span>
      <TextBox name="videoSaveFolder" :value="videoSaveFolder" @item-changed="updateSettings" :folderSelect="true" />
    </div>

    <div class="setting">
      <span class="title">Video Save Name:</span>
      <TextBox name="videoSaveName" :value="videoSaveName" @item-changed="updateSettings" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DropDown, { DropDownItem } from "./../ui/DropDown.vue";
import TextBox from "./../ui/TextBox.vue";
import TickBox from "./../ui/TickBox.vue";
import ListBox, { ListBoxItem } from "./../ui/ListBox.vue";
import SettingsManager, { SettingsFiles, RecordingSettings } from "@/libs/settings";
import DeviceManager from "@/libs/recorder/deviceManager";
import "@/libs/helpers/extensions";

@Component({
  components: {
    DropDown,
    TextBox,
    TickBox,
    ListBox
  }
})
export default class RecordingSettingsComponent extends Vue {
  isWindows = require("os").platform == "win32";
  videoDevice = RecordingSettings.videoDevice;
  videoDevices = ["Default"];
  monitors = new Array<DropDownItem>({ id: "primary", name: "Primary Monitor" });
  monitorToRecord = RecordingSettings.monitorToRecord;
  fps = RecordingSettings.fps;
  resolution = RecordingSettings.resolution;
  resolutions = ["In-Game", "2160p", "1440p", "1080p", "720p", "480p", "360p"];
  format = RecordingSettings.format;
  formats = ["mp4", "mkv"];
  zeroLatency = RecordingSettings.zeroLatency;
  ultraFast = RecordingSettings.ultraFast;
  audioDevicesToRecord = new Array<ListBoxItem>();
  audioDevicesToRecordEnabled = new Array<string>();
  seperateAudioTracks = RecordingSettings.seperateAudioTracks;
  thumbSaveFolder = RecordingSettings.thumbSaveFolder;
  videoSaveFolder = RecordingSettings.videoSaveFolder;
  videoSaveName = RecordingSettings.videoSaveName;

  async mounted() {
    let d = await DeviceManager.getDevices();
    let monitors = await DeviceManager.getMonitors();

    // Add video devices to videoDevices
    d.video.forEach((vd) => {
      this.$data.videoDevices.push(vd);
    });

    // Add audio devices to audioDevicesToRecord
    d.audio.forEach((ad) => {
      // Whether device is an input device or not.
      // Always going to be undefined on Windows
      // because DirectShow doesn't give us that information.
      let isInput: string | undefined;
      if (ad.isInput !== undefined) {
        isInput = ad.isInput ? "Input Device" : "Output Device";
      }

      this.audioDevicesToRecord.push({ id: ad.id.toString(), name: ad.name, title: isInput });
    });

    // Add displays
    monitors.forEach((screen) => {
      this.monitors.push({
        id: screen.id.toString(),
        name: `${screen.id}: ${screen.size.width}x${screen.size.height} ${screen.displayFrequency}hz`
      });
    });

    // Add enabled items to audioDevicesToRecordEnabled for ListBox to know what to tick by default
    RecordingSettings.audioDevicesToRecord.forEach((adtr) => {
      this.audioDevicesToRecordEnabled.push(adtr.id.toString());
    });
  }

  updateSettings(toUpdate: string, newValue: any) {
    // Update settings in obj
    switch (toUpdate) {
      case "videoDevice":
        RecordingSettings.videoDevice = newValue;
        break;
      case "monitorToRecord":
        RecordingSettings.monitorToRecord = newValue;
        break;
      case "fps":
        RecordingSettings.fps = newValue;
        break;
      case "resolution":
        RecordingSettings.resolution = newValue;
        break;
      case "format":
        RecordingSettings.format = newValue;
        break;
      case "zeroLatency":
        RecordingSettings.zeroLatency = newValue;
        break;
      case "ultraFast":
        RecordingSettings.ultraFast = newValue;
        break;
      case "audioDevicesToRecord":
        if (newValue[1]) {
          // Add new audio device to audioDevicesToRecord
          RecordingSettings.audioDevicesToRecord.push({ id: newValue[0][0], name: newValue[0][1] });
        } else {
          // Remove audio device from audioDevicesToRecord
          RecordingSettings.audioDevicesToRecord = RecordingSettings.audioDevicesToRecord.remove({
            id: newValue[0][0],
            name: newValue[0][1]
          });
        }
        break;
      case "seperateAudioTracks":
        RecordingSettings.seperateAudioTracks = newValue;
        break;
      case "thumbSaveFolder":
        RecordingSettings.thumbSaveFolder = newValue;
        break;
      case "videoSaveFolder":
        RecordingSettings.videoSaveFolder = newValue;
        break;
      case "videoSaveName":
        RecordingSettings.videoSaveName = newValue;
        break;
    }

    // Write new settings
    SettingsManager.writeSettings(SettingsFiles.Recording);
  }
}
</script>

<style lang="scss"></style>

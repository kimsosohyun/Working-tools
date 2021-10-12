<template>
  <main-content class="network-poe" :title="_('PoE Config')">
    <better-form :model="formData" @submit="submitData">
      <v-form-item>
        <template #label>
          <div class="network-poe-label">
            <span>{{ _("Port Status") }}</span>
            <v-popover
              class="network-poe-help"
              :width="506"
              trigger="hover"
              position="right-top"
              :title="_('Port Status')"
            >
              <p>
                {{
                  _(
                    "1. Click the button to switch between common mode and long-distance mode."
                  )
                }}
              </p>
              <p>
                {{
                  _(
                    "2. Under normal mode, the maximum transmission distance is 100 m. Under long-distance mode, the maximum transmission distance is 250 m."
                  )
                }}
              </p>
              <p>
                {{
                  _(
                    "3. Under long-distance mode, please use a CAT5e or better UTP cable to ensure the transmission effects."
                  )
                }}
              </p>
              <p>
                {{
                  _(
                    "4. Under the long-distance mode, the port rate is reduced to 10 Mbps, and the camera data rate needs less than 6 Mbps."
                  )
                }}
              </p>
              <template #reference>
                <i class="icon-help"></i>
              </template>
            </v-popover>
          </div>
        </template>
        <section class="poe-port-wrapper">
          <PoePort ref="poePort" :ports="this.formData.ports" />
        </section>
      </v-form-item>
      <v-form-item>
        <template #label>
          <span>{{ _("Port Power") }}</span>
          <v-popover
            class="network-poe-help"
            :width="506"
            trigger="hover"
            position="right-top"
            :title="_('Port Power')"
          >
            <p>
              {{
                _(
                  "1. The maximum PoE output power of the whole device is 40 W, and the output power range of each PoE port is 0 to 30 W."
                )
              }}
            </p>
            <p>
              {{
                _(
                  "2. When the total power consumption of the cameras exceeds the maximum PoE output power of the whole device, the device will cut off the PoE power supply in descending order of channel numbers until the total power consumption of the cameras is less than the maximum PoE output power of the whole device."
                )
              }}
            </p>
            <template #reference>
              <i class="icon-help"></i>
            </template>
          </v-popover>
        </template>
        <PoePower :used="formData.usedPower" :left="formData.leftPower" />
      </v-form-item>
      <v-form-item :label="_('IP Address')">
        <span class="v-form-item__label--medium">{{ formData.ip }}</span>
      </v-form-item>
    </better-form>
  </main-content>
</template>

<script>
// import dicts from "@/utils/dicts";
import MainContent from "@/views/layout/components/mainContent";
import BetterForm from "@/components/betterForm";
import PoePort from "./poePort";
import PoePower from "./poePower";

export default {
  name: "networkPoE",
  components: {
    MainContent,
    BetterForm,
    PoePort,
    PoePower
  },
  data() {
    this.setUrl = "/RPC2:configManager.setConfig:POE";
    this.getUrl = "/RPC2:configManager.getConfig:POE";
    return {
      formData: {
        ports: [],
        leftPower: "0",
        usedPower: "0",
        ip: ""
      },
      timer: null
    };
  },
  created() {
    if (!this.timer) {
      this.timer = setInterval(() => {
        this.getData();
      }, 1000);
    }
  },
  methods: {
    async getData() {
      const res = await this.$axiosPost(this.getUrl);

      this.formData = res.getParams();
    },
    async submitData(data) {
      const ports = this.$refs.poePort.getPorts();
      data = { ...this.formData, ports };

      const res = await this.$axiosPost(this.setUrl, data);

      if (res.getResult() === true) {
        this.$message.success(_("Saved Successfully"));
        this.getData();
      } else {
        this.$message.error(_("Failed to save"));
      }
    }
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>

<style lang="scss">
.network-poe {
  &-help {
    margin-left: 8px;
    font-size: 0;
    vertical-align: top;
    cursor: pointer;
    .icon-help {
      vertical-align: middle;
      font-size: 16px;
      color: $light-color;
    }
  }
  .poe-port-wrapper {
    padding: 8px 0 17px;
  }
}
</style>

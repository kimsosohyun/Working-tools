<template>
  <v-tabs class="ptz-tabs" v-model="activeValue" size="S" type="button">
    <v-tab-pane :label="_('Preset')" value="preset">
      <PresetTable />
    </v-tab-pane>
    <v-tab-pane :label="_('Patrol')" value="cruise">
      <CruiseTable />
    </v-tab-pane>
    <!-- <v-tab-pane label="轨迹" value="track">
      <TrackTable :active-channel="activeChannel" />
    </v-tab-pane> -->
  </v-tabs>
</template>

<script>
// import { getEntriesByAttr } from "@/utils/dicts";
import { mapGetters, mapState } from "vuex";
import PresetTable from "./presetTable";
import CruiseTable from "./cruiseTable";
// import TrackTable from "./trackTable";
export default {
  name: "ptzBabs",
  components: {
    PresetTable,
    CruiseTable
    /* TrackTable */
  },
  props: {
    presentHeight: Number
  },
  data() {
    return {
      activeValue: "preset"
    };
  },
  computed: {
    ...mapState({
      activeChannel: "activeChannel"
    }),
    ...mapGetters({
      channelConfigs: "channelConfigs",
      configsList: "channelCfgList"
    })
  }
};
</script>

<style lang="scss">
.ptz-tabs {
  .tab-nav {
    text-align: center;
    &-actions {
      display: flex;
    }
    .tab-nav--S {
      flex: 1;
      padding: 3px 0 !important;
      font-size: 14px !important;
    }
  }
}
</style>

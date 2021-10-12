/*
 * {
 *   id, // 唯一标识
 *   key, // 键名，一般用于与后台返回数据对应
 *   value, // 页面显示的内容
 *   ... // 可自定义字段名，方便其它情况使用，如：
 *   icon: 数据对应图标
 * }
 */

const dicts = {
  // 通用数据字典
  COMMON: {
    //语言配置
    language: [
      {
        label: _("简体中文"),
        value: "cn"
      },
      {
        label: "English",
        value: "en"
      }
    ],
    codeStream: [
      {
        id: "main",
        key: "main",
        value: _("Main Stream"),
        icon: "icon-main-stream"
      },
      {
        id: "extra",
        key: "extra",
        value: _("Sub-stream"),
        icon: "icon-substream"
      }
    ],
    audioEncodeType: [
      {
        id: "G.711Mu",
        key: "G.711Mu",
        value: "G.711Mu",
        codeType: 1
      },
      {
        id: "G.711A",
        key: "G.711A",
        value: "G.711A",
        codeType: 2
      },
      {
        id: "PCM",
        key: "main",
        value: "PCM"
      },
      {
        id: "ADPCM",
        key: "ADPCM",
        value: "ADPCM"
      },
      {
        id: "G.729",
        key: "G.729",
        value: "G.729"
      },
      {
        id: "MPEG2",
        key: "MPEG2",
        value: "MPEG2"
      },
      {
        id: "G.726",
        key: "main",
        value: "G.726"
      },
      {
        id: "AMR",
        key: "AMR",
        value: "AMR"
      }
    ],
    videoEncodeType: [
      {
        id: "H.265",
        key: "H.265",
        value: "H.265",
        codeType: 1
      },
      {
        id: "H.264B",
        key: "H.264B",
        value: "H.264B",
        codeType: 2
      },
      {
        id: "H.264M",
        key: "H.264M",
        value: "H.264M",
        codeType: 2
      },
      {
        id: "H.264H",
        key: "H.264H",
        value: "H.264H",
        codeType: 2
      }
    ],
    status: [
      {
        id: "online",
        key: 1,
        value: _("Online")
      },
      {
        id: "offline",
        key: 2,
        value: _("Offline")
      }
    ],
    connection: [
      {
        id: "connected",
        key: 1,
        value: _("Connected")
      },
      {
        id: "not-connected",
        key: 2,
        value: _("Disconnected")
      },
      {
        id: "connecting",
        key: 3,
        value: _("Connecting…")
      }
    ],
    encryption: [
      {
        id: "none",
        key: 1,
        value: _("Not encrypted")
      },
      {
        id: "SSL",
        key: 2,
        value: "SSL"
      },
      {
        id: "TLS",
        key: 3,
        value: "TLS"
      }
    ]
  },

  // 通道功能模块
  CHANNEL: {
    status: [
      {
        id: "connecting",
        key: 1,
        value: _("Connecting…")
      },
      {
        id: "online",
        key: 2,
        value: _("M#XyJ#Connected")
      },
      {
        id: "offline",
        key: 3,
        value: _("Offline")
      },
      {
        id: "abnormal",
        key: 4,
        value: _("Exception")
      }
    ]
  },

  // 预览功能模块
  PREVIEW: {
    aspectRatio: [
      {
        id: "full",
        key: "full",
        value: _("Full screen"),
        icon: "icon-ratio-auto"
      },
      {
        id: "4:3",
        key: "4:3",
        value: "4:3",
        icon: "icon-ratio-4x3"
      },
      {
        id: "16:9",
        key: "16:9",
        value: "16:9",
        icon: "icon-ratio-16x9"
      },
      {
        id: "1:1",
        key: "1:1",
        value: "1X",
        icon: "icon-ratio-1x"
      }
    ],
    splitScreen: [
      {
        id: "1",
        key: 1,
        value: _("Single Screen"),
        icon: "icon-s-channel1"
      },
      {
        id: "4",
        key: 4,
        value: _("Four Screens"),
        icon: "icon-s-channel4"
      },
      {
        id: "8",
        key: 8,
        value: _("8 split-screens"),
        icon: "icon-s-channel8"
      },
      {
        id: "9",
        key: 9,
        value: _("9 split-screens"),
        icon: "icon-s-channel9"
      },
      {
        id: "16",
        key: 16,
        value: _("16 split-screens"),
        icon: "icon-s-channel16"
      }
    ],
    ptzDirections: [
      {
        id: "left-top",
        icon: "lt",
        code: "LeftUp"
      },
      {
        id: "top",
        icon: "t",
        code: "Up"
      },
      {
        id: "right-top",
        icon: "rt",
        code: "RightUp"
      },
      {
        id: "left",
        icon: "l",
        code: "Left"
      },
      {
        id: "autoScan",
        icon: "h",
        code: ["AutoPanOff", "AutoPanOn"]
      },
      {
        id: "right",
        icon: "r",
        code: "Right"
      },
      {
        id: "left-bottom",
        icon: "lb",
        code: "LeftDown"
      },
      {
        id: "bottom",
        icon: "b",
        code: "Down"
      },
      {
        id: "right-bottom",
        icon: "rb",
        code: "RightDown"
      }
    ],
    ptzArgs: [
      {
        id: "zoom-out",
        title: _("Zoom-"),
        icon: "icon-zoom-out",
        code: "ZoomWide"
      },
      {
        id: "zoom-in",
        title: _("Zoom+"),
        icon: "icon-zoom-in",
        code: "ZoomTele"
      },
      {
        id: "reduced-focus",
        title: _("Focus-"),
        icon: "icon-reduced-focus",
        code: "FocusNear"
      },
      {
        id: "increased-focus",
        title: _("Focus+"),
        icon: "icon-increased-focus",
        code: "FocusFar"
      },
      {
        id: "aperture-out",
        title: _("Aperture-"),
        icon: "icon-aperture-out",
        code: "IrisSmall"
      },
      {
        id: "aperture-in",
        title: _("Aperture+"),
        icon: "icon-aperture-in",
        code: "IrisLarge"
      }
    ]
  },

  // 配置功能模块
  CONFIG: {
    addedCameraStatus: [
      {
        key: 1,
        statusContent: _("Connecting…"),
        statusClass: ""
      },
      {
        key: 2,
        statusContent: _("M#XyJ#Connected"),
        statusClass: "table-dot-normal"
      },
      {
        key: 3,
        statusContent: _("Abnormal (Offline)"),
        statusClass: "table-dot-abnormal"
      },
      {
        key: 4,
        statusContent: _("Abnormal (Incorrect user name or password)"),
        statusClass: "table-dot-abnormal"
      },
      {
        key: 5,
        statusContent: _("Abnormal (The user account has been locked)"),
        statusClass: "table-dot-abnormal"
      },
      {
        key: 6,
        statusContent: _("Abnormal (Network error)"),
        statusClass: "table-dot-abnormal"
      }
    ],
    onlineCameraStatus: [
      {
        key: 1,
        statusContent: _("Online")
      },
      {
        key: 2,
        statusContent: _("Unactivated")
      }
    ],
    cameraProtocol: [
      {
        value: 1,
        label: "Tenda"
      },
      {
        value: 2,
        label: "Onvif"
      }
    ],
    cameraPort: [
      {
        key: 1,
        portContent: 8000
      },
      {
        key: 2,
        portContent: 80
      }
    ],
    poePortMode: [
      {
        id: "long",
        key: 1,
        value: _("Long-range Mode")
      },
      {
        id: "normal",
        key: 2,
        value: _("Normal Mode")
      }
    ],
    ddnsStatus: [
      {
        id: "Connected",
        key: 1,
        value: _("Connected"),
        clazz: "connected"
      },
      {
        id: "Disconnected",
        key: 2,
        value: _("Disconnected"),
        clazz: "disconnected"
      },
      {
        id: "Connecting",
        key: 3,
        value: _("Connecting…"),
        clazz: "connecting"
      },
      {
        id: "NetworkAnomaly",
        key: 4,
        value: _("Network error"),
        clazz: "network-anomaly"
      },
      {
        id: "Incorrect",
        key: 5,
        value: _("Incorrect user name or password"),
        clazz: "incorrect"
      },
      {
        id: "LinkAnomaly",
        key: 6,
        value: _("Server connection error"),
        clazz: "link-anomaly"
      },
      {
        id: "DNSAnomaly",
        key: 7,
        value: _("Domain name error"),
        clazz: "dns-anomaly"
      }
    ],
    serverProvider: [
      {
        id: "oray",
        key: "Oray DDNS",
        value: "Oray",
        addr: "ddns.oray.com"
      },
      {
        id: "dynDNS",
        key: "Dyndns DDNS",
        value: "DynDNS",
        addr: "members.dyndns.org"
      },
      {
        id: "noIP",
        key: "NO-IP DDNS",
        value: "No-IP",
        addr: "dynupdate.no-ip.com"
      },
      {
        id: "custom",
        key: "custom",
        value: _("Custom"),
        addr: ""
      }
    ],
    upnpMode: [
      {
        id: "custom",
        key: 1,
        value: _("Custom")
      },
      {
        id: "default",
        key: 2,
        value: _("Auto")
      }
    ],
    upnpStatus: [
      {
        id: "NotExist",
        key: 1,
        value: _("This port does not exist"),
        clazz: "not-exist"
      },
      {
        id: "Mapping",
        key: 2,
        value: _("Mapping..."),
        clazz: "upnp-mapping"
      },
      {
        id: "Succeded",
        key: 3,
        value: _("Mapping Succeded"),
        clazz: "upnp-succeded"
      },
      {
        id: "notOpened",
        key: 4,
        value: _("UPnP of the router is not enabled"),
        clazz: "not-opened"
      },
      {
        id: "Disabled",
        key: 5,
        value: _("UPnP Disabled"),
        clazz: "upnp-disabled"
      },
      {
        id: "Failed",
        key: 6,
        value: _("Mapping Failed"),
        clazz: "upnp-failed"
      },
      {
        id: "Error",
        key: 7,
        value: _("Mapping Error"),
        clazz: "upnp-error"
      }
    ],

    timeFormat: [
      { value: "YYYY-MM-DD", key: 1 },
      { value: "MM-DD-YYYY", key: 2 },
      { value: "DD-MM-YYYY", key: 3 }
    ],

    compressionTypes: [
      { key: "PCM", value: "PCM" },
      { key: "ADPCM", value: "ADPCM" },
      { key: "G.711A", value: "G.711A" },
      { key: "G.711Mu", value: "G.711Mu" },
      { key: "G.726", value: "G.726" },
      { key: "G.729", value: "G.729" },
      { key: "MPEG2", value: "MPEG2" },
      { key: "AMR", value: "AMR" },
      { key: "AAC", value: "AAC" },
      { key: "G.726ASF", value: "G.726ASF" }
    ],
    frequencyTypes: [],

    depthTypes: [],

    videoCompressionTypes: [
      { key: "H.265", value: "H.265" },
      { key: "H.264", value: "H.264" }
    ],

    videoResolutionTypes: [
      { key: "2304*1296", value: "2304*1296" },
      { key: "1920*1080", value: "1920*1080" },
      { key: "1280*960", value: "1280*960" },
      { key: "1280*720", value: "1280*720" },
      { key: "960*540", value: "960*540" },
      { key: "720*480", value: "720*480" }
    ],

    videoFpsTypes: [],
    videoSmartEncode: [
      { key: 1, value: _("Enable") },
      { key: 0, value: _("Disable") }
    ],

    vedioBitRateControlTypes: [
      { key: "VBR", value: _("Variable") },
      { key: "CBR", value: _("Constant bitrate") }
    ],

    videoBitRateList: []
  },

  // 回放功能模块
  REPLAY: {},

  // 系统管理模块
  SYSTEM: {
    typeOption: [
      {
        value: 0,
        label: _("D#gzi#All")
      },
      {
        value: 1,
        label: _("V#zEY#Alarm")
      },
      {
        value: 2,
        label: _("Exception")
      },
      {
        value: 3,
        label: _("Operation")
      },
      {
        value: 4,
        label: _("Info")
      },
      {
        value: 5,
        label: _("配置")
      }
    ],
    timeZone: [
      { utc: 0, value: 0, label: _("(UTC) Casablanca, Monrovia") },
      { utc: 0, value: 1, label: _("(UTC) Dublin, Edinburgh, Lisbon, London") },
      {
        utc: 1,
        value: 2,
        label: _("(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna")
      },
      {
        utc: 1,
        value: 3,
        label: _(
          "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague"
        )
      },
      {
        utc: 1,
        value: 4,
        label: _("(UTC+01:00) Brussels, Copenhagen, Madrid, Paris")
      },
      {
        utc: 1,
        value: 5,
        label: _("(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb")
      },
      { utc: 1, value: 6, label: _("(UTC+01:00) West Central Africa") },
      { utc: 2, value: 7, label: _("(UTC+02:00) Harare, Pretoria") },
      {
        utc: 2,
        value: 8,
        label: _("(UTC+02:00) Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius")
      },
      { utc: 2, value: 9, label: _("(UTC+02:00) Windhoek") },
      { utc: 2, value: 10, label: _("(UTC+02:00) Jerusalem") },
      { utc: 2, value: 11, label: _("(UTC+02:00) Cairo") },
      {
        utc: 2,
        value: 12,
        label: _("(UTC+02:00) Athens, Bucharest, Istanbul")
      },
      { utc: 3, value: 13, label: _("(UTC+03:00) Minsk") },
      { utc: 3, value: 14, label: _("(UTC+03:00) Baghdad") },
      { utc: 3, value: 15, label: _("(UTC+03:00) Kuwait, Riyadh") },
      {
        utc: 3,
        value: 16,
        label: _("(UTC+03:00) Moscow, St. Petersburg, Volgograd")
      },
      { utc: 3, value: 17, label: _("(UTC+03:00) Nairobi") },
      { utc: 3.5, value: 18, label: _("(UTC+03:30) Tehran") },
      { utc: 4, value: 19, label: _("(UTC+04:00) Abu Dhabi, Muscat") },
      { utc: 4, value: 20, label: _("(UTC+04:00) Yerevan") },
      { utc: 4, value: 21, label: _("(UTC+04:00) Baku") },
      { utc: 4, value: 22, label: _("(UTC+04:00) Tbilisi") },
      { utc: 4.5, value: 23, label: _("(UTC+04:30) Kabul") },
      { utc: 5, value: 24, label: _("(UTC+05:00) Islamabad, Karachi") },
      { utc: 5, value: 25, label: _("(UTC+05:00) Tashkent") },
      { utc: 5, value: 26, label: _("(UTC+05:00) Ekaterinburg") },
      {
        utc: 5.5,
        value: 27,
        label: _("(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi")
      },
      { utc: 5.5, value: 28, label: _("(UTC+05:30) Colombo") },
      { utc: 5.75, value: 29, label: _("(UTC+05:45) Kathmandu") },
      {
        utc: 6,
        value: 30,
        label: _("(UTC+06:00) Almaty, Astana, Dhaka, Novosibirsk")
      },
      { utc: 6.5, value: 31, label: _("(UTC+06:30) Yangon (Rangoon)") },
      { utc: 7, value: 32, label: _("(UTC+07:00) Krasnoyarsk") },
      { utc: 7, value: 33, label: _("(UTC+07:00) Bangkok, Hanoi, Jakarta") },
      {
        utc: 8,
        value: 34,
        label: _("(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi, Taipei")
      },
      { utc: 8, value: 35, label: _("(UTC+08:00) Kuala Lumpur, Singapore") },
      { utc: 8, value: 36, label: _("(UTC+08:00) Perth") },
      { utc: 8, value: 37, label: _("(UTC+08:00) Irkutsk, Ulaanbaatar") },
      { utc: 9, value: 38, label: _("(UTC+09:00) Pyongyang") },
      { utc: 9, value: 39, label: _("(UTC+09:00) Osaka, Sapporo, Tokyo") },
      { utc: 9, value: 40, label: _("(UTC+09:00) Seoul") },
      { utc: 9, value: 41, label: _("(UTC+09:00) Yakutsk") },
      { utc: 9.5, value: 42, label: _("(UTC+09:30) Adelaide, Darwin") },
      { utc: 10, value: 43, label: _("(UTC+10:00) Vladivostok") },
      { utc: 10, value: 44, label: _("(UTC+10:00) Hobart") },
      {
        utc: 10,
        value: 45,
        label: _("(UTC+10:00) Canberra, Melbourne, Sydney")
      },
      { utc: 10, value: 46, label: _("(UTC+10:00) Guam, Port Moresby") },
      { utc: 10, value: 47, label: _("(UTC+10:00) Brisbane") },
      { utc: 11, value: 48, label: _("(UTC+11:00) Magadan") },
      {
        utc: 11,
        value: 49,
        label: _("(UTC+11:00) Solomon Islands, New Caledonia")
      },
      { utc: 12, value: 50, label: _("(UTC+12:00) Auckland, Wellington") },
      {
        utc: 12,
        value: 51,
        label: _("(UTC+12:00) Fiji Islands, Kamchatka, Marshall Islands")
      },
      { utc: 13, value: 52, label: _("(UTC+13:00) Nuku'alofa") },
      {
        utc: -1,
        value: 53,
        label: _("(UTC-01:00) Cape Verde Islands, Azores")
      },
      { utc: -2, value: 54, label: _("(UTC-02:00) Mid-Atlantic") },
      { utc: -3, value: 55, label: _("(UTC-03:00) Brasilia") },
      { utc: -3, value: 56, label: _("(UTC-03:00) Buenos Aires") },
      { utc: -3, value: 57, label: _("(UTC-03:00) Greenland") },
      {
        utc: -3.5,
        value: 58,
        label: _("(UTC-03:30) Newfoundland and Labrador")
      },
      { utc: -4, value: 59, label: _("(UTC-04:00) Atlantic Time (Canada)") },
      { utc: -4, value: 60, label: _("(UTC-04:00) Santiago") },
      { utc: -4, value: 61, label: _("(UTC-04:00) La Paz") },
      { utc: -4, value: 62, label: _("(UTC-04:00) Manaus") },
      { utc: -4, value: 63, label: _("(UTC-04:00) Georgetown") },
      { utc: -4.5, value: 64, label: _("(UTC-04:30) Caracas") },
      {
        utc: -5,
        value: 65,
        label: _("(UTC-05:00) Eastern Time (US and Canada)")
      },
      { utc: -5, value: 66, label: _("(UTC-05:00) Bogota, Lima, Quito") },
      { utc: -5, value: 67, label: _("(UTC-05:00) Indiana (East)") },
      {
        utc: -6,
        value: 68,
        label: _("(UTC-06:00) Guadalajara, Mexico City, Monterrey")
      },
      {
        utc: -6,
        value: 69,
        label: _("(UTC-06:00) Central Time (US and Canada)")
      },
      {
        utc: -7,
        value: 70,
        label: _("(UTC-07:00) Chihuahua, La Paz, Mazatlan")
      },
      { utc: -7, value: 71, label: _("(UTC-07:00) Arizona") },
      {
        utc: -7,
        value: 72,
        label: _("(UTC-07:00) Mountain Time (US and Canada)")
      },
      {
        utc: -8,
        value: 73,
        label: _("(UTC-08:00) Pacific Time (US and Canada)")
      },
      { utc: -9, value: 74, label: _("(UTC-09:00) Alaska") },
      { utc: -10, value: 75, label: _("(UTC-10:00) Hawaii") },
      { utc: -11, value: 76, label: _("(UTC-11:00) Samoa") },
      {
        utc: -12,
        value: 77,
        label: _("(UTC-12:00) International Date Line West")
      }
    ]
  }
};

/**
 * 获取数据字典对象
 * @returns {Object} 数据字典对象
 */
const getAll = () => dicts;

/**
 * 获取某个模块下的所有数据字典
 * @param {String} module 模块名称
 * @returns {Object} 某个模块下的所有数据字典
 */
const getAttrsByModule = (module = "COMMON") => dicts[module];

/**
 * 获取某个模块下的某个属性的数据字典
 * @param {String} attrName 模块下的属性名称
 * @param {String} module 模块名称
 * @returns {Object} 某个模块下的某个属性的数据字典
 */
const getEntriesByAttr = (attrName, module) => {
  const curModule = getAttrsByModule(module);
  if (!curModule) {
    return curModule;
  }

  return curModule[attrName];
};

/**
 * 通过key或者value获取其父级对象
 * @param {*} any key/value的值
 * @param {String} fieldName 对应any的字段名 key对应"key" value对应"value"
 * @param {String} attrName 模块下的属性名称
 * @param {String} module 模块名称
 * @returns {Object} {key: "key1", value: "value1"}
 */
const getEntryByAny = (any, fieldName, attrName, module) => {
  const curEntries = getEntriesByAttr(attrName, module);
  if (!curEntries) {
    return curEntries;
  }

  return curEntries.find(entry => entry[fieldName] === any);
};
/**
 * 通过id标识获取其父级对象
 * @param {*} id 获取父级对象的id的值
 * @param {String} attrName 模块下的属性名称
 * @param {String} module 模块名称
 * @returns {Object} {key: "key1", value: "value1"}
 */
const getEntryById = (id, attrName, module) =>
  getEntryByAny(id, "id", attrName, module);
/**
 * 通过key获取其父级对象
 * @param {*} key 获取父级对象的key的值
 * @param {String} attrName 模块下的属性名称
 * @param {String} module 模块名称
 * @returns {Object} {key: "key1", value: "value1"}
 */
const getEntryByKey = (key, attrName, module) =>
  getEntryByAny(key, "key", attrName, module);
/**
 * 通过value获取其父级对象
 * @param {*} value 获取父级对象的value的值
 * @param {String} attrName 模块下的属性名称
 * @param {String} module 模块名称
 * @returns {Object} {key: "key1", value: "value1"}
 */
const getEntryByValue = (value, attrName, module) =>
  getEntryByAny(value, "value", attrName, module);

/**
 * 通过id获取key/value的值
 * @param {*} id id对应的值
 * @param {String} kv key/value字符串
 * @param {String} attrName 模块下的属性名称
 * @param {String} module 模块名称
 * @returns {*} key/value值
 */
const getKVById = (id, kv, attrName, module) => {
  const curEntry = getEntryById(id, attrName, module);
  if (!curEntry) {
    return curEntry;
  }

  return curEntry.id === id ? curEntry[kv] : undefined;
};
/**
 * 通过id获取key的值
 * @param {*} id id对应的值
 * @param {String} attrName 模块下的属性名称
 * @param {String} module 模块名称
 * @returns {*} key值
 */
const getKeyById = (id, attrName, module) =>
  getKVById(id, "key", attrName, module);
/**
 * 通过id获取value的值
 * @param {*} id id对应的值
 * @param {String} attrName 模块下的属性名称
 * @param {String} module 模块名称
 * @returns {*} value值
 */
const getValueById = (id, attrName, module) =>
  getKVById(id, "value", attrName, module);

/**
 * 通过key获取value的值
 * @param {*} key key对应的值
 * @param {String} attrName 模块下的属性名称
 * @param {String} module 模块名称
 * @returns {*} value值
 */
const getValueByKey = (key, attrName, module) => {
  const curEntry = getEntryByKey(key, attrName, module);
  if (!curEntry) {
    return curEntry;
  }

  return curEntry.key === key ? curEntry.value : undefined;
};
/**
 * 通过value获取key的值
 * @param {*} value value对应的值
 * @param {String} attrName 模块下的属性名称
 * @param {String} module 模块名称
 * @returns {*} key值
 */
const getKeyByValue = (value, attrName, module) => {
  const curEntry = getEntryByValue(value, attrName, module);
  if (!curEntry) {
    return curEntry;
  }

  return curEntry.value === value ? curEntry.key : undefined;
};

export {
  getAll,
  getAttrsByModule,
  getEntriesByAttr,
  getEntryById,
  getEntryByKey,
  getEntryByValue,
  getKeyById,
  getValueById,
  getValueByKey,
  getKeyByValue
};

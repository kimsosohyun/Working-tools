const valid = {
  num: function(str, min, max) {
    if (!/^([-0-9])?([0-9]+)$/.test(str)) {
      return _("Should be an integer");
    }
    if (typeof min === "number" && typeof max === "number") {
      if (parseInt(str, 10) < min || parseInt(str, 10) > max) {
        return _("Range: %s - %s", [min, max]);
      }
    }
  },
  len: function(str, min, max) {
    var len = str.length;

    if (len < min || len > max) {
      return _("Please enter %s to %s characters", [min, max]);
    }
  },
  pwd: {
    all: function(str, minLen, maxLen) {
      var ret = this.specific(str);
      if (ret) {
        return ret;
      }

      if (minLen && maxLen) {
        ret = valid.len(str, minLen, maxLen);
        if (ret) {
          return ret;
        }
      }
    },
    specific: function(str) {
      if (!/^[0-9a-zA-Z\\_!$^*-=,.]+$/.test(str)) {
        return _(
          "o#IkK#Allow only digits, uppercase letters, lowercase letters and special characters ! $ ^ , . * - _ ="
        );
      }
    }
  },
  username: function(str) {
    if (!/^[0-9a-zA-Z\\_!$^*-=,.]+$/.test(str)) {
      return _(
        "o#IkK#Allow only digits, uppercase letters, lowercase letters and special characters ! $ ^ , . * - _ ="
      );
    }
  },
  ip: {
    all: function(str) {
      var ret = this.specific(str);

      if (ret) {
        return ret;
      }

      if (
        !/^([1-9]|[1-9]\d|1\d\d|2[0-1]\d|22[0-3])\.(([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){2}([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/.test(
          str
        )
      ) {
        return _("Incorrect IP address format");
      }
    },

    specific: function(str) {
      var ipArr = str.split("."),
        ipHead = ipArr[0];

      if (ipArr[0] === "127") {
        return _(
          "IP addresses starting with 127 are loopback addresses. Please enter a different IP address"
        );
      }
      if (ipArr[0] > 223) {
        // return `${ipHead} is an invalid value. Please enter a value ranging from 1 to 223`;
        return _(
          "%s is an invalid value. Please enter a value ranging from 1 to 223",
          [ipHead]
        );
      }
    }
  },
  ipAll: function(str) {
    let ret;
    if (str !== "0.0.0.0") {
      ret = valid.ip.all(str);
      if (ret) {
        return ret;
      }
    }
  },
  subnetMask: {
    all: function(str) {
      var rel = /^(254|252|248|240|224|192|128)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(255|254|252|248|240|224|192|128|0))$/;
      if (!rel.test(str)) {
        return _("Incorrect subnet mask format");
      }
    }
  },
  email: function(str) {
    var rel = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!rel.test(str)) {
      return _("Please enter a valid E-mail address");
    }
  },
  domain: function(str) {
    if (!/^[\d.]+$/.test(str)) {
      if (
        /^[0-9a-z]([0-9a-z-]+\.){1,}([0-9a-z])+$/i.test(str) ||
        str == "localhost"
      ) {
        //
      } else {
        return _("Please enter a valid domain name");
      }
    } else {
      return _("Please enter a valid domain name");
    }
  },
  phone: {
    all: function(str) {
      if (!/^[0-9]{11,12}$/.test(str)) {
        return _("Invalid phone number");
      }
    },
    specific: function(str) {
      if (!/^[0-9]{1,}$/.test(str)) {
        return _("Please enter a valid phone number");
      }
    }
  },
  identity: function(str) {
    const lang = B.getLang();
    if (lang == "cn") {
      return valid.phone.all(str);
    } else {
      return valid.email(str);
    }
  },
  getUtf8Length: function(str) {
    const len = str.length;
    let totalLength = 0;
    let charCode;
    let i;

    for (i = 0; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode < 0x007f) {
        totalLength++;
      } else if (charCode >= 0x0080 && charCode <= 0x07ff) {
        totalLength += 2;
      } else if (charCode >= 0x0800 && charCode <= 0xffff) {
        totalLength += 3;
      } else {
        totalLength += 4;
      }
    }
    return totalLength;
  },
  byteLen: function(str, min, max) {
    const totalLength = valid.getUtf8Length(str);

    if (
      typeof min !== "undefined" &&
      typeof max !== "undefined" &&
      (totalLength < min || totalLength > max)
    ) {
      return _("Range: %s - %s bytes", [min, max]);
    }
  }
};

export default valid;

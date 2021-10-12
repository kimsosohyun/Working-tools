const statusCodeMap = {
  1001: _("Over limit"),
  1101: _(
    "Allow only digits, uppercase letters, lowercase letters and special characters ! $ ^ , . * - _ ="
  ),
  1102: _("The user already exists"),
  1103: "The user does not exist",
  1104: "The user is on the blacklist",
  1105: _("The user has been locked. Please try again in %s minutes"),
  1106: _("The user already exists"),
  1107: _("Incorrect password. %s attempts left"),
  1108: _("Incorrect old password"),
  1109: _("Incorrect administrator password"),
  1200: _("Test failed. Incorrect sender Email address or password"), //用户名不正确
  1201: _("Test failed. Incorrect sender Email address or password"), //密码不正确
  1202: _("Test failed. Unable to connect to the server"),
  1203: _("The port has been used by other services"),
  1204: _("The port has been used by other services"),
  1205: _("The port has been used by other services"),
  1206: _("The port has been used by other services"),
  1301: _("Failed to verify the upgrading file"),
  1302: _("Upgrading failed")
};

export function getMessage(statusCode) {
  return statusCodeMap[statusCode] || statusCode;
}

const moment = require("moment");
codeTime = 1687085018040;

const now = moment();
const diff = now.diff(codeTime, "m");
console.log(diff);

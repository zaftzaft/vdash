'use stirct';

const exec = require("child-process-promise").exec;

const getPeer = data => {
  return data.split("\n").slice(0, -1).map(line => {
    return line.split(" ")[0];
  })
  .filter(a => /@/.test(a))
  .reduce((o, name) => {
    let peer = name.split("@");
    o[peer[0]] = peer[1];
    return o;
  }, {});
};


module.exports = () => {
  return exec("ip -br link")
  .then(res => {
    return getPeer(res.stdout);
  });
};


module.exports.getPeer = getPeer;

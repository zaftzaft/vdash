'use stirct';

const exec = require("child-process-promise").exec;

const getPorts = br => {
  return exec(`ovs-vsctl list-ports ${br}`)
  .then(res => {
    return res.stdout.split("\n").slice(0, -1)
  });
};


const getBridges = () => {
  return exec("ovs-vsctl list-br")
  .then(res => {
    return res.stdout.split("\n").slice(0, -1)
  });
};


module.exports = () => {
  return getBridges()
  .then(res => {
    return Promise.all(res.map(br => getPorts(br)))
    .then(ports => {
      return ports.reduce((o, po, i) => {
        o[res[i]] = po;
        return o;
      }, {});
    });
  });
};

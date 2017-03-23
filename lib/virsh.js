'use stirct';

const exec = require("child-process-promise").exec;

const getIfList = domain => {
  return exec(`virsh domiflist ${domain}`)
  .then(res => {
    return res.stdout.split("\n").slice(2, -2)
    .map(line => {
      let data = line.split(/ +/);

      return {
        name: data[0],
        type: data[1],
        source: data[2],
        model: data[3],
        mac: data[4]
      };

    });
  });
};


const getDomains = () => {
  return exec("virsh list --all")
  .then(res => {
    return res.stdout.split("\n").slice(2, -2)
    .map(line => {
      let data = line.split(/ +/);

      if(data[0] === "") {
        data = data.slice(1);
      }

      return {
        id: data[0],
        name: data[1],
        state: data[2]
      };

    });
  });

};


module.exports = () => {
  return getDomains()
  .then(res => {
    return Promise.all(res.map(dom => getIfList(dom.name)))
    .then(ifList => {
      return res.map((domainInfo, i) => {
        domainInfo.ifList = ifList[i];
        return domainInfo;
      });
    });
  });

};

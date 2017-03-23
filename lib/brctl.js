'use stirct';

const exec = require("child-process-promise").exec;

module.exports = () => {
  return exec("brctl show")
  .then(res => {
    return res.stdout.split("\n").slice(1, -1)
    .reduce((o, br) => {
      let data = br.split(/\t+/);

      if(data.length === 4) {
        o[1][data[0]] = [data[3]];
        o[0] = data[0];
      }
      else {
        o[1][o[0]].push(data.join("").trim());
      }

      return o;
    }, ["", {}])[1];
  });

};

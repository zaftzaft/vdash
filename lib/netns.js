'use strict';

const exec = require("child-process-promise").exec;
const vethPeer = require("./veth-peer");




module.exports = () => {
  return exec("ip netns list")
  .then(res => {
    return res.stdout.split("\n").slice(0, -1)
    .map(ns => ns.split(" ")[0]);
  });
};

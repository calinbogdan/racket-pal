const _ = require("lodash");
const faker = require("faker");

const ENGINEERS_COUNT = 10;

const EngineersPseudoCollection = _.range(0, ENGINEERS_COUNT).map((number) => ({
  id: number,
  name: faker.name.findName(),
}));

async function getEngineers() {
  return Promise.resolve(EngineersPseudoCollection);
}

const EngineersRepo = {
  getEngineers,
};

module.exports = EngineersRepo;

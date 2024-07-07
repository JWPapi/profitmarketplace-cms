import _ from 'lodash';

module.exports = {
  async beforeCreate(event) {
    let {name} = event.params;
    name = _.trim(name).toLowerCase();
  },
};

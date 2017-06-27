import dataModel from './data-model.js';
import {dataAdapter} from './data-model.js';
import {USERNAME} from '../data/data.js';

const resultAdapter = new class extends dataAdapter {
  preprocess(data) {
    data.forEach((item, index) => {
      if (!item.hasOwnProperty(`answers`) || !item.hasOwnProperty(`time`)) {
        data.splice(index, 1);
      }
    });
    return data;
  }

  toServer(data) {
    return JSON.stringify(data);
  }
}();

class ResultModel extends dataModel {
  constructor() {
    super();

    this.stats = [];
  }

  get urlRead() {
    return `https://intensive-ecmascript-server-btfgudlkpi.now.sh/guess-melody/stats/${USERNAME}`;
  }

  get urlWrite() {
    return `https://intensive-ecmascript-server-btfgudlkpi.now.sh/guess-melody/stats/${USERNAME}`;
  }

  send(data) {
    super.send(data, resultAdapter);
  }

  load() {
    return super.load(resultAdapter);
  }
}

export default new ResultModel();
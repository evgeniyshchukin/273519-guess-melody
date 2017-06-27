import SuccessView from '../views/result-success-view.js';
import FailView from '../views/result-fail-view.js';
import application from '../application/application.js';
import statisticsModel from '../models/statistics-model.js';
import {show} from '../utils/utils.js';

class ResultPresenter {
  init(params) {

    statisticsModel.send(params);

    statisticsModel.load()
      .then((stats) => {
        statisticsModel.stats = stats;
      })
      .then(() => {
        if (params) {
          this.view = new SuccessView(Object.assign({}, params, {percentHighscore: this.getPercentHighscore(params)}));
        } else {
          this.view = new FailView();
        }
      })
      .then(() => {
        show(this.view.element);
      })
      .then(() => {
        this.view.onRestartClick = () => {
          location.reload();
          application.welcomeScreen();
        };
      })
      .catch(window.console.error);
  }

  getPercentHighscore(params) {
    params.isPlayerResult = true;

    const commonStats = statisticsModel.stats;

    commonStats.push(params);

    commonStats.sort((a, b) => {
      return b.answers - a.answers || a.time - b.time;
    });

    const playerIndex = commonStats.findIndex((item) => {
      if (item.isPlayerResult) {
        delete item.isPlayerResult;
        return true;
      }

      return false;
    });
    const result = 100 - (playerIndex / commonStats.length) * 100;
    return Math.floor(result) + `%`;
  }
}
export default new ResultPresenter();

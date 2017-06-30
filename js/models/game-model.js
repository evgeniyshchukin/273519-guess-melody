import dataModel from './data-model.js';
import {dataAdapter} from './data-model.js';
import {deepCopy} from '../utils/utils.js';
import {initialState} from '../data/data.js';

const gameModelAdapter = new class extends dataAdapter {
  constructor() {
    super();
  }

  preprocess(data) {
    return data.map((item) => {
      // const QestionType = new Map([
      //   [`artist`, {
      //     type: item.type,
      //     data: {file: item.src},
      //     answers: gameModelAdapter.proceedArtistAnswers(item.answers)
      //   }],
      //   [`genre`, {
      //     type: item.type,
      //     data: item.question,
      //     answers: gameModelAdapter.proceedGenreAnswers(item.answers, item.genre)
      //   }]
      // ]);
      //
      // return QestionType.get(item.type);

      switch (item.type) {
        case `artist`:
          return {
            type: item.type,
            data: {file: item.src},
            answers: gameModelAdapter.proceedArtistAnswers(item.answers)
          };
        case `genre`:
          return {
            type: item.type,
            data: item.question,
            answers: gameModelAdapter.proceedGenreAnswers(item.answers, item.genre)
          };
      }

      return {};
    });
  }

  toServer(data) {
    return JSON.stringify(data);
  }

  proceedArtistAnswers(answers) {
    return answers.map((item) => {
      return {
        valid: item.isCorrect,
        artistName: item.title,
        image: item.image.url
      };
    });
  }

  proceedGenreAnswers(answers, correctGenre) {
    return answers.map((item) => {
      return {
        valid: item.genre === correctGenre,
        file: item.src
      };
    });
  }
}();

class GameModel extends dataModel {

  constructor() {
    super();

    this.QuestionType = {
      ARTIST: `artist`,
      GENRE: `genre`
    };

    this.questions = [];
    this.initState = deepCopy(initialState);
    this.initState.questions = deepCopy(this.questions);
    this.state = Object.assign({}, this.initState);
  }

  get urlRead() {
    return `https://intensive-ecmascript-server-wbcouextsi.now.sh/guess-melody/questions`;
  }

  load() {
    return super.load(gameModelAdapter);
  }
}

const model = new GameModel();
export default model;

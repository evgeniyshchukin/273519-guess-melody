import timerScreen from './timer/timer-screen';
import getElementFromTemplate from '../utils/get-element-from-template';
import {onQuestionAnswered} from '../controllers/game-controller';
import getTimeFromScreen from '../utils/get-time-from-screen';

export default (songs, trueSong, timeLeft) => {
  const answerTemplate = (song) => `
  <div class="genre-answer">
    <div class="player-wrapper">${song.genre}</div>
    <input type="checkbox" name="answer" value="${song.value}" id="${song.id}">
    <label class="genre-answer-check" for="${song.id}"></label>
  </div>`;

  const mainTemplate = `
  <section class="main main--level main--level-genre">
    ${timerScreen(timeLeft)}
    <div class="main-wrap">
      <h2 class="title main-title">Выберите трек(и) в "${trueSong.genre}" стиле</h2>
      <form class="genre">
        ${songs.map(answerTemplate).join(``)}
        <button class="genre-answer-send" type="submit" disabled>Ответить</button>
      </form>
    </div>
  </section>`;

  const levelGenre = getElementFromTemplate(mainTemplate);
  const submitButton = levelGenre.querySelector(`.genre-answer-send`);
  const checkboxCollection = levelGenre.querySelectorAll(`input[type="checkbox"]`);

  const checkAnswers = () => {

    const curentAnswers = songs.map((song) => {
      return song.genre === trueSong.genre;
    });


    let valid = false;
    for (let i = 0; i < checkboxCollection.length; i++) {
      valid = checkboxCollection[i].checked === curentAnswers[i];
      if (!valid) {
        break;
      }
    }
    return valid;
  };

  const setStateSubmitButton = () => {
    for (const checkbox of checkboxCollection) {
      submitButton.disabled = !checkbox.checked;
      if (!submitButton.disabled) {
        break;
      }
    }
  };

  const onChangeCheckbox = () => {
    setStateSubmitButton();
  };

  for (const checkbox of checkboxCollection) {
    checkbox.addEventListener(`change`, onChangeCheckbox);
  }

  const onClickSendButton = (event) => {
    event.preventDefault();
    onQuestionAnswered(checkAnswers(), getTimeFromScreen());
  };

  submitButton.addEventListener(`click`, onClickSendButton);

  return levelGenre;
};

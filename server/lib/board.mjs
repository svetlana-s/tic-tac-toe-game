// Cell  '' | X | Y
// TicTieMap Array 9 items
// 0 1 2
// 3 4 5
// 6 7 8

function getClearMap() {
  return [
    '', '', '',
    '', '', '',
    '', '', '',
  ]
}

const WIN_COMBINATION = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function checkIsGameEnd(map) {
  return WIN_COMBINATION.some(combination => {
    return combination.every(position => map[position] === 'X') ||
      combination.every(position => map[position] === 'O')
  })
}

// steps:
// first: { id: number, prevStepId: undefined, field: number }
// step: { id: number, prevStepId: number, field: number }

// gameStatus: 'Playing', 'Finished'

export class Board {
  constructor(gameName, gameId) {
    this.gameName = gameName;
    this.gameId = gameId;
    this.map = getClearMap();
    this.steps = [];
    this.gameStatus = 'Playing';
  }

  getCurrentGameState() {
    return {
      map: this.map,
      steps: this.steps,
      gameStatus: this.gameStatus,
      gameName: this.gameName,
      gameId: this.gameId,
    };
  }

  clear() {
    this.gameStatus = 'Playing';
    this.map = getClearMap();
    this.steps = [];
  }

  firstStep(stepData) {
    const isFieldCorrect = stepData.field >= 0 && stepData.field <= 8;
    const isMapEmpty = this.map.every(f => f === '');
    const isStepsLengthZero = this.steps.length === 0;

    if (isStepsLengthZero && isMapEmpty && isFieldCorrect) {
      const step = {
        id: 0,
        prevStepId: undefined,
        field: stepData.field,
      };

      this.steps=[step];
      this.map = [...this.map.slice(0, stepData.field), 'O', ...this.map.slice(stepData.field + 1)];
      this.gameStatus = 'Playing';

      return { result: true };
    } else {
      return { result: false };
    }
  }

  step(stepData) {
    const isProgression = this.steps.length > 0 && this.steps.slice(-1)[0].id === stepData.prevStepId;
    const isFieldCorrect = stepData.field >= 0 && stepData.field <= 8 && this.map[stepData.field] === '';
    const isGameStatusCorrect = this.gameStatus === 'Playing';

    if(isProgression && isFieldCorrect && isGameStatusCorrect) {
      const step = {
        id: this.steps.length,
        prevStepId: this.steps.length - 1,
        field: stepData.field
      };

      const fieldData = this.steps.length % 2 === 1 ? 'X' : 'O';

      this.steps=[...this.steps, step];
      this.map = [...this.map.slice(0, stepData.field), fieldData, ...this.map.slice(stepData.field + 1)];

      this.checkGameEnd();

      return { result: true }
    } else {
      return { result: false }
    }
  }

  checkGameEnd() {
    const isGameEnd = this.steps.length === 9 || (this.steps.length >= 5 && checkIsGameEnd(this.map));

    if (isGameEnd) {
      this.gameStatus = 'Finished';
    }
  }
}

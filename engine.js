const lcg = (seed) => (1664525 * seed + 1013904223) % 4294967296;

const config = {
  allowedStake: [1, 2, 5, 10],
  allowedNumberOfLines: Array.from({ length: 25 }, (_, i) => i + 1),
  reels: [[], [], [], [], []],
  payoutTable: {},
};

const Spin = ({ private: { seed }, public }, stake, numberOfLines) => {
  if (config.allowedStake.indexOf(stake) < 0) {
    throw new Error('invalidStake');
  }
  if (config.allowedNumberOfLines.indexOf(numberOfLines) < 0) {
    throw new Error('invalidLines');
  }
  if (public.action !== 'Spin') {
    throw new Error('invalidAction');
  }
  const isFreeSpin = (seed = lcg(seed)) % 6 < 3;
  const winAmount = (seed = lcg(seed)) % 6 < 3 ? 0 : 2 * stake * numberOfLines;
  const reelPositions = Array.from({ length: 5 }, () => (seed = lcg(seed)) % 50);
  return {
    gameState: {
      private: { seed },
      public: {
        ...public,
        action: isFreeSpin ? 'FreeSpin' : 'Close',
        stake,
        numberOfLines,
        totalReturn: winAmount,
        spinResult: { reelPositions, winAmount },
        freeSpinsRemaining: isFreeSpin ? 2 : undefined,
      },
    },
    transaction: {
      amount: -stake * numberOfLines,
    },
    jackpotContributions: [],
  };
};

const FreeSpin = ({ private: { seed }, public }) => {
  if (public.action !== 'FreeSpin') {
    throw new Error('invalidAction');
  }
  const freeSpinsRemaining = public.freeSpinsRemaining - 1;
  const winAmount = (seed = lcg(seed)) % 6 < 3 ? 0 : public.stake * public.numberOfLines;
  const reelPositions = Array.from({ length: 5 }, () => (seed = lcg(seed)) % 50);
  return {
    gameState: {
      private: { seed },
      public: {
        ...public,
        action: freeSpinsRemaining ? 'FreeSpin' : 'Close',
        totalReturn: public.totalReturn + winAmount,
        spinResult: { reelPositions, winAmount },
        freeSpinsRemaining: freeSpinsRemaining || undefined,
      },
    },
    transaction: null,
    jackpotContributions: [],
  };
};

const Close = ({ private, public }) => {
  if (public.action !== 'Close') {
    throw new Error('invalidAction');
  }
  return {
    gameState: {
      isComplete: true,
      private,
      public: {
        ...public,
        action: undefined,
        spinResult: undefined,
      },
    },
    transaction: {
      amount: public.totalReturn,
    },
    jackpotContributions: [],
  };
};

module.exports = {
  getConfig: () => config,
  newGame: ({ seed }) => ({ private: { seed }, public: { action: 'Spin' } }),
  execute: ({ gameState, command: [commandType, ...commandArgs] }) =>
    ({ Spin, FreeSpin, Close }[commandType](gameState, ...commandArgs)),
  getNextActionToAutoComplete: (gameState) =>
    ['FreeSpin', 'Close'].indexOf(gameState.public.action) >= 0 ? [gameState.public.action] : null,
};

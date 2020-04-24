const lcg = (seed) => (1664525 * seed + 1013904223) % 4294967296;

const jackpotContributionPct = 1e-3;

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
    jackpot: {
      contributions: [
        { pot: 'main', amount: stake * numberOfLines * jackpotContributionPct, triggerWin: false },
      ],
    },
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
    jackpot: {
      contributions: [],
    },
  };
};

const Close = ({ private: { seed }, public }) => {
  if (public.action !== 'Close') {
    throw new Error('invalidAction');
  }
  return {
    gameState: {
      isComplete: true,
      private: { seed },
      public: {
        ...public,
        action: undefined,
        spinResult: undefined,
      },
    },
    transaction: {
      amount: public.totalReturn,
    },
    jackpot: {
      contributions: [
        { pot: 'main', amount: null, triggerWin: lcg(seed) % (1 / jackpotContributionPct) === 0 },
      ],
    },
  };
};

const unknownCommandType = () => {
  throw new Error('unknownCommandType');
};

module.exports = {
  getConfig: () => config,
  newGame: ({ seed }) => ({ private: { seed }, public: { action: 'Spin' } }),
  execute: ({ gameState, command: [commandType, ...commandArgs] }) =>
    (({ Spin, FreeSpin, Close }[commandType] || unknownCommandType)(gameState, ...commandArgs)),
  getNextActionToAutoComplete: (gameState) =>
    ['FreeSpin', 'Close'].indexOf(gameState.public.action) >= 0 ? [gameState.public.action] : null,
};

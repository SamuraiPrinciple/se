# Simple slots engine

## Prerequisites

- Node.js 14.0.0+
- npm 6.14.4+

## Starting the service

`npm start`

## Examples

### getConfig

```bash
curl -s -X POST http://localhost:3030/slotsEngine/getConfig --data-binary @- <<EOF | jq
[]
EOF
```

### newGame

```bash
curl -s -X POST http://localhost:3030/slotsEngine/newGame --data-binary @- <<EOF | jq
[
  {
    "seed": 1234
  }
]
EOF
```

### Simple game round

```bash
curl -s -X POST http://localhost:3030/slotsEngine/execute --data-binary @- <<EOF | jq
[
  {
    "gameState": {
      "private": {
        "seed": 1234
      },
      "public": {
        "action": "Spin"
      }
    },
    "command": ["Spin", 2, 25]
  }
]
EOF
```

```bash
curl -s -X POST http://localhost:3030/slotsEngine/execute --data-binary @- <<EOF | jq
[
  {
    "gameState": {
      "private": {
        "seed": 889114580
      },
      "public": {
        "action": "Close",
        "stake": 2,
        "numberOfLines": 25,
        "totalReturn": 50,
        "spinResult": {
          "reelPositions": [1,2,3,4,5],
          "winAmount": 100
        }
      }
    },
    "command": ["Close"]
  }
]
EOF
```

### Game round with free spins

```bash
curl -s -X POST http://localhost:3030/slotsEngine/execute --data-binary @- <<EOF | jq
[
  {
    "gameState": {
      "private": {
        "seed": 12345
      },
      "public": {
        "action": "Spin"
      }
    },
    "command": ["Spin", 2, 25]
  }
]
EOF
```

```bash
curl -s -X POST http://localhost:3030/slotsEngine/execute --data-binary @- <<EOF | jq
[
  {
    "gameState": {
      "private": {
        "seed": 71072467
      },
      "public": {
        "action": "FreeSpin",
        "stake": 2,
        "numberOfLines": 25,
        "totalReturn": 0,
        "spinResult": {
          "reelPositions": [1,2,3,4,5],
          "winAmount": 0
        },
        "freeSpinsRemaining": 2
      }
    },
    "command": ["FreeSpin"]
  }
]
EOF
```

```bash
curl -s -X POST http://localhost:3030/slotsEngine/execute --data-binary @- <<EOF | jq
[
  {
    "gameState": {
      "private": {
        "seed": 2332836374
      },
      "public":{
        "action": "FreeSpin",
        "stake": 2,
        "numberOfLines": 25,
        "totalReturn": 50,
        "freeSpinsRemaining": 1
      }
    },
    "command": ["FreeSpin"]
  }
]
EOF
```

```bash
curl -s -X POST http://localhost:3030/slotsEngine/execute --data-binary @- <<EOF | jq
[
  {
    "gameState": {
      "private": {
        "seed": 2726892157
      },
      "public": {
        "action": "Close",
        "stake": 2,
        "numberOfLines": 25,
        "totalReturn": 50
      }
    },
    "command": ["Close"]
  }
]
EOF
```

### Some errors

```bash
curl -s -X POST http://localhost:3030/slotsEngine/execute --data-binary @- <<EOF | jq
[
  {
    "gameState": {
      "private": {
        "seed": 12345
      },
      "public": {
        "action": "Spin"
      }
    },
    "command": ["Spin", 20, 25]
  }
]
EOF
```

```bash
curl -s -X POST http://localhost:3030/slotsEngine/execute --data-binary @- <<EOF | jq
[
  {
    "gameState": {
      "private": {
        "seed": 12345
      },
      "public": {
        "action": "Close",
        "stake": 2,
        "numberOfLines": 25,
        "totalReturn": 50
      }
    },
    "command": ["FreeSpin"]
  }
]
EOF
```

### Auto complete

```bash
curl -s -X POST http://localhost:3030/slotsEngine/getNextActionToAutoComplete --data-binary @- <<EOF | jq
[
  {
    "private": {
      "seed": 12345
    },
    "public": {
      "action": "Close",
      "stake": 2,
      "numberOfLines": 25,
      "totalReturn": 50
    }
  }
]
EOF
```

```bash
curl -s -X POST http://localhost:3030/slotsEngine/getNextActionToAutoComplete --data-binary @- <<EOF | jq
[
  {
    "private": {
      "seed": 12345
    },
    "public": {
      "action": "Spin"
    }
  }
]
EOF
```

### TBD

- Currency
- i18n

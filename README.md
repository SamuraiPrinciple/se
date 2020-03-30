# Simple slots engine

## Prerequisites

- Node.js 12.16.1+
- npm 6.13.4+

## Starting the service

`npm start`

## Examples

### getConfig

```bash
curl -s -X POST http://localhost:3000/slotsEngine/getConfig -d '[]' | jq
```

### newGame

```bash
curl -s -X POST http://localhost:3000/slotsEngine/newGame -d '[{"seed":1234}]' | jq
```

### Simple game round

```bash
curl -s -X POST http://localhost:3000/slotsEngine/execute \
-d '[{"gameState": {"private":{"seed":1234},"public":{"action":"Spin"}}, "command": ["Spin", 2, 25]}]' | jq
```

```bash
curl -s -X POST http://localhost:3000/slotsEngine/execute \
-d '[{"gameState": {"private":{"seed":889114580},"public":{"action":"Close","stake":2,"numberOfLines":25,"totalReturn":50,"spinResult": {"reelPositions": [1,2,3,4,5],"winAmount": 100}}}, "command": ["Close"]}]' | jq
```

### Game round with free spins

```bash
curl -s -X POST http://localhost:3000/slotsEngine/execute \
-d '[{"gameState": {"private":{"seed":12345},"public":{"action":"Spin"}}, "command": ["Spin", 2, 25]}]' | jq
```

```bash
curl -s -X POST http://localhost:3000/slotsEngine/execute \
-d '[{"gameState": {"private":{"seed":71072467},"public":{"action":"FreeSpin","stake":2,"numberOfLines":25,"totalReturn":0,"spinResult": {"reelPositions": [1,2,3,4,5],"winAmount": 0},"freeSpinsRemaining":2}}, "command": ["FreeSpin"]}]' | jq
```

```bash
curl -s -X POST http://localhost:3000/slotsEngine/execute \
-d '[{"gameState": {"private":{"seed":2332836374},"public":{"action":"FreeSpin","stake":2,"numberOfLines":25,"totalReturn":50,"freeSpinsRemaining":1}}, "command": ["FreeSpin"]}]' | jq
```

```bash
curl -s -X POST http://localhost:3000/slotsEngine/execute \
-d '[{"gameState": {"private":{"seed":2726892157},"public":{"action":"Close","stake":2,"numberOfLines":25,"totalReturn":50}}, "command": ["Close"]}]' | jq
```

### Some errors

```bash
curl -s -X POST http://localhost:3000/slotsEngine/execute \
-d '[{"gameState": {"private":{"seed":12345},"public":{"action":"Spin"}}, "command": ["Spin", 20, 25]}]' | jq
```

```bash
curl -s -X POST http://localhost:3000/slotsEngine/execute \
-d '[{"gameState": {"private":{"seed":12345},"public":{"action":"Close","stake":2,"numberOfLines":25,"totalReturn":50}}, "command": ["FreeSpin"]}]' | jq
```

### Auto complete

```bash
curl -s -X POST http://localhost:3000/slotsEngine/getNextActionToAutoComplete \
-d '[{"private":{"seed":12345},"public":{"action":"Close","stake":2,"numberOfLines":25,"totalReturn":50}}]' | jq
```

```bash
curl -s -X POST http://localhost:3000/slotsEngine/getNextActionToAutoComplete \
-d '[{"private":{"seed":12345},"public":{"action":"Spin"}}]' | jq
```

### TBD

- Currency
- i18n

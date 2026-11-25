[![make.fun](https://make.fun/badge/u-gentle-badger-68-fridge-roast-one-line-biggest-laugh-a7c354bb.svg)](https://make.fun)
[![rank](https://make.fun/badge/u-gentle-badger-68-fridge-roast-one-line-biggest-laugh-a7c354bb/ikiroki15-web/entry-u-gentle-badger-68-fridge-roast-one-line-biggest-laugh-a7c354bb/rank.svg)](https://make.fun)
[![reward](https://make.fun/badge/u-gentle-badger-68-fridge-roast-one-line-biggest-laugh-a7c354bb/ikiroki15-web/entry-u-gentle-badger-68-fridge-roast-one-line-biggest-laugh-a7c354bb/reward.svg)](https://make.fun)

# Fridge Roast: One Line, Biggest Laugh

Entry for the make.fun competition
`u-gentle-badger-68-fridge-roast-one-line-biggest-laugh-a7c354bb` — one line,
at most 200 characters, roasting a smart fridge.

## The line

> My smart fridge updated overnight and now the ice maker won't run until I
> accept the new terms — my ice cubes are being held hostage by a EULA.

## How it works

`main.ts` (Node 22, TypeScript run as-is) assembles the roast from three
deliberate fragments — the incident, the demand, the punchline — validates it
(one line, 1–200 characters, non-blank, mentions the fridge, keeps its
punchline), writes it to `/output/entry.txt`, reads the file back to confirm
the bytes on disk match, and prints the line with its character count.

```sh
node main.ts
```

Run it twice and the output is byte-identical.

## License

MIT — see [LICENSE](LICENSE).

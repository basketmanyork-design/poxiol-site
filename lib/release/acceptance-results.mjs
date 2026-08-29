import {createHash} from 'node:crypto'

function sumMatches(output, pattern) {
  return [...output.matchAll(pattern)].reduce((total, match) => total + Number(match[1]), 0)
}

export function buildCommandRecord({command, durationMs, exitCode, output}) {
  const staticPageMatches = [...output.matchAll(/Generating static pages \((\d+)\/\1\)/g)]
  const staticPageCount = staticPageMatches.length
    ? Number(staticPageMatches.at(-1)[1])
    : null

  return {
    command,
    exitCode,
    durationMs,
    passCount: sumMatches(output, /# pass (\d+)/g),
    failCount: sumMatches(output, /# fail (\d+)/g),
    staticPageCount,
    outputSha256: createHash('sha256').update(output).digest('hex'),
  }
}

export function mergeCommandRecords(current, incoming) {
  const records = new Map(current.map((record) => [record.command, record]))
  for (const record of incoming) records.set(record.command, record)
  return [...records.values()].sort((a, b) => a.command.localeCompare(b.command, 'en'))
}

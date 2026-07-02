#!/usr/bin/env node
/**
 * Build com heap limitado na Vercel (container 8 GB).
 * 8192 MB no heap do Node + memória nativa do webpack estoura RAM → SIGKILL/OOM.
 */
import { spawnSync } from 'node:child_process'

const isVercel = process.env.VERCEL === '1'
// 4 GB heap: abaixo disso o next build OOM no compile; acima + webpack nativo estoura 8 GB na Vercel.
const heapMb = isVercel ? '4096' : '8192'

const result = spawnSync('npx', ['next', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: `--max-old-space-size=${heapMb}`,
  },
})

process.exit(result.status ?? 1)

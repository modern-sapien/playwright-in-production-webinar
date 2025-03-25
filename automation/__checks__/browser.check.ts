import { BrowserCheck, Frequency, RetryStrategyBuilder } from 'checkly/constructs'

new BrowserCheck('browser-check-18', {
  name: 'Check cars',
  activated: false,
  muted: false,
  shouldFail: false,
  runParallel: true,
  locations: ['us-east-2'],
  tags: [],
  sslCheckDomain: '',
  frequency: Frequency.EVERY_24H,
  environmentVariables: [],
  code: {
    entrypoint: 'find-cars.spec.ts',
  },
  retryStrategy: RetryStrategyBuilder.linearStrategy({
    baseBackoffSeconds: 60,
    maxRetries: 2,
    maxDurationSeconds: 600,
    sameRegion: true,
  }),
})
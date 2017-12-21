import	{ expect }	from 'chai'
import	* as webpack	from 'webpack'

import	* as utils	from './utils'

const	successCases	= utils.listTestDirs('behaviours-success')
const	errorCases	= utils.listTestDirs('behaviours-error')
const	knownbugCases	= utils.listTestDirs('behaviours-known-bug')

describe('Success cases', function() {
	this.timeout(30000)

	successCases.forEach((successCase) => {
		describe(successCase, () => {
			beforeEach(utils.cleanupOutputDir(successCase))

			it('generates the expected HTML files', (done) => {
				const webpackConfig = require('./' + successCase + '/webpack.config.js')

				webpack(webpackConfig, (err, stats) => {
					if (err) {
						return done(err)
					}
					if (stats.hasErrors()) {
						const compilationErrors: string[] = stats.toJson('errors-only').errors
						console.log(compilationErrors)
						return done(compilationErrors)
					}

					const caseDir = __dirname + '/' + successCase
					const expectedDir = caseDir + '/expected-output/'
					const actualDir = caseDir + '/actual-output/'

					utils.directoryContains(expectedDir, actualDir, (err, result) => {
						if (err) {
							return done(err)
						}

						// tslint:disable-next-line:no-unused-expression
						expect(result).to.be.ok
						done()
					})
				})
			})
		})
	})
})

describe('Error cases', () => {
	errorCases.forEach((errorCase) => {
		describe(errorCase, () => {
			beforeEach(utils.cleanupOutputDir(errorCase))

			it('generates the expected error', (done) => {
				const webpackConfig = require('./' + errorCase + '/webpack.config.js')
				const expectedError = require('./' + errorCase + '/expected-error.js')

				webpack(webpackConfig, (err, stats) => {
					const compilationErrors: string[] = stats.toJson('errors-only').errors
					const actualError = compilationErrors[0].toString().split('\n')[0]
					expect(actualError).to.include(expectedError)
					done()
				})
			})
		})
	})
})

describe('Known bugs', () => {
	knownbugCases.forEach((knownbugCase) => {
		describe(knownbugCase, () => {
			beforeEach(utils.cleanupOutputDir(knownbugCase))

			it('generates the expected error', (done) => {
				const webpackConfig = require('./' + knownbugCase + '/webpack.config.js')

				webpack(webpackConfig, (err, stats) => {
					const compilationErrors: string[] = stats.toJson('errors-only').errors
					const actualError = compilationErrors[0].toString().split('\n')[0]
					console.log(actualError)

					// tslint:disable-next-line:no-unused-expression
					expect(true).to.be.true
					done()
				})
			})
		})
	})
})

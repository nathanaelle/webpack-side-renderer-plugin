import	async		from 'async'
import	* as fs		from 'fs'
import	* as glob	from 'glob'
import	* as path	from 'path'
import	* as rm_rf	from 'rimraf'

export	const cleanupOutputDir = (testName: string) => {
	const	dirToClean = path.join(__dirname, testName, 'actual-output')
	return	(done: any) => rm_rf(dirToClean, done)
}

export const listTestDirs = (dirName: string): string[] => {
	const	cwd = path.join( __dirname, dirName)
	return	glob.sync('*/', { cwd }).map( (subDir: string): string => path.join(dirName, subDir.replace(/\/$/, '')) )
}

function readFile(dirName: string, done: any) {
	return fs.readFile(dirName, 'utf8', done)
}

function compareFile(referenceDir: string, targetDir: string) {
	return	(file: string, done: any) => {
		const referenceFile = path.join(referenceDir, file)
		const targetFile = path.join(targetDir, file)
		async.map([referenceFile, targetFile], readFile, (err, results) => {
			if (err) {
				return done(err)
			}

			done(null, results[0] === results[1])
		})
	}
}

export const directoryContains = (referenceDir: string, targetDir: string, done: any): void => {
	glob('**/*', { cwd: referenceDir, nodir: true }, (err, files) => {
		if (err) {
			return done(err)
		}

		async.map(files, compareFile(referenceDir, targetDir), (err, results) => {
			if (err) {
				return done(err)
			}

			done(null, !results.some((result) => {
				return !result
			}))
		})
	})
}

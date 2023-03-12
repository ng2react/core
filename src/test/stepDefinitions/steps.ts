import assert from 'assert'
import { When, Then } from '@cucumber/cucumber'
import fs from 'fs'
import path from 'path'
import parseFile from '../../lib/parse-file.mjs'

const root = path.resolve(__dirname, '../../..')

When('the file is {string}', function (filePath: string) {
  this.fileContent = fs.readFileSync(path.join(root, 'angularjs-examples', filePath), 'utf8')
  console.log(this.fileContent)
  return 'pending';
});

Then('It should be parsed', function () {
  assert.equal(this.fileContent, 'Nope')
  parseFile(this.fileContent)

});

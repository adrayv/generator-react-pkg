'use strict';
const Generator = require('yeoman-generator');
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.log('Initializing...');
  }
  start() {
	this.log('Do something...');
	this.prompt([
		{
		  type    : 'input',
		  name    : 'name',
		  message : 'Enter a name for the new component (i.e.: myNewComponent): '
		}
	  ]).then( (answers) => {
		// create destination folder
		this.destinationRoot(answers.name);
		this.fs.copyTpl(
			this.templatePath('index.html'),
			this.destinationPath(answers.name + '.html'),
			{ message: 'Hello World'}
		);
	  });
  }
};
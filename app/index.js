'use strict';
const npmValidate = require('validate-npm-package-name')
const Generator = require('yeoman-generator');
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.log('Initializing...');
  }
  start() {
	this.prompt([
		{
		  type: 'input',
		  name: 'packageName',
		  message: 'package name:',
		  default: 'my-package',
		  validate: (input) => {
			  const result = npmValidate(input)
			  if(result.validForNewPackages && result.validForOldPackages) {
				  return true
			  }
			  else {
				  return "Not a valid NPM package name"
			  }
		  }
		},
		{
			type: 'input',
			name: 'packageDescription',
			message: 'description:',
			default: ""
		},
		{
			type: 'input',
			name: 'packageAuthor',
			message: 'author:',
			default: ""
		},
		{
			type: 'input',
			name: 'gitUsername',
			message: 'GitHub username:',
			default: "",
			validate: (input) => /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/.test(input) || input === ""
		},
		{
			type: 'input',
			name: 'gitRepoName',
			message: 'GitHub repository name:',
			default: "",
			validate: (input) => /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,100}$/.test(input) || input === ""
		},
		{
			type: 'input',
			name: 'devServerPort',
			message: 'Port number for local dev server:',
			default: 3000,
			validate: (input) => {
				const portNo = Number(input)
				if(typeof portNo == 'number' && !isNaN(portNo)) {
					return true
				}
				else {
					return "Not a valid port number"
				}
			}
		},
	]).then( (answers) => {
		const { 
			packageName,
			packageDescription,
			packageAuthor,
			gitUsername,
			gitRepoName,
		} = answers

		const devServerPort = Number(answers.devServerPort)

		// create destination folder
		this.destinationRoot(packageName);

		// package.json
		if(answers.gitRepoName && answers.gitUsername) {
			this.fs.copyTpl(
				this.templatePath('withGitPackage.json'),
				this.destinationPath('package.json'),
				{ 
					packageName,
					packageDescription,
					packageAuthor,
					gitUsername,
					gitRepoName,
				}
			)
		}
		else {
			this.fs.copyTpl(
				this.templatePath('withoutGitPackage.json'),
				this.destinationPath('package.json'),
				{ packageName, packageDescription, packageAuthor }
			)
		}

		// .npmignore
		this.fs.copyTpl(
			this.templatePath('DOTnpmignore'),
			this.destinationPath('.npmignore')
		)

		// .gitignore
		this.fs.copyTpl(
			this.templatePath('DOTgitignore'),
			this.destinationPath('.gitignore')
		)

		// .babelrc
		this.fs.copyTpl(
			this.templatePath('DOTbabelrc'),
			this.destinationPath('.babelrc')
		)

		// webpack.config
		this.fs.copyTpl(
			this.templatePath('webpack.config.js'),
			this.destinationPath('webpack.config.js'),
			{devServerPort}
		)

		// README.md
		this.fs.copyTpl(
			this.templatePath('README.md'),
			this.destinationPath('README.md'),
			{ packageName, packageDescription }
		)

		// src/index.js
		this.fs.copyTpl(
			this.templatePath('src-index.js'),
			this.destinationPath('src/index.js'),
			{ packageName }
		)

		// examples
		this.fs.copyTpl(
			this.templatePath('examples-src-index.html'),
			this.destinationPath('examples/src/index.html'),
			{ packageName }
		)
		this.fs.copyTpl(
			this.templatePath('examples-src-index.js'),
			this.destinationPath('examples/src/index.js'),
		)
	});
  }
};
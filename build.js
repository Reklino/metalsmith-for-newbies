var metalsmith = require('metalsmith'),
	layouts = require('metalsmith-layouts'),
	inPlace = require('metalsmith-in-place'),
	markdown = require('metalsmith-markdown'),
	moment = require('moment'),
	collections = require('metalsmith-collections'),
	beautify = require('metalsmith-beautify');

var siteBuild = metalsmith(__dirname)
	.metadata({
		site: {
			title: 'MetalSmith for Newbies',
			url: 'http://reklino.github.io/ms'
		}
	})
	.source('./src')
	.destination('./build')
	.use(collections({
		posts: {
			pattern: 'posts/*.md',
			sortBy: 'date',
			reverse: true
		}
	}))
	.use(markdown())
	.use(layouts({
		engine: 'jade',
		moment: moment
	}))
	.use(inPlace({
		engine: 'jade',
		moment: moment
	}))
	.use(beautify({
		'js': false,
		'html' : {
			'wrap_line_length': 80
		}
	}))
	.build(function(err) {
		if(err) {
			console.log(err);
		}
		else {
			console.log('We did it!')
		}
	});
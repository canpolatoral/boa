'use strict';
var generators=require('yeoman-generator');
var yosay = require('yosay');

module.exports= generators.Base.extend({
    
  constructor:function() {
    generators.Base.apply(this,arguments);
        
  },

  prompting:function() {
        
    this.log(yosay('WELCOME! this tool helps you to generate your component'));
    var done = this.async();
    this.prompt([{
      type:'input',
      name:'componentname',
      message:'ENTER YOUR COMPONENT NAME',
    },
    {
      type:'input',
      name:'componentpath',
      message:'ENTER YOUR COMPONENT PATH',
      default:'components'
    },
    {
      type: 'input',
      name: 'componentclassname',
      message: 'ENTER CLASSNAME:initial must be upper case e.g. AkbText'
    }],
        function(answer) {
          if (answer.componentclassname.match(new RegExp('[^a-zA-Z0-9]')) || answer.componentname.match(new RegExp('[^a-zA-Z0-9]'))) {
            this.log(yosay('componentname and componentclassname must not include [^a-zA-Z0-9] characters!! please write again yo kuveytturkcomponent'));
          }

          else {
            this.log(answer);
            this.fs.copyTpl(
                    this.templatePath('_index.js'),
                    this.destinationPath(answer.componentpath + '/' + answer.componentname + '/index.js'),
              {
                componentProps: answer.componentclassname + 'Props',
                componentName: answer.componentname,
                componentClassName: answer.componentclassname
              }

                );
            this.fs.copyTpl(
                this.templatePath('assets/data/_info.json'),
                this.destinationPath(answer.componentpath + '/' + answer.componentname + '/assets/data/info.json'),
              {
                componentName: answer.componentname,
                componentClassName: answer.componentclassname
              }

            );
            this.fs.copyTpl(
               this.templatePath('assets/data/_defaults.json'),
               this.destinationPath(answer.componentpath + '/' + answer.componentname + '/assets/data/defaults.json'),
              {
                componentName: answer.componentname

              }

           );

            this.fs.copyTpl(
                this.templatePath('docs/_doc.js'),
                this.destinationPath(answer.componentpath + '/' + answer.componentname + '/docs/doc.js'),
              {
                componentPage: answer.componentclassname + 'Page',
                componentClassName: answer.componentclassname
              }

            );
            this.fs.copyTpl(
                this.templatePath('docs/_content.json'),
                this.destinationPath(answer.componentpath + '/' + answer.componentname + '/docs/content.json')

              );
            this.fs.copyTpl(
                this.templatePath('test/_spec.js'),
                this.destinationPath(answer.componentpath + '/' + answer.componentname + '/test/spec.js'),
              {
                componentName: answer.componentname,
                componentClassName: answer.componentclassname
              }

            );
            done();
          }
        }.bind(this));
  }
});
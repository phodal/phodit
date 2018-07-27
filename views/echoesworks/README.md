[![Build Status](https://travis-ci.org/phodal/echoesworks.svg?branch=master)](https://travis-ci.org/phodal/echoesworks)
[![Version](http://img.shields.io/npm/v/echoesworks.svg?style=flat)](http://http://img.shields.io/npm/v/echoesworks.svg)
[![Code Climate](https://codeclimate.com/github/phodal/echoesworks/badges/gpa.svg)](https://codeclimate.com/github/phodal/echoesworks)
[![Test Coverage](https://codeclimate.com/github/phodal/echoesworks/badges/coverage.svg)](https://codeclimate.com/github/phodal/echoesworks)
[![npm](https://img.shields.io/npm/dm/echoesworks.svg?style=flat)]()
[![Bower](https://img.shields.io/bower/v/echoesworks.svg?style=flat)]()
[![LICENSE](https://img.shields.io/badge/license-MIT-green.svg?style=flat)]()

![Logo](app/logo_small.png)

[EchoesWorks](http://phodal.github.io/echoesworks/)
===

[![Markdown Improve](https://img.shields.io/badge/markdown--improve-Phodal-blue.svg)](https://github.com/phodal/markdown-improve)

Demo
---

[http://phodal-archive.github.io/echoesworks-demo/](http://phodal-archive.github.io/echoesworks-demo/)

> Next-Generation Tech Blog/Presentation/Slider Framework

zh

> 下一代技术``博客``/``展示``/``幻灯片``框架
 
简介: [EchoesWorks —— 打造下一代技术Blog/Presentation 框架](http://www.phodal.com/blog/build-echoesworks/)
  
### 功能

- 支持 **Markdown**
- **Github**代码显示
- **全屏背景**图片
- 左/右侧图片支持
- 进度条
- 自动播放
- 字幕
- 分屏控制

## Usage

### Clone Demo

    git clone git@github.com:echoesworks/echoesworks-demo.git yourslide

### Setup

1.Install

    bower install echoesworks
    
2.Data

Create ``example.md``: 

    <section>
    ![background](app/background.jpg)
    
    #EchoesWorks
    
    ##Phodal Huang
      
    </section>
    <section>
    
    #Design for Developer
    
    ##EchoesWorks?
    
    ##What is different?
    
    ##What we need?
    </section>
    
Create ``data.json``:
    
    [
      {
        "time": "00:01.00",
        "code": "https://raw.githubusercontent.com/phodal/echoesworks/master/bower.json",
        "word": "hello, world"
      },
      {
        "time": "00:05.00",
        "word": [
          {
            "word": "Привет"
          },
          {
            "word": "Bonjour"
          },
          {
            "word": "こんにちは"
          },
          {
            "word": "你好"
          },
          {
            "word": "Ciao"
          },
          {
            "word": "Hello, World"
          }
        ]
      },
      {
        "time": "00:12.51",
        "code": false,
        "word": "hello, world, 2"
      }]
    
- Markdown Slide
- Data for code & Time Control     
    
3.Code    

     var EW = new EchoesWorks({
     		element: 'slide'
     	});

Example with slide

		EchoesWorks.get('data/example.md', function(data){
				document.querySelector('slide').innerHTML = EchoesWorks.md.parse(data);
				EchoesWorks.imageHandler();
				new EchoesWorks({
					element: 'slide'
				});
			})


##Setup Development##

1.Install devDependencies

     npm install

2.Development

3.Run Test

     npm test
      
4.Push Code & Waiting CI            

## Inspired by & Thanks to

- Slide

    * [https://github.com/markdalgleish/bespoke.js](https://github.com/markdalgleish/bespoke.js)
    * [https://github.com/bartaz/impress.js](https://github.com/bartaz/impress.js)
    * [https://github.com/gajus/swing](https://github.com/gajus/swing)
    * [https://github.com/thebird/Swipe](https://github.com/thebird/Swipe)

- Markdown
    
    * [https://github.com/simonwaldherr/micromarkdown.js/](https://github.com/simonwaldherr/micromarkdown.js/)

- Time 
    
    * [https://github.com/vorg/timeline.js](https://github.com/vorg/timeline.js)

- Process Bar 
 
    * [https://github.com/jacoborus/nanobar](https://github.com/jacoborus/nanobar)

License
---

© 2015 [Phodal Huang](http://www.phodal.com). This code is distributed under the MIT license. See `LICENSE.txt` in this directory.

[待我代码编成，娶你为妻可好](http://www.xuntayizhan.com/blog/ji-ke-ai-qing-zhi-er-shi-dai-wo-dai-ma-bian-cheng-qu-ni-wei-qi-ke-hao-wan/)

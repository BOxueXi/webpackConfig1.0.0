### output出口相关配置（常用的）
```
output: {
	path: path.join(__dirname,'dist'), // 输出文件的位置，必须是一个绝对路径。
	filename: 'bundle.js',// 输出的文件名，值为一个字符串；可以是一个相对路径的字符串，也可以使用占位符
	chunkFilename: '' ,//非入口的chunk的名字
	library: '[name]' ,// 整个库向外面暴露的变量名
	libraryTarget: 'window' //把变量名添加在哪里
}
```
### filename配置项相关占位符
占位符 | 功能描述
-- | --
 [hash]| 每次打包会生成一个hash
[chunkhash]|当前chunk内容的hash
[id]| 当前chunk的id
[query]| filename配置项中的query
[contenthash]|

### publicPath
1. HTML相关
```
// 将publicPaht指定为HTML的相对路径，在请求这些资源是会以当前HTML所在路径加上相对路径，构成实际的请求的url。如： 

// 假设当前的HTML路径为 https://example.com/app/index.html
// 异步加载的资源名为 0.chunk.js
publicPath: '' // 实际路径 https://example.com/app/0.chunk.js
publicPath: './' // 实际路径 https://example.com/app/js/0.chunk.js
publicPath: '../assets' // 实际路径 https://example.com/assets/0.chunk.js
```

2. Host相关
```
// 若publicpath的值以 “/”开始，则代表此时publicPath是以当前页面的host name （主机名）为基础路径的。如： 

// 假设当前的HTML路径为 https://example.com/app/index.html
// 异步加载的资源名为 0.chunk.js
publicPath: '/' // 实际路径 https://example.com/0.chunk.js
publicPath: '/js' // 实际路径 https://example.com/js/0.chunk.js
publicPath: '/dist' // 实际路径 https://example.com/dist/0.chunk.js
```

3. CDN相关
```
// 使用绝对路径的形式配置publicPath。一般是静态资源放在CDN上，由于其域名和当前页面域名不一样，需要以绝对形式进行指定。
// 假设当前的HTML路径为 https://example.com/app/index.html
// 异步加载的资源名为 0.chunk.js
publicPath: 'http://cdn.com/' // 实际路径 http://cdn.com//0.chunk.js
publicPath: 'https://cdn.com/' // 实际路径 https://example.com/js/0.chunk.js
publicPath: '//cdn.com/assets/' // 实际路径 //cdn.com/assets/0.chunk.js

```

###### 为了避免开发环境和生成环境产出不一致而造成开发的困扰，可以将webpack-dev-server的publicPath与output.path保持一致，这样在任何环境下资源输出的目录都是相同的。
```
将webpack-dev-server的publicPath和output的publicPath含义不一样，
webpack-dev-server的publicPath的作用是指定webpack-dev-server的静态资源服务的路径
const path = require('path');
module.exports = {
	context: path.join(__dirname,'/'), //可以理解为资源入口的路径前缀，在配置时必须用绝对路径，可以省略，默认值为当前工程的根目录。(字符串)
	enrty: './src/index.js', //入口
	output: {
		path: path.join(__dirname,'dist'), // 输出文件的位置，必须是一个绝对路径。
		filename: 'bundle.js',// 输出的文件名，字符串
		publicPath: '/' // 用来指定资源的请求位置： 由js或css所请求的间接资源路径（会加上前缀）
	},
	devServer: {
		publicPath: '/dist/'
	}
}
```

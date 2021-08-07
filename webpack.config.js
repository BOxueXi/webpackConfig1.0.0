// webpack 静态模块打包工具,会在内部构建一个依赖图. 通过入口文件,查找依赖,使用loader,plugin进行打包.
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');// 生成html
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//清空文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //提取css为单独文件
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');//配置cdn的方式引入js
const CopyWebpackPlugin = require('copy-webpack-plugin');//拷贝文件
/*
压缩js文件（用其中一个）
uglifyjs-webpack-plugin: 不支持es6语法
terser-webpack-plugin: webpack5以上版本，自带了这个插件，如果使用webpack4,则必须安装
*/
// const TerserWebpackPlugin = require("terser-webpack-plugin");
/*
压缩css（用其中一个）
optimize-css-assets-webpack-plugin： 
css-minimizer-webpack-plugin： 这个插件使用 cssnano 优化和压缩 CSS，在 source maps 和 assets 中使用查询字符串会更加准确，支持缓存和并发模式下运行
*/
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
/*
/*
打包处理html中的图片,比如在html中写 <img src="" />
html-withimg-loader
*/

/*
hash: 代表本次编译。每当编译一次，hash会变，所有的产出资源的hash都是一样
chunkHash: 代码块的hash，一般来说每个entry都会产出一个chunk
contentHash: 跟内容有关
*/
/*
浏览器加前缀
npm i postcss postcss-loader postcss-preset-env -D
安装postcss-preset-env，无需再安装autoprefixer，由于postcss-preset-env已经内置了相关功能。
在rules中使用posscss-loader ,创建postcss.config.js,.browserlistrc文件
*/

/*
js兼容
第一种. babel-loader @babel/core @babel/preset-env : 只能转换基本语法，promise不能转换
第二种. 继续下载 @babel/polyfill: 全部js兼容,但是体积太大
第三种. 继续下载core-js  按需转换

当使用第三种时不能使用第二种
*/
module.exports = {
	/*
		关键字
		source-map: 生成一个map文件,最完整的,文件最大
		eval: 使用eval包含模块代码
		cheap: 不包含列信息
		module: 包含loader的sourceMap
		inline: 不生成单独的map文件，将.map以DataUrl嵌入
	*/
	// devtool: 'source-map',
	// 提供 mode 配置选项，告知 webpack 使用相应环境的内置优化。development,production,none
	mode: 'development',
	//入口文件： 值可以是 字符串，数组，对象
	// entry: './src/main.js',
	entry: {
		index: './src/main.js',
		other: './src/other.js'
	},
	//打包输出目录
	output: {
		path: path.join(__dirname,'dist'), //输出的目录，只能是绝对路径
		filename: 'js/[name].js', //输出的文件名，如果的多页面（多入口）需要使用占位符 [hash],[contenthash]
		publicPath: '/' //根路径
	},
	//webpack-dev-server 会把文件写到内存中，提供速度
	devServer: {
		hit: true,//热更新
		contentBase: path.join(__dirname,'dist'), // 配置开发服务运行时的文件跟目录
		port: 8080, //端口号
		host: 'localhost',//主机
		compress: true ,//是否启动gzip等压缩
		//代理
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				pathRewrite: {
					'^/api': ''
				}
			},
			'/res': {
				target: 'http://localhost:3000',
				pathRewrite: {
					'^/res': ''
				}
			}
		}
	},
	//这里放优化的内容
	optimization: {
		minimize: true,
		//这里放优化的插件
		minimizer: [
			//压缩js
			// new TerserWebpackPlugin({
			// 	parallel: 4, //开启多线程并发压缩
			// 	cache: true // 开启缓存
			// })
			//压缩css
			new CssMinimizerWebpackPlugin()
		],
        /*
        单页应用过程中的代码分割:是通过webpack的写法和内置函数实现的,因为是单页应用，所以只要引用入口文件即可
        目前webpack针对此项功能提供 2 种函数：
        1.import(): 引入之后会自动执行相关js代码
        2.require.ensure(): 引入不会自动执行js代码,需要手动执行相关js代码
        */
        //分割代码块（针对多页面打包,通过webpack配置）
        splitChunks: {
        	cacheGroups: { //缓存组
        		common: { //公共的模块
        			chunks: 'initial',
        			minSize: 0,
        			minChunks:2
        		},
        		//抽离第三方模块
        		vendor: {
        			priority: 1, //优先级，值越大优先级越高 
        			test: /node_modules/,
        			chunks: 'initial',
        			minSize: 0,
        			minChunks: 2
        		}
        	}
        }
	},
	/*
	排除依赖,外部已经引入，不需要打包了 (使用html-webpack-externals-plugin不需要手动引入)
	步骤： 1. 外部引入，如html中 <script src="https://code.jquery.com/jquery-3.1.0.js"></script>
	      2. 在externals 配置，key是包名，value是指定全局变量
		  3.在使用的地方引入 ，比如： import jQuery from 'jquery'
	*/
	// externals: {
	// 	jquery: 'jQuery'
	// },
	/*
	设置模块如何被解析
	设置查找文件路径的规则
	*/
	resolve: {
		extensions: ['.js', '.vue','.json'], //按顺序解析这些后缀名,找到之后就不再往后找
		//别名
		alias: {
			'@': path.join(__dirname,'src')
		}
	},
	/*
	和resolve 对象的属性集合相同，仅用于解析 webpack 的 loader 包
	默认：如下
	*/
	// resolveLoaderL:{
	// 	modules: ['node_modules'],
	// 	extensions: ['.js', '.json'],
	// 	mainFields: ['loader', 'main']
	// },
	module: {
		/*
		不解析模块中的依赖关系（提高打包速度）:  文件中不应该含有 import, require, define 的调用，或任何其他导入机制
		*/
		// noParse: /jquery|lodash/, //不解析模块中的依赖，但会打包
		rules: [
			/*
			处理css
			style-loader: 把css放到style标签里
			css-loader: 处理css文件
			*/
			{
				test: /\.css$/,
				include: path.join(__dirname,'src'),//引入符合条件的模块
				exclude: /node_modules/,//排除符合条件的模块
				// use: ['style-loader','css-loader']
				use: [MiniCssExtractPlugin.loader,'css-loader','postcss-loader']
			},
			/*
			处理图片
			file-loader,
			url-loader: 内置了file-loader
			*/
			{
				test: /\.(jpg|png|gif|jpeg|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: 'imgs/[name]_[hash:8].[ext]', //指定文件名,可以按照目录
							//小于指定值，会base64处理
							limit: 10 * 1024,
							pulicPath: 'imgs',
							// outputPath: 'imgs',// 把图片放到那个目录
						}
					}
				]
			},
			//解析html中通过src引入的
			{
				test: /\.(html|htm)$/,
				loader: 'html-withimg-loader'
			},
			/* 处理scss
				sass-loader依赖于node-sass
			*/
			{
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader,'css-loader','postcss-loader','sass-loader']
			},
			/* 处理less
				less,lsee-loader
			*/
			{
				test: /\.less$/,
				use: [MiniCssExtractPlugin.loader,'css-loader','postcss-loader','less-loader']
			},
			//第一种js兼容(只转换基本语法，Promise等高级语法不能转换)
			{
				test: /\.js/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				//可以使用babel.config.js配置文件
				// options: {
				// 	//预设：指示babel做什么样的兼容性处理
				// 	presets: ['@babel/preset-env']
				// }
			},
			// 第二种： 下载@babel/polyfill ，然后再需要的地方直接引入 import '@babel/polyfill'
			//第三种： 按需加载，下载core-js
			// {
			// 	test: /\.js/,
			// 	exclude: /node_modules/,
			// 	loader: 'babel-loader',
			//可以使用babel.config.js配置文件
			// 	options: {
			// 		//预设：指示babel做什么样的兼容性处理
			// 		presets: [
			// 			[
			// 				'@babel/preset-env',{
			// 					//按需加载
			// 					useBuiltIns: 'usage',
			// 					//指定core-js版本
			// 					corejs: {
			// 						version: 3
			// 					},
			// 					//指定兼容性到哪个浏览器
			// 					targets: {
			// 						chrome: '60',
			// 						firefox: '60',
			// 						ie: '9',
			// 						safari: '10',
			// 						edge: '17'
			// 					}
			// 				}
			// 			]
			// 		]
			// 	}
			// }
		]
	},
	plugins: [
		/*
		防止在 import 或 require 调用时，生成以下正则表达式匹配的模块:
		requestRegExp 匹配(test)资源请求路径的正则表达式。
        contextRegExp （可选）匹配(test)资源上下文（目录）的正则表达式。
        new webpack.IgnorePlugin(requestRegExp, [contextRegExp])
		*/
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		/*
		允许在 编译时 创建配置的全局常量
		*/
		new webpack.DefinePlugin({
			aa: JSON.stringify(124)
		}),
		/*
		给每个打包文件注入内容*/
		// new webpack.BannerPlugin('BannerPlugin插件的使用'),
		/*
		1. 使用ProvidePlugin后会比一直引入减小打包体积吗？
		   不会，还是会打包进去
		2. 使用ProvidePlugin有哪些注意事项？
		   用唯一性高的变量
		3. 注入的ProvidePlugin是一个什么东西？
		     是一个hooks函数。
			 hooks () {
		        return hookCallback.apply(null, arguments);
		     }
			 
		这个插件，会自动向所有的模块注入变量，引用的就是对应模块
		这种注入模块相当于向模块内部注入了一个局部变量 
		（可以在其他地方使用expose-loader允许暴露一个模块（整体或者部分）给全局对象）
		*/
		// new webpack.ProvidePlugin({
		// 	_: 'loadsh'
		// }),
		/*
		 * cdn方式引入js
		 */
		new HtmlWebpackExternalsPlugin({
			externals: [
				{
					module: 'jquery', //模块名
					entry: 'https://code.jquery.com/jquery-3.1.0.js',//cdn路径
					global: 'jQuery' //从全局对象上的哪个属性获取导出的值
				}
			]
		}),
		//拷贝文件
		new CopyWebpackPlugin({
			patterns: [{
				from: path.join(__dirname,'static'),
				to: path.join(__dirname,'dist/static')
			}]
		}),
		//生成html文件
		new HtmlWebpackPlugin({
			template: './src/index.html',// html模板
			filename: 'other.html', //文件名
			hash: true,// 为了避免缓存，文件名后面会添加hash值 ?hash值
			chunks: ['other'], // 指定在html会引入的js(chunk)文件,不设置会引入所有的文件
			chunksSortMode: 'manual', //对引入的代码块进行排序的模式
			chunkFilename: '[id].bundle.js',//它决定(非入口 chunk) 的名称(异步)
		}),
		// new HtmlWebpackPlugin({
		// 	template: './src/index.html',// html模板
		// 	filename: 'index.html', //文件名
		// 	hash: true,// 为了避免缓存，文件名后面会添加hash值 ?hash值
		// 	chunks: ['index'], // 指定在html会引入的js(chunk)文件,不设置会引入所有的文件
		// 	chunksSortMode: 'manual', //对引入的代码块进行排序的模式
		// 	chunkFilename: '[id].bundle.js',//它决定(非入口 chunk) 的名称(异步)
		// }),
		//清空文件
		new CleanWebpackPlugin(),
		//提取css为单独文件
		new MiniCssExtractPlugin({
			filename: 'css/[name]_[contenthash:8].css',//代码块chunk的名字
			chunkFilename: '[id].css' //在异步加载时使用
		}),
		/*
		热更新
		1.在devServer配置hot: true
		2.配置插件： webpack.NamedModulesPlugin()，webpack.HotModulReplacementPlugin()
		3.在要更新的文件中写类似代码:
		if（module.hot）{
			module.hot.accept('要热更新的文件路径',()=>{
				require('要热更新的文件路径')
			})
		}
		*/
		new webpack.NamedModulesPlugin(),//打印更新的模块路径
		new webpack.HotModulReplacementPlugin() //热更新插件
	]
}
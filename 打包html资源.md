### 处理html文件
##### html-webpack-plugin: 默认会创建一个空的html，自动引入打包输出的所有资源（js/css）
```
new HtmlWebpackPlugin({
			template: './src/index.html', //本地模板的路径。
			filename: 'index.html',//输出的文件名（默认为index.html,还可以指定输出的目录,比如：'html/index.html';1.文件目录相对于output.path路径）
			title: 'webpack4',//生成的html文档的标题。(不会替换模板文件中的title元素的内容，除非模板引擎，如：<title>{%= o.htmlWebpackPlugin.options.title %}</title>)
			favicon: '',// 添加指定的favicon路径到输出的html中，和title一样，需要在模板中动态获取设置
			inject:true,// 静态资源的位置：1.true|body: 所有js插入到body元素底部；2. head: 所有js插入到head元素中；3. false:所有资源css和js不会插入到模板中
			hash:false, //是否为所有插入的静态资源添加唯一的hash；比如：<script type="text/javascript" src="common.js?a3e1396b501cdd9041be"></script>
			chunks: ['main'],//允许插入到模板中的chunk(js),默认会将所有的thunk插入
			excludeChunks: [],//与chunks相反,用来配置不允许插入的thunk
			// chunksSortMode:auto,// none|auton|function 默认auto；允许指定的thunk在插入到html文档前进行排序。（function值可以指定具体的排序规则，auto：基于thunk的id进行排序；none:不排序）
			xhtml: false,// 是否渲染link为自闭合标签,true为自闭合标签
			cache:true,// true|false 如果为true表示在对应的thunk文件修改后就会提交文件
			showErrors: true,// true|false 是否将错误信息输出到html页面中
			minify: {
				// https://github.com/kangax/html-minifier#options-quick-reference 对html文件的优化
				removeComments: true, //去除 HTML 注释
				collapseWhitespace: true ,//压缩html
			}
			
		})
```

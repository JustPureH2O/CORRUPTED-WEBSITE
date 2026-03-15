import type { BackgroundWallpaperConfig } from "@/types/config";

export const backgroundWallpaper: BackgroundWallpaperConfig = {
	// 壁纸模式："banner" 横幅壁纸，"overlay" 全屏透明，"none" 纯色背景无壁纸
	mode: "banner",
	// 是否允许用户通过导航栏切换壁纸模式，设为false可提升性能（只渲染当前模式）
	switchable: true,
	/**
	 * 背景图片配置
	 * 图片路径支持三种格式：
	 * 1. public 目录（以 "/" 开头，不优化）："/assets/images/banner.avif"
	 * 2. src 目录（不以 "/" 开头，自动优化但会增加构建时间，推荐）："assets/images/banner.avif"
	 * 3. 远程 URL："https://example.com/banner.jpg"
	 * 注意：远程URL和public目录的图片不会被优化，请确保图片体积足够小以免影响加载速度
	 * 
	 * 建议不要替换d1-d6，m1-m6这些默认示例图片，但你可以删除掉节省空间
	 * 因为以后可能会更换示例图片，导致你自定义的图片被覆盖
	 * 所以建议使用自己的图片的时候命名为其他名称，不要使用d1-d6，m1-m6这些名称
	 * 
	 * 如果只使用一张图片或者使用随机图API，推荐直接使用字符串格式：
	 * desktop: "https://t.alcy.cc/pc",   // 随机图API
	 * desktop: "https://example.com/d1.avif", // 单张图片
	 * 
	 * mobile: "https://t.alcy.cc/mp", // 随机图API
	 * mobile: "https://example.com/m1.avif", // 单张图片
	 * 
	 * 支持配置多张图片（数组），每次刷新页面随机显示一张：
	 * desktop: [
	 * "assets/images/d1.avif",
	 * "assets/images/d2.avif",
	 * ],
	 * 
	 * mobile:[
	 *   "assets/images/m1.avif",
	 *   "assets/images/m2.avif",
	 * ],
	 */
	src: {
		// 桌面背景图片
		desktop: [
			"assets/images/banners/66e6bdb2d9c307b7e9a2a988.jpg",
			"assets/images/banners/65c9e1289f345e8d03167448.png",
			"assets/images/banners/67f108bd0ba3d5a1d7edc049.jpg",
			"assets/images/banners/66a76b76d9c307b7e91171ca.jpg",
			"assets/images/banners/kv2x-42686179.webp",
			"assets/images/banners/roxy.jpg",
			"assets/images/banners/669f9ae5d9c307b7e90432f1.jpg",
			"assets/images/banners/131998699_p0.jpg",
			"assets/images/banners/67ac681ed0e0a243d4fe9a2b.jpg",
			"assets/images/banners/66e6bde8d9c307b7e9a2d572.jpg",
			"assets/images/banners/67256b2cd29ded1a8c25a9bb.jpg",
			"assets/images/banners/chisaki133561429.png",
			"assets/images/banners/117617037.jpg",
			"assets/images/banners/667fc806d9c307b7e947104d.jpg",
			"assets/images/banners/66a86012d9c307b7e9bdc16e.jpg",
			"assets/images/banners/661fa9270ea9cb14035f9810.png",
			"assets/images/banners/6788cbf8d0e0a243d4f4d409.jpg",
			"assets/images/banners/138383607.jpg",
			"assets/images/banners/127405397.jpg",
			"assets/images/banners/133242321_p0.jpg",
			"assets/images/banners/661faf180ea9cb140394b7ad.jpg",
			"assets/images/banners/6648a851d9c307b7e9dc3e75.jpg",
			"assets/images/banners/67f0950f0ba3d5a1d7ed88e2.jpg",
			"assets/images/banners/6607c8cc9f345e8d03c37157.jpg",
			"assets/images/banners/ku9625_nahida.jpg",
			"assets/images/banners/66e56c92d9c307b7e904e723.jpg",
			"assets/images/banners/130954879.jpg",
			"assets/images/banners/6698f45fd9c307b7e9ab0dc1.jpg",
			"assets/images/banners/65c9e1cb9f345e8d031859ff.jpg",
			"assets/images/banners/138265433.jpg",
			"assets/images/banners/rosmontis.jpg",
			"assets/images/banners/661fb46f0ea9cb1403c64433.jpg",
			"assets/images/banners/122436164_p0.png",
			"assets/images/banners/67f108bc0ba3d5a1d7edc048.jpg",
			"assets/images/banners/firefly119791514.jpg",
			"assets/images/banners/133788805.png",
			"assets/images/banners/6660636a5e6d1bfa05cbd819.png",
			"assets/images/banners/ku9625_hoshino.jpg",
			"assets/images/banners/129850582_p0.jpg",
			"assets/images/banners/65f5a7c69f345e8d03960250.jpg",
			"assets/images/banners/6607b08a9f345e8d032c0e91.jpg",
			"assets/images/banners/129339284.jpg",
			"assets/images/banners/66e6bdb3d9c307b7e9a2aa2a.jpg",
			"assets/images/banners/130023460.jpg",
			"assets/images/banners/66e6bdb2d9c307b7e9a2a9c9.jpg",
			"assets/images/banners/65f64e899f345e8d03453850.jpg",
			"assets/images/banners/662b8dff0ea9cb14033252a6.jpg",
			"assets/images/banners/65f5a7c59f345e8d0395ff6d.jpg",
			"assets/images/banners/135672846.jpg",
			"assets/images/banners/662b8dff0ea9cb1403325250.jpg",
			"assets/images/banners/66a60443d9c307b7e99d4fd8.jpg",
			"assets/images/banners/67f108bc0ba3d5a1d7edc047.jpg",
			"assets/images/banners/678a4727d0e0a243d4f5421a.jpg",
			"assets/images/banners/669f4bbad9c307b7e9b67314.jpg",
			"assets/images/banners/6697b1f5d9c307b7e9659618.jpg",
			"assets/images/banners/678a4727d0e0a243d4f5421b.jpg",
			"assets/images/banners/65f5acc59f345e8d03bdfcf6.jpg",
			"assets/images/banners/66406ca80ea9cb1403e3c8d7.png",
			"assets/images/banners/661fb4640ea9cb1403c5d0df.jpg",
			"assets/images/banners/67e7570b0ba3d5a1d7e5d5ea.jpg",
			"assets/images/banners/ku9625_oc.jpg",
			"assets/images/banners/662b8dff0ea9cb1403325348.jpg",
			"assets/images/banners/680790b7ed61a.jpg",
			"assets/images/banners/129569932.jpg",
			"assets/images/banners/67fa01a088c538a9b5cbc84f.jpg",
			"assets/images/banners/66d50e4ed9c307b7e957adf2.jpg",
			"assets/images/banners/662b8e430ea9cb140332e110.jpg",
			"assets/images/banners/6698f45fd9c307b7e9ab0dfb.jpg",
			"assets/images/banners/667fc806d9c307b7e9470fff.jpg",
			"assets/images/banners/662b8dfe0ea9cb14033250b5.jpg",
			"assets/images/banners/135867929.jpg",
			"assets/images/banners/6610c34568eb93571349895c.jpg",
			"assets/images/banners/137681021.jpg",
			"assets/images/banners/669f4b7cd9c307b7e9b63430.jpg",
			"assets/images/banners/66698e02d9c307b7e9ff3241.jpg",
			"assets/images/banners/130271925.jpg",
			"assets/images/banners/102017273_p0.jpg",
			"assets/images/banners/138016349.jpg",
			"assets/images/banners/680c289739d6b.jpg",
			"assets/images/banners/662b8dfe0ea9cb140332519d.jpg"
		],
		// 移动背景图片
		mobile: [
			"assets/images/banners/669bb3b6d9c307b7e98bb671.jpg",
			"assets/images/banners/669f4b7cd9c307b7e9b633e9.jpg",
			"assets/images/banners/66a464d6d9c307b7e9427508.jpg",
			"assets/images/banners/66a464d6d9c307b7e942754e.png",
			"assets/images/banners/672c9433d29ded1a8c1222a5.jpg",
			"assets/images/banners/673dd9f5d29ded1a8c0506f8.png",
			"assets/images/banners/67f095920ba3d5a1d7ed88f6.jpg",
			"assets/images/banners/67f095920ba3d5a1d7ed88f5.jpg",
			"assets/images/banners/134842461.jpg",
			"assets/images/banners/137493114.jpg",
			"assets/images/banners/132289312.jpg",
			"assets/images/banners/119367678.jpg",
			"assets/images/banners/rosmontis-nurse.jpg",
			"assets/images/banners/firefly.jpg",
			"assets/images/banners/138638248.jpg",
			"assets/images/banners/131915161.jpg",
			"assets/images/banners/118358767.jpg"
		],
	},
	// Banner模式特有配置
	banner: {
		// 图片位置
		// 支持所有CSS object-position值，如: 'top', 'center', 'bottom', 'left top', 'right bottom', '25% 75%', '10px 20px'..
		// 如果不知道怎么配置百分百之类的配置，推荐直接使用：'center'居中，'top'顶部居中，'bottom' 底部居中，'left'左侧居中，'right'右侧居中
		position: "0% 20%",

		// 主页横幅文字
		homeText: {
			// 是否启用主页横幅文字
			enable: true,
			// 主页横幅主标题（支持 html 标签）
			title: `JustPure<b><span style="color:#0080c0">H</span><sub style="color:#ff9800">2</sub><span style="color:#0080c0">O</span></b>`,
			// 主页横幅主标题字体大小
			titleSize: "3.8rem",
			// 主页横幅副标题
			subtitle: [
				"穷方圆平直之情，尽规矩准绳之用"
			],
			// 主页横幅副标题字体大小
			subtitleSize: "1.5rem",
			typewriter: {
				// 是否启用打字机效果
				// 打字机开启 → 循环显示所有副标题
				// 打字机关闭 → 每次刷新随机显示一条副标题
				enable: false,
				// 打字速度（毫秒）
				speed: 100,
				// 删除速度（毫秒）
				deleteSpeed: 50,
				// 完全显示后的暂停时间（毫秒）
				pauseTime: 2000,
			},
		},
		// 图片来源
		credit: {
			enable: {
				// 桌面端显示横幅图片来源文本
				desktop: true,
				// 移动端显示横幅图片来源文本
				mobile: true,
			},
			text: {
				// 桌面端要显示的来源文本
				desktop: "桌面端 Banners",
				// 移动端要显示的来源文本
				mobile: "移动端 Banners",
			},
			url: {
				// 桌面端原始艺术品或艺术家页面的 URL 链接
				desktop: "",
				// 移动端原始艺术品或艺术家页面的 URL 链接
				mobile: "",
			},
		},
		// 横幅导航栏配置
		navbar: {
			// 横幅导航栏透明模式："semi" 半透明，"full" 完全透明，"semifull" 动态透明
			transparentMode: "semifull",
			// 是否开启毛玻璃模糊效果，开启可能会影响页面性能，如果不开启则是半透明，请根据自己的喜好开启
			enableBlur: true,
			// 毛玻璃模糊度
			blur: 3,
		},
		// 波浪动画效果配置，开启可能会影响页面性能，请根据自己的喜好开启
		waves: {
			enable: {
				// 桌面端是否启用波浪动画效果
				desktop: false,
				// 移动端是否启用波浪动画效果
				mobile: false,
			},
		},
	},
	// 全屏透明覆盖模式特有配置
	overlay: {
		// 层级，确保壁纸在背景层
		zIndex: -1,
		// 壁纸透明度
		opacity: 0.8,
		// 背景模糊程度
		blur: 1,
	},
};

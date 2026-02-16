(() => {
  const letter = {
    title: "一封小信",
    paragraphs: [
      "鑫鑫，新年快乐呀。",
      "愿你在新的日子里，多喜乐，也多多喜欢我呀，嘿嘿。",
      "在新的一年，我们一起去看远方的山海呀。"
    ],
    sign: "— 来自长风"
  };

  const photos = [
    { src: "./assets/photos/photo-01.jpg", alt: "合照 1" },
    { src: "./assets/photos/photo-02.jpg", alt: "合照 2" },
    { src: "./assets/photos/photo-03.jpg", alt: "合照 3" },
    { src: "./assets/photos/photo-04.jpg", alt: "合照 4" },
    { src: "./assets/photos/photo-05.jpg", alt: "合照 5" },
    { src: "./assets/photos/photo-06.jpg", alt: "合照 6" }
  ];

  const timeline = [
    { time: "01/01", title: "开场白", desc: "把“新年快乐”说得更认真一点。" },
    { time: "01/07", title: "小确幸", desc: "哪怕只是一起吃顿饭，也值得记下来。" },
    { time: "02/14", title: "偏爱", desc: "你一笑，我就开始心软。" },
    { time: "03/21", title: "春天", desc: "我们把日子过成了会发光的样子。" },
    { time: "06/08", title: "并肩", desc: "不需要一直很强，但可以一直在一起。" },
    { time: "09/30", title: "靠近", desc: "路再远，也想和你同频。" },
    { time: "12/31", title: "收尾", desc: "把这一年打包，留一份给未来的我们。" }
  ];

  const quotes = [
    "今天也要把自己照顾好，其他的慢慢来。",
    "你不需要完美，只需要真实。",
    "愿你一直被温柔以待，也有勇气做自己。",
    "别急，花会沿途开，风会把你带到对的地方。",
    "你已经很棒了，剩下的交给时间。",
    "愿你有盔甲，也有软肋；有锋芒，也有余温。",
    "把心放在更轻的地方，日子就会更亮。",
    "我们不必赶路，走在一起就好。"
  ];

  window.NEW_YEAR_GIFT_CONTENT = { letter, photos, timeline, quotes };
})();

// 模块1: 创建音频上下文
// 1.1 创建一个新的音频上下文实例，用于处理音频播放
const audioContext = new AudioContext();

// 模块2: 定义音符详细信息
// 2.1 定义一个包含音符、键盘按键、频率和活动状态的数组
const NOTE_DETAILS = [
  { note: "C", key: "Z", frequency: 261.626, active: false },
  { note: "Db", key: "S", frequency: 277.183, active: false },
  { note: "D", key: "X", frequency: 293.665, active: false },
  { note: "Eb", key: "D", frequency: 311.127, active: false },
  { note: "E", key: "C", frequency: 329.628, active: false },
  { note: "F", key: "V", frequency: 349.228, active: false },
  { note: "Gb", key: "G", frequency: 369.994, active: false },
  { note: "G", key: "B", frequency: 391.995, active: false },
  { note: "Ab", key: "H", frequency: 415.305, active: false },
  { note: "A", key: "N", frequency: 440, active: false },
  { note: "Bb", key: "J", frequency: 466.164, active: false },
  { note: "B", key: "M", frequency: 493.883, active: false }
];

// 模块3: 键盘按下事件监听器
// 3.1 监听键盘按下事件，防止重复按键，获取按键信息并播放音符
document.addEventListener("keydown", e => {
  if (e.repeat) return; // 防止重复按键
  const keyboardKey = e.code; // 获取按键代码
  const noteDetail = getNoteDetail(keyboardKey); // 获取对应的音符详细信息

  if (noteDetail == null) return; // 如果未找到对应音符，则返回

  noteDetail.active = true; // 设置音符为活动状态
  playNotes(); // 播放音符
});

// 模块4: 键盘释放事件监听器
// 4.1 监听键盘释放事件，获取按键信息并停止播放音符
document.addEventListener("keyup", e => {
  const keyboardKey = e.code; // 获取按键代码
  const noteDetail = getNoteDetail(keyboardKey); // 获取对应的音符详细信息

  if (noteDetail == null) return; // 如果未找到对应音符，则返回

  noteDetail.active = false; // 设置音符为非活动状态
  playNotes(); // 停止播放音符
});

// 模块5: 获取音符详细信息的函数
// 5.1 根据键盘按键代码查找对应的音符详细信息
function getNoteDetail(keyboardKey) {
  return NOTE_DETAILS.find(n => `Key${n.key}` === keyboardKey); // 查找并返回对应的音符详细信息
}

// 模块6: 播放音符的函数
// 6.1 根据音符的活动状态播放或停止音符
function playNotes() {
  NOTE_DETAILS.forEach(n => {
    const keyElement = document.querySelector(`[data-note="${n.note}"]`); // 获取对应的键元素
    keyElement.classList.toggle("active", n.active); // 切换键元素的活动状态
    if (n.oscillator != null) {
      n.oscillator.stop(); // 停止振荡器
      n.oscillator.disconnect(); // 断开振荡器连接
    }
  });

  const activeNotes = NOTE_DETAILS.filter(n => n.active); // 获取所有活动音符
  const gain = 1 / activeNotes.length; // 计算增益值
  activeNotes.forEach(n => {
    startNote(n, gain); // 开始播放音符
  });
}

// 模块7: 开始播放音符的函数
// 7.1 创建振荡器和增益节点，设置频率和增益，连接并开始播放音符
function startNote(noteDetail, gain) {
  const gainNode = audioContext.createGain(); // 创建增益节点
  gainNode.gain.value = gain; // 设置增益值
  const oscillator = audioContext.createOscillator(); // 创建振荡器
  oscillator.frequency.value = noteDetail.frequency; // 设置频率
  oscillator.type = "sine"; // 设置波形类型
  oscillator.connect(gainNode).connect(audioContext.destination); // 连接振荡器和增益节点到音频上下文
  oscillator.start(); // 开始播放音符
  noteDetail.oscillator = oscillator; // 保存振荡器实例
}
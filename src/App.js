
import { useEffect, useState } from 'react';

const memoryKey = 'fate_memory_storage';
const fatePointKey = 'fate_point';

const worlds = [
  {
    id: 'ghost_home',
    name: '归骨之宅',
    tags: ['灵异', '低污染'],
    requireMinFate: 0,
    fateEchoTriggers: [],
    summary: '灵异副本，主角记忆混乱，逐步追查过去身份。'
  },
  {
    id: 'after_lab',
    name: '断层都市',
    tags: ['科技崩坏', '高污染'],
    requireMinFate: 10,
    fateEchoTriggers: ['zhang_saved'],
    summary: '张博士事件后的裂隙城市，你面临其家属的愤怒。'
  },
  {
    id: 'temple_of_loop',
    name: '轮回神殿',
    tags: ['哲学分裂', '命运扭曲'],
    requireMinFate: 15,
    fateEchoTriggers: [],
    summary: '你不断被送回过去，是否能逃出这场因果困局？'
  }
];

export default function App() {
  const [memory, setMemory] = useState([]);
  const [fatePoint, setFatePoint] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const mem = JSON.parse(localStorage.getItem(memoryKey) || '[]');
    const fp = parseInt(localStorage.getItem(fatePointKey) || '0');
    setMemory(mem);
    setFatePoint(fp);

    const filtered = worlds.filter(w => {
      if (w.requireMinFate > fp) return false;
      if (w.fateEchoTriggers.length === 0) return true;
      return w.fateEchoTriggers.some(tag => mem.includes(tag));
    });

    const shuffled = filtered.sort(() => Math.random() - 0.5).slice(0, 3);
    setCandidates(shuffled);
    setSelected(shuffled[Math.floor(Math.random() * shuffled.length)]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white p-6 font-mono">
      <div className="border border-purple-500 shadow-2xl rounded-xl p-6 bg-black/30 backdrop-blur-lg">
        <h1 className="text-3xl font-bold mb-6 tracking-wider text-purple-400 drop-shadow">命运裂隙调度中...</h1>
        <p className="mb-4 text-gray-400 text-sm">主神正在根据你过往行为、命运回响、成长轨迹决定下一个副本世界。</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {candidates.map((w, idx) => (
            <div
              key={w.id}
              className={\`p-4 rounded border \${w.id === selected?.id ? 'border-yellow-400 bg-yellow-500/10' : 'border-gray-700 bg-gray-800'}\`}
            >
              <h2 className="text-lg font-bold mb-1 text-purple-300">{w.name}</h2>
              <div className="text-xs text-gray-400 mb-1">Tags: {w.tags.join(', ')}</div>
              <p className="text-sm text-gray-200">{w.summary}</p>
            </div>
          ))}
        </div>

        {selected && (
          <div className="mt-6 p-4 bg-purple-900/30 border border-purple-700 rounded">
            <p className="text-sm text-purple-300">命运推荐副本：</p>
            <h2 className="text-xl font-bold text-yellow-300 mb-2">{selected.name}</h2>
            <p className="text-gray-300">你即将穿越至该世界... 请做好准备。</p>
          </div>
        )}
      </div>
    </div>
  );
}

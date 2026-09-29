'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function ValueCell({ children, best = false }: { children: string; best?: boolean }) {
  return <TableCell className={`text-right${best ? ' result-best-value' : ''}`}>{children}</TableCell>;
}

type NuScenesRow = { method: string; rl: boolean; values: string[]; ours?: boolean; best?: number[] };
type InHouseRow = { planner: string; training: string; values: string[]; ours?: boolean; best?: number[] };

const nuscenesRows: NuScenesRow[] = [
  { method: 'ST-P3', rl: false, values: ['0.23', '0.62', '0.43', '268', '557', '0.397', '0.425', '0.387', '0.341'] },
  { method: 'VAD', rl: false, values: ['0.07', '0.17', '0.12', '820', '824', '0.255', '0.681', '0.418', '0.271'], best: [7] },
  { method: 'UniAD', rl: false, values: ['0.62', '0.58', '0.60', '348', '870', '0.408', '0.805', '0.415', '0.430'] },
  { method: 'CLEAR‡', rl: true, values: ['0.11', '0.23', '0.17', '—', '—', '—', '—', '—', '—'] },
  { method: 'Drive-r1‡', rl: true, values: ['0.02', '0.06', '0.04', '—', '—', '—', '—', '—', '—'] },
  { method: 'DiffusionDrive', rl: false, values: ['0.068', '0.073', '0.070', '266', '772', '0.694', '0.866', '0.392', '0.526'] },
  { method: 'DiffusionDrive + RoXDrive', rl: true, ours: true, values: ['0.029', '0.063', '0.046', '189', '562', '0.717', '0.883', '0.380', '0.588'], best: [3, 4] },
  { method: 'SparseDrive', rl: false, values: ['0.000', '0.044', '0.022', '197', '623', '0.716', '0.891', '0.384', '0.580'], best: [0] },
  { method: 'SparseDrive + RoXDrive', rl: true, ours: true, values: ['0.000', '0.015', '0.007', '173', '598', '0.775', '0.922', '0.388', '0.622'], best: [0, 1, 2, 5, 6, 8] },
];

const inhouseRows: InHouseRow[] = [
  { planner: 'Gemma-3-4B', training: 'Imitation-only', values: ['328', '171', '0.938', '0.952', '0.521', '0.371'], best: [2, 3] },
  { planner: 'Gemma-3-4B', training: '+ RoXDrive', ours: true, values: ['198', '127', '0.865', '0.940', '0.539', '0.540'], best: [0, 1, 4, 5] },
  { planner: 'Qwen2.5-VL-3B', training: 'Imitation-only', values: ['331', '141', '0.945', '0.911', '0.538', '0.394'], best: [2] },
  { planner: 'Qwen2.5-VL-3B', training: '+ RoXDrive', ours: true, values: ['206', '107', '0.883', '0.936', '0.547', '0.559'], best: [0, 1, 3, 4, 5] },
  { planner: 'Qwen3-VL-2B', training: 'Imitation-only', values: ['242', '162', '0.884', '0.938', '0.527', '0.450'], best: [2] },
  { planner: 'Qwen3-VL-2B', training: '+ RoXDrive', ours: true, values: ['174', '94', '0.878', '0.957', '0.542', '0.608'], best: [0, 1, 3, 4, 5] },
];

export function QuantitativeResults() {
  return (
    <Tabs className="quantitative-results" defaultValue="nuscenes">
      <TabsList className="video-tabs quantitative-tabs" aria-label="Choose a quantitative result table">
        <TabsTrigger value="nuscenes">nuScenes Results</TabsTrigger>
        <TabsTrigger value="inhouse">In-House Driving Results</TabsTrigger>
        <TabsTrigger value="inverse-dynamics">Inverse Dynamics Evaluation</TabsTrigger>
        <TabsTrigger value="action-following">World-Model Action Following</TabsTrigger>
      </TabsList>

      <TabsContent value="nuscenes" className="quantitative-panel">
        <p className="quantitative-caption">Open-loop collision rates (2 s) and closed-loop evaluation on 4,675 nuScenes clips (4 s, two action steps).</p>
        <div className="quantitative-table">
          <Table className="nuscenes-results-table" aria-label="Complete nuScenes open-loop and closed-loop results">
            <TableHeader><TableRow>
              <TableHead>Method</TableHead><TableHead className="text-center">RL</TableHead>
              <TableHead className="text-right">Col. 1s ↓</TableHead><TableHead className="text-right">Col. 2s ↓</TableHead><TableHead className="text-right">Col. Avg. ↓</TableHead>
              <TableHead className="text-right">Obj. Col. ↓</TableHead><TableHead className="text-right">Lane Viol. ↓</TableHead>
              <TableHead className="text-right">Progress ↑</TableHead><TableHead className="text-right">Comfort ↑</TableHead><TableHead className="text-right">Clearance ↑</TableHead><TableHead className="text-right">Driving Score ↑</TableHead>
            </TableRow></TableHeader>
            <TableBody>{nuscenesRows.map((row) => (
              <TableRow key={row.method} className={row.ours ? 'result-best-row' : undefined}>
                <TableCell>{row.method}</TableCell><TableCell className="text-center">{row.rl ? '✓' : '×'}</TableCell>
                {row.values.map((value, index) => <ValueCell key={index} best={row.best?.includes(index)}>{value}</ValueCell>)}
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="inhouse" className="quantitative-panel">
        <p className="quantitative-caption">Closed-loop evaluation on 1,000 in-house test scenes (80 frames at 12 Hz).</p>
        <div className="quantitative-table">
          <Table className="inhouse-results-table" aria-label="Complete in-house closed-loop results">
            <TableHeader><TableRow>
              <TableHead>Planner (10 actions)</TableHead><TableHead>Training</TableHead>
              <TableHead className="text-right">Obj. Col. ↓</TableHead><TableHead className="text-right">Lane Viol. ↓</TableHead>
              <TableHead className="text-right">Progress ↑</TableHead><TableHead className="text-right">Comfort ↑</TableHead><TableHead className="text-right">Centering ↑</TableHead><TableHead className="text-right">DS ↑</TableHead>
            </TableRow></TableHeader>
            <TableBody>{inhouseRows.map((row) => (
              <TableRow key={`${row.planner}-${row.training}`} className={row.ours ? 'result-best-row' : undefined}>
                <TableCell>{row.planner}</TableCell><TableCell>{row.training}</TableCell>
                {row.values.map((value, index) => <ValueCell key={index} best={row.best?.includes(index)}>{value}</ValueCell>)}
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="inverse-dynamics" className="quantitative-panel">
        <div className="quantitative-table">
          <Table className="inverse-dynamics-table" aria-label="Inverse dynamics evaluation on the nuScenes validation set">
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">3s ADE ↓</TableHead>
                <TableHead className="text-right">6s ADE ↓</TableHead>
                <TableHead className="text-right">6s FDE ↓</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Cosmos3-Nano</TableCell>
                <ValueCell>8.77</ValueCell><ValueCell>15.07</ValueCell><ValueCell>30.11</ValueCell>
              </TableRow>
              <TableRow>
                <TableCell>GenAD‡</TableCell>
                <ValueCell>0.90</ValueCell><ValueCell>—</ValueCell><ValueCell>—</ValueCell>
              </TableRow>
              <TableRow>
                <TableCell>Cosmos3-Nano Fine-Tuning</TableCell>
                <ValueCell>0.67</ValueCell><ValueCell>1.27</ValueCell><ValueCell>2.67</ValueCell>
              </TableRow>
              <TableRow className="result-best-row">
                <TableCell>RoXDrive (Our AVFE)</TableCell>
                <ValueCell best>0.52</ValueCell><ValueCell best>0.95</ValueCell><ValueCell best>2.00</ValueCell>
              </TableRow>
              <TableRow className="result-group-row">
                <TableCell colSpan={4}>With Strict-SE(2)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cosmos3-Nano</TableCell>
                <ValueCell>8.82</ValueCell><ValueCell>15.36</ValueCell><ValueCell>31.27</ValueCell>
              </TableRow>
              <TableRow>
                <TableCell>Cosmos3-Nano Fine-Tuning</TableCell>
                <ValueCell>0.66</ValueCell><ValueCell>1.24</ValueCell><ValueCell>2.59</ValueCell>
              </TableRow>
              <TableRow className="result-best-row">
                <TableCell>RoXDrive (Our AVFE)</TableCell>
                <ValueCell best>0.51</ValueCell><ValueCell best>0.93</ValueCell><ValueCell best>1.92</ValueCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="action-following" className="quantitative-panel">
        <div className="quantitative-table">
          <Table className="action-following-table" aria-label="Action-following evaluation of world models on nuScenes validation scenes">
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>Bid./Cau.</TableHead>
                <TableHead className="text-center">Fine-Tuning</TableHead>
                <TableHead className="text-right">SE(2) ADE (m) ↓</TableHead>
                <TableHead className="text-right">SE(2) FDE (m) ↓</TableHead>
                <TableHead className="text-right">Rot. Mean (°) ↓</TableHead>
                <TableHead className="text-right">Rot. Final (°) ↓</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>GT Video</TableCell><TableCell>—</TableCell><TableCell className="text-center">—</TableCell>
                <ValueCell>0.92</ValueCell><ValueCell>1.92</ValueCell><ValueCell>1.37</ValueCell><ValueCell>2.04</ValueCell>
              </TableRow>
              <TableRow>
                <TableCell>Cosmos3-Nano</TableCell><TableCell>Bid.</TableCell><TableCell className="text-center"><span className="result-cross" aria-label="No">×</span></TableCell>
                <ValueCell>4.85</ValueCell><ValueCell>9.84</ValueCell><ValueCell>3.22</ValueCell><ValueCell>4.86</ValueCell>
              </TableRow>
              <TableRow>
                <TableCell>Vista</TableCell><TableCell>Cau.</TableCell><TableCell className="text-center"><span className="result-check" aria-label="Yes">✓</span></TableCell>
                <ValueCell>4.19</ValueCell><ValueCell>8.03</ValueCell><ValueCell>4.63</ValueCell><ValueCell>7.34</ValueCell>
              </TableRow>
              <TableRow>
                <TableCell>Epona</TableCell><TableCell>Cau.</TableCell><TableCell className="text-center"><span className="result-check" aria-label="Yes">✓</span></TableCell>
                <ValueCell>2.50</ValueCell><ValueCell>4.72</ValueCell><ValueCell>2.05</ValueCell><ValueCell>3.26</ValueCell>
              </TableRow>
              <TableRow className="result-best-row">
                <TableCell>X-World</TableCell><TableCell>Cau.</TableCell><TableCell className="text-center"><span className="result-check" aria-label="Yes">✓</span></TableCell>
                <ValueCell best>1.11</ValueCell><ValueCell best>2.18</ValueCell><ValueCell best>1.77</ValueCell><ValueCell best>2.94</ValueCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  );
}

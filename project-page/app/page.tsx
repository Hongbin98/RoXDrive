import type { ReactNode } from 'react';
import Image from 'next/image';
import {
  BookOpen,
  Code2,
  ExternalLink,
} from 'lucide-react';
import { QuantitativeResults } from '@/components/quantitative-results';
import { VideoGallery } from '@/components/video-gallery';
import { sitePath } from '@/lib/site-path';

export const dynamic = 'force-static';

const authors = [
  { name: 'Hongbin Lin', affiliation: 1 },
  { name: 'Chaoda Zheng', affiliation: 2 },
  { name: 'Yiming Yang', affiliation: 1 },
  { name: 'Xiangyu Li', affiliation: 2 },
  { name: 'Shijia Chen', affiliation: 2 },
  { name: 'Jinhao Deng', affiliation: 2 },
  { name: 'Kangjie Chen', affiliation: 2 },
  { name: 'Dongbin Zhang', affiliation: 2 },
  { name: 'Jie Feng', affiliation: 3 },
  { name: 'Yu Zhang', affiliation: 2 },
  { name: 'Xianming Liu', affiliation: 2 },
  { name: 'Shuguang Cui', affiliation: 1 },
  { name: 'Boyang Wang', affiliation: 2 },
  { name: 'Zhen Li', affiliation: 1 },
];

const bibtex = [
  '@misc{lin2026roxdrive,',
  '  title     = {RoXDrive: Closed-Loop Reinforcement Learning for End-to-End Autonomous Driving via Action-Faithful Rollouts},',
  `  author    = {${authors.map((author) => author.name).join(' and ')}},`,
  '  year      = {2026}',
  '}',
].join('\n');

export default function Home() {
  return (
    <main>
      <header className="project-cover" id="top">
        <div className="cover-glow cover-glow-blue" />
        <div className="cover-glow cover-glow-green" />
        <div className="page-shell cover-content">
          <h1 className="paper-title">
            <span className="title-main">RoXDrive</span>: Closed-Loop Reinforcement Learning for
            End-to-End Autonomous Driving via{' '}
            <span className="title-nowrap">
              <span className="title-action">Action-Faithful</span>{' '}
              <span className="title-rollout">Rollouts</span>
            </span>
          </h1>
          <div className="cover-rule" />
          <div className="authors" aria-label="Authors">
            {[authors.slice(0, 7), authors.slice(7)].map((row, rowIndex) => (
              <div className="author-row" key={row[0].name}>
                {row.map((author, index) => (
                  <span key={author.name}>
                    {author.name}<sup>{author.affiliation}</sup>
                    {(index < row.length - 1 || rowIndex === 0) && <span aria-hidden="true">,&nbsp;</span>}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="affiliations" aria-label="Author affiliations">
            <span><sup>1</sup> The Chinese University of Hong Kong Shenzhen (<a href="https://cuhk.edu.cn/">cuhk.edu.cn</a>)</span>
            <span><sup>2</sup> XPeng Motors (<a href="https://www.xpeng.com/">xpeng.com</a>)</span>
            <span><sup>3</sup> Xi&apos;an University of Electronic Science and Technology (<a href="https://www.xidian.edu.cn/">xidian.edu.cn</a>)</span>
          </div>
          <div className="resource-row">
            <a className="resource-button" href="https://arxiv.org/abs/2609.36851" target="_blank" rel="noreferrer">
              <BookOpen size={16} /><span>Paper</span><ExternalLink size={13} />
            </a>
            <a className="resource-button" href="https://github.com/Hongbin98/RoXDrive" target="_blank" rel="noreferrer">
              <Code2 size={16} /><span>Code</span><ExternalLink size={13} />
            </a>
          </div>
          <nav className="section-nav" aria-label="Page sections">
            <a href="#demo">Demo</a><a href="#visualization">Visualization</a><a href="#motivation">Motivation</a>
            <a href="#method">Method</a><a href="#results">Results</a>
          </nav>
        </div>
      </header>

      <div className="page-shell content-stack">
        <SectionCard id="demo" title="RoXDrive Demo">
          <figure className="overview-demo">
            <video controls autoPlay muted playsInline loop preload="metadata" aria-label="RoXDrive supplementary overview demo">
              <source src={`${sitePath('/videos/RoXDrive_demo.mp4')}?v=20260929-progress`} type="video/mp4" />
            </video>
          </figure>
          <p className="demo-note">For efficient web delivery, these videos use the compressed versions.</p>
        </SectionCard>

        <SectionCard id="visualization" title="Qualitative Visualization">
          <VideoGallery />
        </SectionCard>

        <SectionCard id="tldr" title="TL;DR">
          <p className="tldr-intro">
            We introduce <strong className="title-main">RoXDrive</strong>, a plug-and-play closed-loop RL framework that enables reliable policy optimization through <strong className="highlight-green">action-faithful world-model rollouts</strong>. RoXDrive consists of two stages:
          </p>
          <ol className="tldr-stages">
            <li>
              <span className="stage-number stage-blue">1</span>
              <div>
                <h3><strong className="highlight-blue">Model pre-training</strong></h3>
                <p>Alongside imitation pre-training, the <strong className="highlight-purple">Action-Vision Faithfulness Evaluator</strong> uses <strong className="highlight-orange">geometry-aware trajectory supervision</strong> to verify long-horizon action-vision consistency.</p>
              </div>
            </li>
            <li>
              <span className="stage-number stage-green">2</span>
              <div>
                <h3><strong className="highlight-green">Action-faithful RL post-training</strong></h3>
                <p>With a <strong>fixed world model</strong>, only <strong className="highlight-blue">action-faithful long-horizon rollouts</strong> receive <strong className="highlight-orange">dense safety-aware scoring</strong> for <strong className="highlight-purple">scene-level closed-loop RL</strong>.</p>
              </div>
            </li>
          </ol>
          <figure className="tldr-figure">
            <Image
              src={sitePath('/roxdrive-paradigm.png')}
              alt="Comparison of conventional simulator-based reinforcement learning, vanilla multi-step world-model rollouts, and RoXDrive action-faithful closed-loop reinforcement learning"
              width={2111}
              height={1114}
              sizes="(max-width: 1152px) calc(100vw - 64px), 1060px"
            />
            <figcaption>RoXDrive selects realistic, long-horizon, action-faithful rollouts for dense safety-aware scoring and scene-level policy optimization.</figcaption>
          </figure>
        </SectionCard>

        <SectionCard id="motivation" title="Motivation">
          <div className="motivation-copy">
            <p><strong className="highlight-blue">Video world models</strong> are promising scalable simulators for closed-loop policy learning, but visual realism alone does not guarantee that future observations causally follow the policy&apos;s ego actions.</p>
            <p className="motivation-summary">Fine-tuning only marginally reduces relative-motion errors; small inverse-dynamics inaccuracies still accumulate into <strong className="highlight-orange">jitter</strong> and <strong className="highlight-purple">long-horizon drift</strong>, making rollouts unreliable for policy optimization.</p>
          </div>
          <figure className="motivation-figure">
            <Image
              src={sitePath('/roxdrive-motivation.png')}
              alt="Motivation examples showing accumulated jitter errors and long-horizon drift in fine-tuned video world-model rollouts"
              width={1655}
              height={630}
              sizes="(max-width: 1152px) calc(100vw - 64px), 1060px"
            />
          </figure>
          <aside className="research-question">
            <span>Core question</span>
            <p>Can <strong>action-vision faithfulness</strong> be explicitly evaluated to quantify causal errors and identify reliable world-model rollouts, enabling video world models to serve as dependable simulators for <strong>multi-step closed-loop policy optimization</strong>?</p>
          </aside>
        </SectionCard>

        <SectionCard id="method" title="Method">
          <figure className="concept-figure">
            <Image
              src={sitePath('/roxdrive-method.png')}
              alt="RoXDrive model pre-training and action-faithful reinforcement learning post-training pipeline"
              width={2072}
              height={1169}
              sizes="(max-width: 1152px) calc(100vw - 64px), 1060px"
            />
          </figure>
          <p className="section-lead">
            <strong>Illustration of RoXDrive.</strong>{' '}
            <strong>1) Model pre-training (top):</strong> Beyond policy pre-training, we train the action-vision faithfulness evaluator (AVFE) with our geometry-aware auxiliary trajectory supervision.{' '}
            <strong>2) Action-faithful RL post-training (bottom):</strong> Given the initial scene, agents iteratively interact with a frozen world model to form long-horizon scene rollouts, retaining only action-faithful ones via AVFE for dense safety-aware scoring and scene-level closed-loop RL post-training.
          </p>
        </SectionCard>

        <SectionCard id="results" title="Quantitative Results">
          <QuantitativeResults />
        </SectionCard>

        <SectionCard id="citation" title="Citation">
          <div className="citation-block"><pre><code>{bibtex}</code></pre></div>
        </SectionCard>
      </div>

      <footer><div className="page-shell">
        <p className="footer-note">
          Inspired by <a href="https://zju3dv.github.io/InfiniDepth/" target="_blank" rel="noreferrer">InfiniDepth <ExternalLink size={15} /></a>
          <span aria-hidden="true">·</span>
          <strong>Research-only project</strong>
        </p>
        <p className="footer-disclaimer">
          The materials made available on this page are provided solely for academic, research, and other non-commercial purposes. They are not intended for commercial exploitation or use. The page design draws inspiration from InfiniDepth. If you believe that any content on this page infringes your intellectual property rights, including but not limited to copyright, please submit a takedown request to <span className="footer-contact">hongbinlin (at) link.cuhk.edu.cn</span>.
        </p>
      </div></footer>
    </main>
  );
}

function SectionCard({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section className="section-card" id={id}><h2>{title}</h2>{children}</section>;
}

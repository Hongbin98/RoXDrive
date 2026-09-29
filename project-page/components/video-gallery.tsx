'use client';

import { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sitePath } from '@/lib/site-path';

type VideoItem = {
  id: string;
  index?: string;
  tab: string;
  title: string;
  detail: string;
  src: string;
  comparisonSrc?: string;
  aspectRatio?: string;
  compositeSplit?: boolean;
  stackedSource?: boolean;
  originalStopAt?: number;
};

const nuscenesVideos: VideoItem[] = [
  {
    id: 'nuscenes-4661',
    index: '01',
    tab: 'Keep in Drivable Area',
    title: 'Avoid Collision',
    detail: 'Original official weights vs RoXDrive · 4 s',
    src: '/videos/nuscenes/nuscenes_4661.mp4',
    stackedSource: true,
  },
  {
    id: 'nuscenes-3076',
    index: '02',
    tab: 'Avoid Collision',
    title: 'Avoid Collision',
    detail: 'Original official weights vs RoXDrive · 4 s',
    src: '/videos/nuscenes/nuscenes_3076.mp4',
    stackedSource: true,
  },
  {
    id: 'nuscenes-3564',
    index: '03',
    tab: 'Avoid Side Collision',
    title: 'Keep in Drivable Area',
    detail: 'Original official weights vs RoXDrive · 4 s',
    src: '/videos/nuscenes/nuscenes_3564.mp4',
    stackedSource: true,
  },
  {
    id: 'nuscenes-920',
    index: '04',
    tab: 'Navigate Crowded Area',
    title: 'Keep in Drivable Area',
    detail: 'Original official weights vs RoXDrive · 4 s',
    src: '/videos/nuscenes/nuscenes_920.mp4',
    stackedSource: true,
  },
];

const collisionAvoidanceVideos: VideoItem[] = [
  {
    id: 'qwen3-collision-1985780',
    tab: 'Avoid Collision',
    title: 'Avoid Collision',
    detail: 'Original policy vs RL post-training · 6 synchronized views',
    src: '/videos/inhouse/collision-01-supp.mp4',
    stackedSource: true,
  },
  {
    id: 'qwen3-collision-263367',
    tab: 'Avoid Collision',
    title: 'Avoid Collision',
    detail: 'Original policy vs RL post-training · 6 synchronized views',
    src: '/videos/inhouse/collision-02-supp.mp4',
    stackedSource: true,
  },
];

const drivableAreaVideos: VideoItem[] = [
  {
    id: 'qwen3-lane-1944593',
    tab: 'Keep in Drivable Area',
    title: 'Keep in Drivable Area',
    detail: 'Original policy vs RL post-training · 6 synchronized views',
    src: '/videos/inhouse/drivable-01-supp.mp4',
    stackedSource: true,
  },
  {
    id: 'qwen3-lane-4072490',
    tab: 'Keep in Drivable Area',
    title: 'Keep in Drivable Area',
    detail: 'Original policy vs RL post-training · 6 synchronized views',
    src: '/videos/inhouse/drivable-02-supp.mp4',
    stackedSource: true,
  },
];

function DatasetGallery({
  kicker,
  title,
  description,
  compactDescription = false,
  videos,
}: {
  kicker: string;
  title: string;
  description: string;
  compactDescription?: boolean;
  videos: VideoItem[];
}) {
  const [activeVideo, setActiveVideo] = useState(videos[0].id);
  const tabTriggers = videos.map((video) => (
    <TabsTrigger key={video.id} value={video.id}>
      <span>{video.index}</span>
      {video.tab}
    </TabsTrigger>
  ));

  return (
    <section className="dataset-group">
      <header className="dataset-header">
        <div className="dataset-title-wrap">
          <span className="dataset-kicker">{kicker}</span>
          <h3>{title}</h3>
        </div>
        <p className={compactDescription ? 'dataset-description-nowrap' : undefined}>{description}</p>
      </header>

      <Tabs className="video-gallery" value={activeVideo} onValueChange={setActiveVideo}>
        <TabsList className={`video-tabs${videos.length === 7 ? ' video-tabs-two-rows' : ''}`} aria-label={`Choose a ${title} qualitative result`}>
          {videos.length === 7 ? (
            <>
              <span className="video-tab-row" role="presentation">{tabTriggers.slice(0, 4)}</span>
              <span className="video-tab-row" role="presentation">{tabTriggers.slice(4)}</span>
            </>
          ) : tabTriggers}
        </TabsList>

        {videos.map((video) => (
          <TabsContent key={video.id} value={video.id} className="video-panel">
            <div className="featured-video-frame">
              {video.stackedSource ? (
                <video controls autoPlay muted playsInline loop preload="metadata" aria-label={`${video.title}: Original above and RoXDrive below`}>
                  <source src={sitePath(video.src)} type="video/mp4" />
                </video>
              ) : (
                <StackedComparisonVideo video={video} active={activeVideo === video.id} />
              )}
            </div>
            <div className="video-caption">
              <span>{video.index}</span>
              <div>
                <h3>{video.title}</h3>
                <p>{video.detail}</p>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

function waitForPlayable(video: HTMLVideoElement) {
  if (video.readyState >= 3) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
    const handleCanPlay = () => {
      cleanup();
      resolve();
    };
    const handleError = () => {
      cleanup();
      reject(new Error('Comparison video could not be loaded.'));
    };

    video.addEventListener('canplay', handleCanPlay, { once: true });
    video.addEventListener('error', handleError, { once: true });
  });
}

function StackedComparisonVideo({ video, active }: { video: VideoItem; active: boolean }) {
  const [paused, setPaused] = useState(false);
  const originalRef = useRef<HTMLVideoElement>(null);
  const roxDriveRef = useRef<HTMLVideoElement>(null);
  const restartingRef = useRef(false);
  const originalFrozenRef = useRef(false);
  const syncFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const original = originalRef.current;
    const roxDrive = roxDriveRef.current;
    if (!original || !roxDrive) return;
    let cancelled = false;

    if (!active) {
      original.pause();
      roxDrive.pause();
      return;
    }

    const keepInSync = () => {
      const stopAt = video.originalStopAt;

      if (stopAt !== undefined && !originalFrozenRef.current && original.currentTime >= stopAt) {
        original.currentTime = stopAt;
        original.pause();
        originalFrozenRef.current = true;
      } else if (
        !originalFrozenRef.current &&
        !roxDrive.paused &&
        Math.abs(original.currentTime - roxDrive.currentTime) > 0.08
      ) {
        original.currentTime = Math.min(roxDrive.currentTime, stopAt ?? roxDrive.currentTime);
      }

      syncFrameRef.current = window.requestAnimationFrame(keepInSync);
    };

    const startTogether = async () => {
      original.pause();
      roxDrive.pause();
      await Promise.all([waitForPlayable(original), waitForPlayable(roxDrive)]);
      if (cancelled) return;

      original.currentTime = 0;
      roxDrive.currentTime = 0;
      originalFrozenRef.current = false;
      await Promise.all([original.play(), roxDrive.play()]);
      if (!cancelled) setPaused(false);
    };

    syncFrameRef.current = window.requestAnimationFrame(keepInSync);
    void startTogether().catch(() => {
      if (!cancelled) setPaused(true);
    });

    return () => {
      cancelled = true;
      if (syncFrameRef.current !== null) window.cancelAnimationFrame(syncFrameRef.current);
      original.pause();
      roxDrive.pause();
    };
  }, [active, video.id, video.originalStopAt]);

  const restartPair = () => {
    const original = originalRef.current;
    const roxDrive = roxDriveRef.current;
    if (!active || !original || !roxDrive || restartingRef.current) return;

    restartingRef.current = true;
    original.pause();
    roxDrive.pause();
    original.currentTime = 0;
    roxDrive.currentTime = 0;
    originalFrozenRef.current = false;
    void Promise.all([original.play(), roxDrive.play()])
      .then(() => setPaused(false))
      .catch(() => setPaused(true))
      .finally(() => {
        restartingRef.current = false;
      });
  };

  const togglePlayback = () => {
    const original = originalRef.current;
    const roxDrive = roxDriveRef.current;
    if (!original || !roxDrive) return;

    if (roxDrive.paused) {
      if (roxDrive.ended) {
        restartPair();
        return;
      }

      const stopAt = video.originalStopAt;
      if (stopAt !== undefined && roxDrive.currentTime >= stopAt) {
        original.currentTime = stopAt;
        original.pause();
        originalFrozenRef.current = true;
        void roxDrive.play()
          .then(() => setPaused(false))
          .catch(() => setPaused(true));
      } else {
        original.currentTime = roxDrive.currentTime;
        originalFrozenRef.current = false;
        void Promise.all([waitForPlayable(original), waitForPlayable(roxDrive)])
          .then(() => Promise.all([original.play(), roxDrive.play()]))
          .then(() => setPaused(false))
          .catch(() => setPaused(true));
      }
    } else {
      original.pause();
      roxDrive.pause();
      setPaused(true);
    }
  };

  const videoProps = {
    muted: true,
    playsInline: true,
    preload: 'auto' as const,
    'aria-hidden': true,
  };

  return (
    <div
      className="stacked-comparison"
      role="group"
      aria-label={`${video.title}: Original above and RoXDrive below`}
    >
      <div
        className={`stacked-video-row${video.compositeSplit ? ' composite-source' : ''}`}
        style={{ aspectRatio: video.aspectRatio ?? '16 / 5' }}
      >
        <video
          ref={originalRef}
          className={video.compositeSplit ? 'composite-video composite-video-original' : undefined}
          {...videoProps}
        >
          <source src={sitePath(video.src)} type="video/mp4" />
        </video>
        <span className="comparison-label">Original</span>
      </div>
      <div
        className={`stacked-video-row${video.compositeSplit ? ' composite-source' : ''}`}
        style={{ aspectRatio: video.aspectRatio ?? '16 / 5' }}
      >
        <video
          ref={roxDriveRef}
          className={video.compositeSplit ? 'composite-video composite-video-roxdrive' : undefined}
          {...videoProps}
          onEnded={restartPair}
        >
          <source src={sitePath(video.comparisonSrc ?? video.src)} type="video/mp4" />
        </video>
        <span className="comparison-label">RoXDrive</span>
      </div>

      <button
        type="button"
        className="comparison-playback"
        onClick={togglePlayback}
        aria-label={paused ? 'Play comparison' : 'Pause comparison'}
      >
        {paused ? 'Play' : 'Pause'}
      </button>
    </div>
  );
}

function InHouseCategory({
  title,
  description,
  videos,
}: {
  title: string;
  description: string;
  videos: VideoItem[];
}) {
  const [activeVideo, setActiveVideo] = useState(videos[0].id);

  return (
    <section className="inhouse-category">
      <header className="inhouse-category-header">
        <div>
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
      </header>

      <Tabs className="video-gallery" value={activeVideo} onValueChange={setActiveVideo}>
        <TabsList className="video-tabs inhouse-video-tabs" aria-label={`Choose a ${title} result`}>
          {videos.map((video) => (
            <TabsTrigger key={video.id} value={video.id}>
              {video.index && <span>{video.index}</span>}
              {video.tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {videos.map((video) => (
          <TabsContent key={video.id} value={video.id} className="video-panel">
            <div className="featured-video-frame">
              {video.stackedSource ? (
                <video controls autoPlay muted playsInline loop preload="metadata" aria-label={`${video.title}: Original above and RoXDrive below`}>
                  <source src={sitePath(video.src)} type="video/mp4" />
                </video>
              ) : (
                <StackedComparisonVideo video={video} active={activeVideo === video.id} />
              )}
            </div>
            <div className="video-caption">
              {video.index && <span>{video.index}</span>}
              <div>
                <h3>{video.title}</h3>
                <p>{video.detail}</p>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

export function VideoGallery() {
  return (
    <div className="qualitative-groups">
      <DatasetGallery
        kicker="Public Benchmark"
        title="nuScenes"
        description="Public nuScenes · Original vs RoXDrive."
        compactDescription
        videos={nuscenesVideos}
      />
      <section className="dataset-group inhouse-dataset">
        <header className="dataset-header">
          <div className="dataset-title-wrap">
            <span className="dataset-kicker">Scaling Study</span>
            <h3>In-House Driving Data</h3>
          </div>
          <p>Closed-loop comparisons across challenging in-house driving scenes.</p>
        </header>
        <div className="inhouse-categories">
          <InHouseCategory
            title="Collision Avoidance"
            description="Safe responses to dynamic obstacles and collision risks."
            videos={collisionAvoidanceVideos}
          />
          <InHouseCategory
            title="Keep in Drivable Area"
            description="Lane-boundary awareness and recovery within the drivable region."
            videos={drivableAreaVideos}
          />
        </div>
      </section>
    </div>
  );
}

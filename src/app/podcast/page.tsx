import type { Metadata } from "next";
import { podcasts } from "@/data/config";
import type { PodcastEntry } from "@/data/config";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Podcast 投資摘要 — 股癌 / 財報狗 / 飯桶 / 定錨",
  description:
    "台股熱門投資 Podcast 最新摘要：股癌、財報狗、股海飯桶、定錨產業筆記。快速掌握投資觀點。",
};

export default function PodcastPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Disclaimer />
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Podcast 投資摘要</h1>
        <p className="mt-2 text-sm text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">
          熱門台股投資 Podcast 最新一集重點整理
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {podcasts.map((pod: PodcastEntry) => (
          <article
            key={pod.id}
            className="rounded-xl border border-tw-dark-border dark:border-tw-dark-border border-tw-light-border p-5 transition-colors hover:border-tw-accent/30"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{pod.icon}</span>
                <div>
                  <h2 className="text-lg font-bold">{pod.name}</h2>
                  <p className="text-xs text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">
                    {pod.latestEpisode} / {pod.date}
                  </p>
                </div>
              </div>
              <a
                href={pod.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-full bg-[#1DB954]/20 px-3 py-1 text-xs font-medium text-[#1DB954] transition-colors hover:bg-[#1DB954]/30"
              >
                Spotify
              </a>
            </div>

            <div className="text-sm leading-relaxed text-tw-dark-muted dark:text-tw-dark-text text-tw-light-text">
              {pod.summary.split(/[。！]/).filter(Boolean).map((sentence, i) => (
                <p key={i} className="mb-1.5">
                  {sentence.trim()}{i < pod.summary.split(/[。！]/).filter(Boolean).length - 1 ? "。" : ""}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

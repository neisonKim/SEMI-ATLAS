'use client';

import { useEffect, useMemo, useState } from 'react';

const slides = [
  { id: 'wafer', image: '/assets/hero-process-01-wafer.webp', kicker: '01 / WAFER', title: '웨이퍼 제조', description: '반도체 회로가 시작되는 실리콘 기판' },
  { id: 'oxidation', image: '/assets/hero-process-02-oxidation.webp', kicker: '02 / OXIDATION', title: '산화 공정', description: '웨이퍼 표면에 절연막을 형성하는 단계' },
  { id: 'lithography', image: '/assets/hero-process-03-lithography.webp', kicker: '03 / PHOTOLITHOGRAPHY', title: '포토 공정', description: '빛으로 미세한 회로 패턴을 옮기는 단계' },
  { id: 'etching', image: '/assets/hero-process-04-etching.webp', kicker: '04 / ETCHING', title: '식각 공정', description: '필요한 부분만 남기고 정밀하게 깎는 단계' },
  { id: 'deposition', image: '/assets/hero-process-05-deposition.webp', kicker: '05 / DEPOSITION', title: '증착·이온주입', description: '얇은 막과 전기적 특성을 형성하는 단계' },
  { id: 'metallization', image: '/assets/hero-process-06-metallization.webp', kicker: '06 / METALLIZATION', title: '금속 배선', description: '트랜지스터를 연결해 실제 회로를 만드는 단계' },
  { id: 'eds', image: '/assets/hero-process-07-eds.webp', kicker: '07 / EDS', title: '전기적 검사', description: '웨이퍼 상태에서 칩의 동작을 검증하는 단계' },
  { id: 'packaging', image: '/assets/hero-process-08-packaging.webp', kicker: '08 / PACKAGING', title: '패키징', description: '칩을 보호하고 외부와 연결하는 마지막 단계' },
];

const AUTOPLAY_MS = 5600;

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const current = slides[active];

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return undefined;
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);

  const controls = useMemo(() => slides.map((slide, index) => ({
    id: slide.id,
    label: `${index + 1}. ${slide.title}`,
    index,
  })), []);

  const go = (index) => setActive((index + slides.length) % slides.length);

  return (
    <div
      className="hero-slider"
      aria-label="반도체 8대공정 Hero 슬라이드"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="hero-slider-media" aria-hidden="true">
        {slides.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.image}
            alt=""
            width="2545"
            height="570"
            className={`hero-slide${index === active ? ' is-active' : ''}`}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : undefined}
            decoding="async"
          />
        ))}
      </div>

      <div className="hero-caption" aria-live="polite">
        <span>{current.kicker}</span>
        <b>{current.title}</b>
        <small>{current.description}</small>
      </div>

      <div className="hero-slider-controls" aria-label="Hero 슬라이드 제어">
        <button type="button" className="hero-slider-arrow" onClick={() => go(active - 1)} aria-label="이전 슬라이드">‹</button>
        <div className="hero-slider-dots" role="group" aria-label="공정 슬라이드 선택">
          {controls.map((control) => (
            <button
              type="button"
              key={control.id}
              className={control.index === active ? 'is-active' : ''}
              onClick={() => go(control.index)}
              aria-label={control.label}
              aria-pressed={control.index === active}
            />
          ))}
        </div>
        <span className="hero-slider-count" aria-hidden="true">{String(active + 1).padStart(2, '0')} / 08</span>
        <button type="button" className="hero-slider-arrow" onClick={() => go(active + 1)} aria-label="다음 슬라이드">›</button>
      </div>
    </div>
  );
}

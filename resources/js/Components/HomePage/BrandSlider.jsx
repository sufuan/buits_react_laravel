/* eslint-disable */
import React, { useEffect, useMemo, useRef } fr    mql.add('(    mql.add('(min-width: 1024px)', () => {
      const getTotalX = () => track.scrollWidth - view.offsetWidth;

      const horiz = gsap.to(track, {
        x: () => `-${getTotalX()}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getTotalX()}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });)', () => {
      const getTotalX = () => track.scrollWidth - view.offsetWidth;

      const horiz = gsap.to(track, {
        x: () => `-${getTotalX()}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getTotalX()}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      }); gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function BrandSlider() {
  const sectionRef = useRef(null)
  const viewRef = useRef(null)
  const trackRef = useRef(null)
  const mm = useRef(null)

  const brands = useMemo(() => (
    [
      { src: '/img/brands/gp.png', label: 'Grameenphone' },
      { src: '/img/brands/undp.jpg', label: 'UNDP' },
      { src: '/img/brands/ucb.png', label: 'UCB' },
      { src: '/img/brands/ultragear.png', label: 'LG UltraGear' },
    ]
  ), [])

  useEffect(() => {
    if (!sectionRef.current || !viewRef.current || !trackRef.current) return

    const section = sectionRef.current
    const view = viewRef.current
    const track = trackRef.current

    const onPointer = (e) => {
      const rect = view.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      view.style.setProperty('--x', `${x}px`)
      view.style.setProperty('--y', `${y}px`)
    }
    view.addEventListener('pointermove', onPointer)

    const cards = Array.from(track.querySelectorAll('.brand-card'))

    gsap.utils.toArray(cards).forEach((card, i) => {
      gsap.to(card, {
        y: i % 2 === 0 ? 6 : -6,
        duration: 2 + (i % 3),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    })

    mm.current = gsap.matchMedia()
    const mql = mm.current

    const applySkewOnScroll = (target) => {
      let proxy = { skew: 0 }
      const clamp = gsap.utils.clamp(-8, 8)
      ScrollTrigger.create({
        onUpdate: (self) => {
          const v = clamp(self.getVelocity() / -200)
          if (Math.abs(v) > Math.abs(proxy.skew)) {
            proxy.skew = v
            gsap.to(target, { skewX: proxy.skew, duration: 0.4, ease: 'power3', transformOrigin: 'center center' })
            gsap.to(target, { skewX: 0, duration: 0.8, ease: 'power3', delay: 0.1 })
          }
        }
      })
    }

    /* eslint-disable */
import React, { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function BrandSlider() {
  const sectionRef = useRef(null)
  const viewRef = useRef(null)
  const trackRef = useRef(null)
  const mm = useRef(null)

  const brands = useMemo(() => (
    [
      { src: '/img/brands/gp.png', label: 'Grameenphone' },
      { src: '/img/brands/undp.jpg', label: 'UNDP' },
      { src: '/img/brands/ucb.png', label: 'UCB' },
      { src: '/img/brands/ultragear.png', label: 'LG UltraGear' },
    ]
  ), [])

  useEffect(() => {
    if (!sectionRef.current || !viewRef.current || !trackRef.current) return

    const section = sectionRef.current
    const view = viewRef.current
    const track = trackRef.current

    const onPointer = (e) => {
      const rect = view.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      view.style.setProperty('--x', `${x}px`)
      view.style.setProperty('--y', `${y}px`)
    }
    view.addEventListener('pointermove', onPointer)

    const cards = Array.from(track.querySelectorAll('.brand-card'))

    gsap.utils.toArray(cards).forEach((card, i) => {
      gsap.to(card, {
        y: i % 2 === 0 ? 6 : -6,
        duration: 2 + (i % 3),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    })

    mm.current = gsap.matchMedia()
    const mql = mm.current

    const applySkewOnScroll = (target) => {
      let proxy = { skew: 0 }
      const clamp = gsap.utils.clamp(-8, 8)
      ScrollTrigger.create({
        onUpdate: (self) => {
          const v = clamp(self.getVelocity() / -200)
          if (Math.abs(v) > Math.abs(proxy.skew)) {
            proxy.skew = v
            gsap.to(target, { skewX: proxy.skew, duration: 0.4, ease: 'power3', transformOrigin: 'center center' })
            gsap.to(target, { skewX: 0, duration: 0.8, ease: 'power3', delay: 0.1 })
          }
        }
      })
    }

    mql.add('(min-width: 1024px)', () => {
      const getTotalX = () => track.scrollWidth - view.offsetWidth;

      const horiz = gsap.to(track, {
        x: () => `-${getTotalX()}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getTotalX()}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          containerAnimation: horiz,
          start: 'left center',
          end: 'right center',
          onEnter: () => gsap.to(card, { scale: 1.06, filter: 'brightness(1.15) saturate(1.2)', duration: 0.4 }),
          onEnterBack: () => gsap.to(card, { scale: 1.06, filter: 'brightness(1.15) saturate(1.2)', duration: 0.4 }),
          onLeave: () => gsap.to(card, { scale: 1, filter: 'none', duration: 0.5 }),
          onLeaveBack: () => gsap.to(card, { scale: 1, filter: 'none', duration: 0.5 })
        })
      })

      applySkewOnScroll(track)

      return () => {
        if (horiz.scrollTrigger) horiz.scrollTrigger.kill()
        horiz.kill()
        ScrollTrigger.getAll().forEach(st => {
            if (st.vars.containerAnimation === horiz) {
                st.kill();
            }
        });
      }
    })

    mql.add('(max-width: 1023px)', () => {
      const itemWidth = 260
      const children = Array.from(track.children)
      children.forEach((node) => track.appendChild(node.cloneNode(true)))

      const marquee = gsap.to(track, {
        x: -children.length * itemWidth,
        duration: 20,
        ease: 'none',
        repeat: -1,
      })

      applySkewOnScroll(track)

      return () => marquee.kill()
    })

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      view.removeEventListener('pointermove', onPointer)
      if (mm.current) mm.current.revert()
      ScrollTrigger.getAll().forEach((st) => st.kill())
      gsap.killTweensOf('*')
    }
  }, [brands])

  return (
    <section
      ref={sectionRef}
      id="we-work-with"
      className="relative w-full overflow-hidden bg-[#05060a] py-24 lg:py-36"
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-10 flex items-end justify-between lg:mb-14">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.4em] text-slate-400">We work with</p>
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
              Trusted by leading organizations
            </h2>
          </div>
          <div className="hidden text-right md:block">
            <p className="text-slate-400">Scroll to explore</p>
          </div>
        </div>

        <div
          ref={viewRef}
          className="group relative isolate w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8"
          style={{
            '--x': '50%',
            '--y': '50%',
            backgroundImage: `radial-gradient(600px circle at var(--x) var(--y), rgba(120,160,255,0.08), transparent 40%)`,
            backgroundBlendMode: 'screen',
          }}
        >
          <div ref={trackRef} className="relative flex min-h-[220px] items-center gap-8 will-change-transform md:gap-12 lg:gap-16">
            {brands.map((b, idx) => (
              <div
                key={`${b.src}-${idx}`}
                className="brand-card group relative z-0 grid h-[180px] w-[260px] place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg"
              >
                <img
                  src={b.src}
                  alt={b.label}
                  className="relative z-10 max-h-[120px] max-w-[200px] object-contain drop-shadow-[0_8px_20px_rgba(120,160,255,0.25)]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          containerAnimation: horiz,
          start: 'left center',
          end: 'right center',
          onEnter: () => gsap.to(card, { scale: 1.06, filter: 'brightness(1.15) saturate(1.2)', duration: 0.4 }),
          onEnterBack: () => gsap.to(card, { scale: 1.06, filter: 'brightness(1.15) saturate(1.2)', duration: 0.4 }),
          onLeave: () => gsap.to(card, { scale: 1, filter: 'none', duration: 0.5 }),
          onLeaveBack: () => gsap.to(card, { scale: 1, filter: 'none', duration: 0.5 })
        })
      })

      applySkewOnScroll(track)

      return () => {
        if (horiz.scrollTrigger) horiz.scrollTrigger.kill()
        horiz.kill()
        // Also kill the containerAnimation triggers
        ScrollTrigger.getAll().forEach(st => {
            if (st.vars.containerAnimation === horiz) {
                st.kill();
            }
        });
      }
    })

    mql.add('(max-width: 1023px)', () => {
      const itemWidth = 260
      const children = Array.from(track.children)
      children.forEach((node) => track.appendChild(node.cloneNode(true)))

      const marquee = gsap.to(track, {
        x: -children.length * itemWidth,
        duration: 20,
        ease: 'none',
        repeat: -1,
      })

      applySkewOnScroll(track)

      return () => marquee.kill()
    })

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      view.removeEventListener('pointermove', onPointer)
      if (mm.current) mm.current.revert()
      ScrollTrigger.getAll().forEach((st) => st.kill())
      gsap.killTweensOf('*')
    }
  }, [brands])

  return (
    <section
      ref={sectionRef}
      id="we-work-with"
      className="relative w-full overflow-hidden bg-[#05060a] py-24 lg:py-36"
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-10 flex items-end justify-between lg:mb-14">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.4em] text-slate-400">We work with</p>
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
              Trusted by leading organizations
            </h2>
          </div>
          <div className="hidden text-right md:block">
            <p className="text-slate-400">Scroll to explore</p>
          </div>
        </div>

        <div
          ref={viewRef}
          className="group relative isolate w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-8"
          style={{
            '--x': '50%',
            '--y': '50%',
            backgroundImage: `radial-gradient(600px circle at var(--x) var(--y), rgba(120,160,255,0.08), transparent 40%)`,
            backgroundBlendMode: 'screen',
          }}
        >
          <div ref={trackRef} className="relative flex min-h-[220px] items-center gap-8 will-change-transform md:gap-12 lg:gap-16">
            {brands.map((b, idx) => (
              <div
                key={`${b.src}-${idx}`}
                className="brand-card group relative z-0 grid h-[180px] w-[260px] place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg"
              >
                <img
                  src={b.src}
                  alt={b.label}
                  className="relative z-10 max-h-[120px] max-w-[200px] object-contain drop-shadow-[0_8px_20px_rgba(120,160,255,0.25)]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
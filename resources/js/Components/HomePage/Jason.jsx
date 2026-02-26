import gsap from "gsap"
import { useGSAP } from "@gsap/react"

const Jason = () => {
  useGSAP(() => {
    gsap.set('.jason', { marginTop: '-80vh' });

    gsap.timeline({
      scrollTrigger: {
        trigger: '.jason',
        start: 'top 90%',
        end: '10% center',
        scrub: 2,
      }
    }).to('.first-vd', { opacity: 0, duration: 1, ease: 'power1.inOut' });

    gsap.to('.jason .img-box', {
      scrollTrigger: {
        trigger: '.jason',
        start: 'top center',
        end: '80% center',
        scrub: 2
      }, y: -300, duration: 1, ease: 'power1.inOut'
    }, '<')
  }) 

  return (
    <section className="jason">
      <div className="max-w-lg jason-content">
        <h1>BUITS IT Fest 1.0</h1>
        <h2>Where Innovation Meets Celebration</h2>
        <p>BUITS IT Fest 1.0 was the first-ever tech festival organized by Barishal University IT Society. Featuring hackathons, coding competitions, workshops, and tech talks, it brought together students, developers, and tech enthusiasts to celebrate innovation and creativity.</p>

        <div className="jason-2">
          <img src="/img/fest_new_2.jpg" alt="Jason 2" />
        </div>
      </div>

      <div className="space-y-5 mt-96 img-box">
        <div className="jason-1">
          <img src="/img/fest_new_3.jpg" alt="Jason 1" />
        </div>
        <div className="jason-3">
          <img src="/img/fest_new_4.jpg" alt="Jason 3" />
        </div>
      </div>
    </section>
  )
}

export default Jason

import { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Lottie from "lottie-react";

import communityAnimation from "../../../../public/lottie/community.json";
import skillsAnimation from "../../../../public/lottie/skills.json";
import techAnimation from "../../../../public/lottie/technology.json";
import unlockAnimation from "../../../../public/lottie/unlock.json";
import creativeAnimation from "../../../../public/lottie/creative.json";
/*eslint-disable */
export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({ src, title, description, isComingSoon, isLottie }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();

    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setHoverOpacity(1);
  const handleMouseLeave = () => setHoverOpacity(0);

  return (
    <div className="relative size-full">
      {isLottie ? (
        <Lottie
          animationData={src}
          loop={true}
          className="absolute left-0 top-0 size-full object-cover object-center opacity-80"
        />
      ) : (
        <video
          src={src}
          loop
          muted
          autoPlay
          className="absolute left-0 top-0 size-full object-cover object-center opacity-50 transition-opacity duration-300 group-hover:opacity-80"
        />
      )}
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>

        {isComingSoon && (
          <div
            ref={hoverButtonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20"
          >
            {/* Radial gradient hover effect */}
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: hoverOpacity,
                background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
              }}
            />
            <TiLocationArrow className="relative z-20" />
            <p className="relative z-20">coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Features = () => (
  <section className="bg-black pb-52">
    <div className="container mx-auto px-3 md:px-10">
      <div className="pt-10 pb-32 px-5 text-center md:text-left">
        <p className="font-circular-web text-lg text-blue-50">
          Beyond the Silicon Layer
        </p>
        <p className="max-max-w-lg font-circular-web text-lg text-blue-50 opacity-50">
          Empowering every student at Barishal University through technology,
          creativity, and shared knowledge. Our society is built for everyone,
          regardless of department.
        </p>
      </div>

      <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
        <BentoCard
          src={communityAnimation}
          title={
            <>
              uni<b>t</b>y
            </>
          }
          description="Tech belongs to everyone. BUITS is where different minds meet to collaborate, create, and build friendships through digital innovation."
          isLottie={true}
        />
      </BentoTilt>

      <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
        <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
          <BentoCard
            src={skillsAnimation}
            title={
              <>
                le<b>a</b>rn
              </>
            }
            description="Master the essentials of modern technology through our student-led workshops, coding bootcamps, and comprehensive skill-building programs."
            isLottie={true}
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0">
          <BentoCard
            src={creativeAnimation}
            title={
              <>
                cre<b>a</b>te
              </>
            }
            description="Transform your ideas into reality. From web dev to digital art, we provide the platform for your technical creativity to shine."
            isLottie={true}
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 me-14 md:col-span-1 md:me-0">
          <BentoCard
            src={techAnimation}
            title={
              <>
                gr<b>o</b>w
              </>
            }
            description="Bridge the gap between academia and industry. Connect with mentors, attend seminars, and prepare for a career in the digital era."
            isLottie={true}
          />
        </BentoTilt>

        <BentoTilt className="border-hsla bento-tilt_2">
          <div className="flex size-full flex-col justify-between bg-violet-300 p-5">
            <h1 className="bento-title special-font max-w-64 text-black">
              M<b>o</b>re co<b>m</b>ing s<b>o</b>on.
            </h1>

            <TiLocationArrow className="m-5 scale-[5] self-end" />
          </div>
        </BentoTilt>

        <BentoTilt className="border-hsla bento-tilt_2">
          <BentoCard
            src={unlockAnimation}
            title={
              <>
                unl<b>o</b>ck
              </>
            }
            description="Unlock your hidden potential. Explore new technologies and discover the diverse opportunities within our tech community."
            isLottie={true}
          />
        </BentoTilt>

      </div>
    </div>
  </section>
);

export default Features;
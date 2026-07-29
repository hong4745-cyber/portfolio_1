import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialLinkItem {
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
}

interface MinimalistHeroProps {
  logoText: string;
  navLinks: { label: string; href: string }[];
  navText?: string;
  mainText: string;
  mainTextMobile?: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: {
    part1: string;
    part2: string;
  };
  socialLinks: SocialLinkItem[];
  locationText: string;
  className?: string;
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-sm font-medium tracking-widest text-foreground/60 transition-colors hover:text-foreground"
  >
    {children}
  </a>
);

const SocialIcon = ({ href, onClick, icon: Icon }: SocialLinkItem) => {
  const cls = "text-foreground/60 transition-all duration-200 hover:text-foreground hover:scale-125";
  if (onClick) {
    return (
      <button onClick={onClick} className={cls}>
        <Icon className="h-8 w-8" />
      </button>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      <Icon className="h-8 w-8" />
    </a>
  );
};

const JourneyTitle = ({ part1, part2 }: { part1: string; part2: string }) => {
  const renderLine = (text: string, lineIndex: number) => (
    <span className="block overflow-visible">
      {text.split('').map((letter, index) => (
        <motion.span
          key={`${text}-${letter}-${index}`}
          className="inline-block"
          initial={{ opacity: 0, y: 28, rotateX: -35 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: false, amount: 0.45 }}
          transition={{
            duration: 0.55,
            delay: lineIndex * 0.08 + index * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{
            y: -16,
            rotate: index % 2 === 0 ? -4 : 4,
            color: '#f2c84b',
            transition: { duration: 0.18 },
          }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );

  return (
    <h1 className="text-[101px] font-extrabold leading-none text-foreground md:text-[130px] lg:text-[clamp(72px,9vw,117px)]">
      {renderLine(part1, 0)}
      {renderLine(part2, 1)}
    </h1>
  );
};

export const MinimalistHero = ({
  logoText,
  navLinks,
  navText,
  mainText,
  mainTextMobile,
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks,
  locationText,
  className,
}: MinimalistHeroProps) => {
  return (
    <div
      className={cn(
        'relative flex h-auto w-full flex-col items-center justify-start gap-6 overflow-visible bg-background p-0 pb-10 font-sans lg:h-screen lg:justify-between lg:gap-0 lg:pb-0',
        className
      )}
    >
      <header className="z-30 flex w-full max-w-7xl items-center justify-end">
        {navLinks.length > 0 && (
          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.label} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -72 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.45 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="z-20 order-3 mt-6 flex flex-col text-center lg:order-1 lg:mt-0 lg:text-left lg:pl-16 lg:justify-center lg:h-full"
        >
          <div className="flex flex-col gap-0">
            {navText && (
              <span className="text-xs font-medium tracking-widest text-foreground/50 lg:text-[clamp(0.6rem,0.8vw,0.75rem)]">{navText}</span>
            )}
            <span className="text-3xl font-bold tracking-wider lg:text-[clamp(1.25rem,2.2vw,1.875rem)]">{logoText}</span>
            <span className="text-sm font-medium leading-loose text-foreground/60 lg:text-[clamp(0.7rem,1vw,0.875rem)]">{locationText}</span>
          </div>
          <div className="mt-4 flex items-center space-x-4 justify-center lg:justify-start">
            {socialLinks.map((link, index) => (
              <SocialIcon key={index} href={link.href} onClick={link.onClick} icon={link.icon} />
            ))}
          </div>
          {mainTextMobile ? (
            <>
              <p className="mt-10 text-lg font-light leading-loose tracking-[0.02em] text-foreground/80 md:text-xl lg:text-[clamp(0.9rem,1.3vw,1.25rem)] whitespace-pre-line sm:hidden">
                {mainTextMobile}
              </p>
              <p className="mt-10 text-lg font-light tracking-[0.02em] text-foreground/80 md:text-xl lg:text-[clamp(0.9rem,1.3vw,1.25rem)] whitespace-pre-line hidden sm:block" style={{ lineHeight: '1.7' }}>
                {mainText}
              </p>
            </>
          ) : (
            <p className="mt-10 text-lg font-light leading-loose tracking-[0.02em] text-foreground/80 md:text-xl whitespace-pre-line">
              {mainText}
            </p>
          )}
        </motion.div>

        <div className="relative order-2 flex h-full items-center justify-center lg:order-2 lg:ml-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative z-0 h-[300px] w-[300px] flex-shrink-0 overflow-hidden bg-yellow-400/90 md:h-[400px] md:w-[400px] lg:h-[clamp(320px,32vw,500px)] lg:w-[clamp(320px,32vw,500px)]"
            style={{ borderRadius: '50%' }}
          >
            <div className="absolute left-0 top-1/2 z-10 flex w-full -translate-y-1/2 justify-center">
              <motion.img
                src={imageSrc}
                alt={imageAlt}
                className="h-[104%] w-[70%] object-cover object-top"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'https://placehold.co/400x600/eab308/ffffff?text=Image+Not+Found';
                }}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 84 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.45 }}
          transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="z-20 order-1 flex items-center justify-center text-center lg:order-3 lg:justify-start lg:-ml-4"
        >
          <JourneyTitle part1={overlayText.part1} part2={overlayText.part2} />
        </motion.div>
      </div>

      <footer className="z-30 w-full max-w-7xl" />
    </div>
  );
};

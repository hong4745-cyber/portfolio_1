import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { FaGithub, FaInstagram } from 'react-icons/fa';
import { MinimalistHero } from '@/components/ui/minimalist-hero';
import portrait from '@/assets/images/back_2.png';

const DemoOne = () => {
  const [copied, setCopied] = useState(false);

  const handleEmailCopy = () => {
    const email = 'hong4745@gmail.com';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => fallbackCopy(email));
    } else {
      fallbackCopy(email);
    }
  };

  const fallbackCopy = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.focus();
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <MinimalistHero
        logoText="BAEK JIEUN"
        navLinks={[]}
        navText="DESIGN · UI/UX · FRONTEND"
        mainText={"Visual design에서 출발해 UI/UX와\n프론트엔드로 작업 영역을 넓혀가고 있습니다."}
        mainTextMobile={"Visual design에서 출발해 UI/UX와\n프론트엔드로 작업 영역을\n넓혀가고 있습니다."}
        imageSrc={portrait}
        imageAlt="Baek Jieun portrait"
        overlayText={{
          part1: 'JOUR',
          part2: 'NEY',
        }}
        socialLinks={[
          { icon: Mail, onClick: handleEmailCopy },
          { icon: FaGithub, href: 'https://github.com/hong4745-cyber' },
          { icon: FaInstagram, href: 'https://www.instagram.com/still___digging' },
        ]}
        locationText="Daejeon, Korea"
      />
      {copied && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '0.6rem 1.4rem',
            borderRadius: '999px',
            fontSize: '0.875rem',
            letterSpacing: '0.05em',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          메일이 카피되었습니다.
        </div>
      )}
    </div>
  );
};

export { DemoOne };

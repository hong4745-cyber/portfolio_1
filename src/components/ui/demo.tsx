import React from 'react';
import { Mail } from 'lucide-react';
import { FaGithub, FaInstagram } from 'react-icons/fa';
import { MinimalistHero } from '@/components/ui/minimalist-hero';
import portrait from '@/assets/images/back_2.png';

const DemoOne = () => {
  return (
    <MinimalistHero
      logoText="BAEK JIEUN"
      navLinks={[]}
      navText="DESIGN · UI/UX · FRONTEND"
      mainText="Visual design에서 출발해 UI/UX와 프론트엔드로 작업 영역을 넓혀가고 있습니다."
      imageSrc={portrait}
      imageAlt="Baek Jieun portrait"
      overlayText={{
        part1: 'JOUR',
        part2: 'NEY',
      }}
      socialLinks={[
        { icon: Mail, href: 'mailto:hong4745@gmail.com' },
        { icon: FaGithub, href: 'https://github.com/hong4745-cyber' },
        { icon: FaInstagram, href: 'https://www.instagram.com/still___digging' },
      ]}
      locationText="Daejeon, Korea"
    />
  );
};

export { DemoOne };

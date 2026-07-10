import { Icon } from '@iconify/react'

const NavLink = ({ href, children }) => (
  <a href={href} className="journey0-nav-link">
    {children}
  </a>
)

const SocialIcon = ({ href, icon, label }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="journey0-social-link" aria-label={label}>
    <Icon icon={icon} width={20} height={20} />
  </a>
)

const Journey0 = ({
  logoText,
  navLinks,
  mainText,
  readMoreLink,
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks,
  locationText,
}) => {
  return (
    <section id="journey_0" className="section section--journey-0">
      <header className="journey0-header">
        <div className="journey0-logo">{logoText}</div>
        <nav className="journey0-nav" aria-label="Journey navigation">
          {navLinks.map(link => (
            <NavLink key={link.label} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button className="journey0-menu" type="button" aria-label="Open menu">
          <span />
          <span />
          <span />
        </button>
      </header>

      <div className="journey0-main">
        <div className="journey0-copy">
          <p>{mainText}</p>
          <a href={readMoreLink}>Read More</a>
        </div>

        <div className="journey0-portrait">
          <div className="journey0-circle">
            <img src={imageSrc} alt={imageAlt} />
          </div>
        </div>

        <div className="journey0-title-wrap">
          <h2 className="journey0-title">
            {overlayText.part1}
            <br />
            {overlayText.part2}
          </h2>
        </div>
      </div>

      <footer className="journey0-footer">
        <div className="journey0-socials">
          {socialLinks.map(link => (
            <SocialIcon key={link.label} {...link} />
          ))}
        </div>
        <div className="journey0-location">{locationText}</div>
      </footer>
    </section>
  )
}

export const journey0SocialLinks = [
  { label: 'Email', icon: 'lucide:mail', href: 'mailto:hong4745@gmail.com' },
  { label: 'GitHub', icon: 'simple-icons:github', href: 'https://github.com/hong4745-cyber' },
  { label: 'Instagram', icon: 'simple-icons:instagram', href: 'https://www.instagram.com/still___digging' },
]

export default Journey0

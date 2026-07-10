import { Starfield } from '@/components/ui/starfield'

export const AuroraHero = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#09090b]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(127,41,218,0.22),transparent_34%),radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.05),transparent_14%),linear-gradient(180deg,rgba(9,9,11,0.94)_0%,rgba(9,9,11,0.86)_52%,rgba(9,9,11,1)_100%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 opacity-80">
        <Starfield count={180} sizeScale={1.25} />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.08)_0%,rgba(9,9,11,0.28)_52%,rgba(9,9,11,0.7)_100%)]"
      />
    </div>
  )
}

import HeroCarousel from '../components/home/HeroCarousel'
import { WhatWeDo, ImpactStats, DonateCTA, MembershipPreview } from '../components/home/HomeSections'

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <WhatWeDo />
      <ImpactStats />
      <DonateCTA />
      <MembershipPreview />
    </>
  )
}

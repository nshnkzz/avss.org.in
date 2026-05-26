import HeroCarousel from '../components/home/HeroCarousel'
import { Helmet } from 'react-helmet-async'
import { WhatWeDo, ImpactStats, DonateCTA, MembershipPreview } from '../components/home/HomeSections'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Aadarsh Viklang Sewa Sangh | NGO for PWD in Singrauli MP</title>
        <meta name="description" content="Aadarsh Viklang Sewa Sangh (AVSS) is an NGO in Singrauli, Madhya Pradesh helping Divyangjan access UDID cards, government pensions, wheelchairs and legal aid. Free help in Hindi." />
        <meta name="keywords" content="Aadarsh Viklang Sewa Sangh, AVSS, NGO Singrauli, विकलांग सेवा संघ, PWD NGO Madhya Pradesh, disability NGO MP, UDID card Singrauli" />
        <link rel="canonical" href="https://avss.org.in" />

        {/* Open Graph — for WhatsApp/Facebook link previews */}
        <meta property="og:title" content="Aadarsh Viklang Sewa Sangh | NGO for PWD in Singrauli" />
        <meta property="og:description" content="Helping Divyangjan in Singrauli, MP access government schemes, pensions and assistive devices." />
        <meta property="og:url" content="https://avss.org.in" />
        <meta property="og:type" content="website" />
      </Helmet>
      <HeroCarousel />
      <WhatWeDo />
      <ImpactStats />
      <DonateCTA />
      <MembershipPreview />
    </>
  )
}

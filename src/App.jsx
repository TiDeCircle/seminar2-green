import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Schedule from './components/Schedule.jsx'
import MapSection from './components/MapSection.jsx'
import FloorPlan from './components/FloorPlan.jsx'
import Register from './components/Register.jsx'
import Footer from './components/Footer.jsx'
import DevCredits from './components/DevCredits.jsx'
import ScrollBar from './components/ScrollBar.jsx'
import { useReveal } from './hooks.js'
import { SHOW_FLOORPLAN } from './data.js'

export default function App() {
  useReveal()

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Schedule />
        <MapSection />
        {SHOW_FLOORPLAN && <FloorPlan />}
        <Register />
      </main>
      <Footer />
      <DevCredits />
      <ScrollBar />
    </>
  )
}

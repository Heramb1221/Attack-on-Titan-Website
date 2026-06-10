/* eslint-disable react-refresh/only-export-components */
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CharacterProfiles from './components/CharacterProfiles'
import SurveyCoresOath from './components/SurveyCoresOath'
import TitanSize from './components/Titansize'
import BattleTimeline from './components/BattleTimeline'
import ODMGear from './components/ODMGear'
import SceneGallery from './components/SceneGallery'
import StatsCounter from './components/StatsCounter'
import FinalCTA from './components/FinalCTA'

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <CharacterProfiles />
      <SurveyCoresOath />
      <TitanSize />
      <BattleTimeline />
      <ODMGear />
      <SceneGallery />
      <StatsCounter />
      <FinalCTA />
    </>
  )
}

export default App
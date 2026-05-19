import { useEffect } from 'react'
import { useStore } from './store'
import { ScreenTop } from './screens/ScreenTop'
import { ScreenCuisine } from './screens/ScreenCuisine'
import { ScreenSituation } from './screens/ScreenSituation'
import { ScreenArea } from './screens/ScreenArea'
import { ScreenMealtime } from './screens/ScreenMealtime'
import { ScreenBudget } from './screens/ScreenBudget'
import { ScreenAboutYou } from './screens/ScreenAboutYou'
import { ScreenLoading } from './screens/ScreenLoading'
import { ScreenSwipe } from './screens/ScreenSwipe'
import { ScreenResult } from './screens/ScreenResult'
import { ScreenWaiting } from './screens/ScreenWaiting'
import { ScreenMatchA } from './screens/ScreenMatchA'
import { ScreenMatchB } from './screens/ScreenMatchB'
import { ScreenError } from './screens/ScreenError'
import { ScreenTerms } from './screens/ScreenTerms'
import { ScreenPrivacy } from './screens/ScreenPrivacy'
import { ScreenCredit } from './screens/ScreenCredit'

function CreditFooter() {
  return (
    <div style={{
      background: '#FFF8F0',
      borderTop: '1px solid #EFE7DC',
      padding: '6px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      flexShrink: 0,
      fontSize: 9,
      color: 'var(--brown-mute)',
    }}>
      <span>Powered by</span>
      <a
        href="https://webservice.recruit.co.jp/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'inherit', fontWeight: 700 }}
      >
        ホットペッパーグルメ Webサービス
      </a>
    </div>
  )
}

function MainApp() {
  const { step, initFromUrl } = useStore()

  useEffect(() => {
    initFromUrl()
  }, [])

  const renderScreen = () => {
    switch (step) {
      case 'top':       return <ScreenTop />
      case 'cuisine':   return <ScreenCuisine />
      case 'situation': return <ScreenSituation />
      case 'area':      return <ScreenArea />
      case 'mealtime':  return <ScreenMealtime />
      case 'budget':    return <ScreenBudget />
      case 'aboutyou':  return <ScreenAboutYou />
      case 'loading':   return <ScreenLoading />
      case 'swipe':     return <ScreenSwipe />
      case 'result':    return <ScreenResult />
      case 'waiting':   return <ScreenWaiting />
      case 'matcha':    return <ScreenMatchA />
      case 'matchb':    return <ScreenMatchB />
      case 'error':     return <ScreenError />
      default:          return <ScreenTop />
    }
  }

  const showCredit = ['swipe', 'loading', 'matchc'].includes(step)

  return (
    <div className="app-wrapper">
      {renderScreen()}
      {showCredit && <CreditFooter />}
    </div>
  )
}

export default function App() {
  const path = window.location.pathname
  if (path === '/terms')   return <div className="app-wrapper"><ScreenTerms /></div>
  if (path === '/privacy') return <div className="app-wrapper"><ScreenPrivacy /></div>
  if (path === '/credit')  return <div className="app-wrapper"><ScreenCredit /></div>
  return <MainApp />
}

import { useState, useEffect } from 'react'
import './styles.css'

import blankConfig from './data/blankConfig'
import Clock from './components/Clock'
import News from './components/News'
import Quote from './components/Quote'
import Stocks from './components/Stocks'
import ToDo from './components/ToDo'
import Weather from './components/Weather'
import ConfigMenu from './components/ConfigMenu'

export default function App() {
  const DEFAULT_CONFIG = blankConfig.map((widget) => {
    return { ...widget, positionData: { ...widget.positionData } }
  })

  const [widgetConfig, setWidgetConfig] = useState(() => {
    localStorage.removeItem('widget')
    return DEFAULT_CONFIG
  })
  const [saveRequested, setSaveRequested] = useState(false)

  useEffect(() => {
    if (saveRequested) {
      localStorage.setItem('widget', JSON.stringify(widgetConfig))
    } else {
      setWidgetConfig(JSON.parse(localStorage.getItem('widget')))
    }
  }, [saveRequested])

  function save() {
    setSaveRequested(true) // Aşağıdaki 126. satırda yeşil "Kaydedildi" mesajının oluşturulmasına neden olur. State daha sonra 70. satırdaki setTimeout tarafından tekrar false değerine ayarlanır ve mesaj kaldırılır.
  }

  /****** Kodunuzu yukarıya yazın*******************************************************************  
 
 Challenge'ın çözülmesiyle ilgili tüm kodlar yukarıda yer almaktadır. Bu projede bu kod dışında hiçbir şeyin değiştirilmesine veya incelenmesine gerek yok.
    
 Kendi kodunuzu eklemenin yanı sıra, yukarıda widgetConfig state'inin başlatılma biçiminde yalnızca küçük bir değişiklik yapmanız gerekecektir. Bunun dışında, yukarıdaki kodda da herhangi bir değişiklik yapılmasına gerek yok

***************************************************************************************************/

  const widgetComponents = {
    Clock: <Clock />,
    News: <News />,
    Quote: <Quote />,
    Stocks: <Stocks />,
    ToDo: <ToDo />,
    Weather: <Weather />,
  }

  const savedMessage = (
    <div className="saved-message-container">
      <p className="saved-message">Kaydedildi</p>
    </div>
  )

  useEffect(() => {
    if (saveRequested) {
      setTimeout(() => {
        setSaveRequested(false)
      }, 1000)
    }
  }, [saveRequested])

  function dragHandler(e, data) {
    if (e.target.dataset.type !== 'button') {
      setWidgetConfig((prevConfig) => {
        let allConfigs = [...prevConfig]
        let targetConfig = allConfigs.find(
          (widget) => widget.name === data.node.classList[1]
        )
        targetConfig.positionData = {
          ...targetConfig.positionData,
          customPosition: true,
          x: data.x,
          y: data.y,
        }
        return allConfigs
      })
    }
  }

  function getOffset(name) {
    let targetConfig = widgetConfig.find((widget) => widget.name === name)
    if (!targetConfig.positionData.customPosition) {
      return undefined
    } else {
      return { x: targetConfig.positionData.x, y: targetConfig.positionData.y }
    }
  }

  const widgetsToDisplay = widgetConfig
    .filter((widget) => widget.selected)
    .map((widget) => {
      const component = {
        ...widgetComponents[widget.name],
        key: crypto.randomUUID(),
      }
      component.props = {
        ...component.props,
        name: widget.name,
        gridArea: widget.positionData.gridArea,
        getOffset: getOffset,
        dragHandler: dragHandler,
        changeHandler: changeHandler,
      }
      return component
    })

  function changeHandler(event) {
    setWidgetConfig((prevConfig) => {
      return prevConfig.map((widget) => {
        return widget.name === event.target.name
          ? { ...widget, selected: !widget.selected }
          : { ...widget }
      })
    })
  }

  return (
    <div className="wrapper">
      {saveRequested && savedMessage}
      <div className="widget-container">{widgetsToDisplay}</div>
      <ConfigMenu
        stateProps={{ widgetConfig, setWidgetConfig, DEFAULT_CONFIG }}
        changeHandler={changeHandler}
        save={save}
      />
    </div>
  )
}

import ConfigButton from './ConfigButton'
import useLocalStorage from './useLocalStorage'

export default function ConfigMenu(props) {
  const [local, setLocal] = useLocalStorage('widget', [])
  const { widgetConfig, setWidgetConfig, DEFAULT_CONFIG } = props.stateProps

  function reset() {
    setWidgetConfig(DEFAULT_CONFIG)
    setLocal([])
  }

  const ConfigButtons = widgetConfig.map((widget) => {
    return (
      <ConfigButton
        name={widget.name}
        checked={widget.selected}
        changeHandler={props.changeHandler}
        key={crypto.randomUUID()}
      />
    )
  })

  return (
    <div className="configuration-menu">
      <button className="push-button" onClick={reset}>
        Reset
      </button>
      <button className="push-button" onClick={props.save}>
        Kaydet
      </button>
      {ConfigButtons}
    </div>
  )
}

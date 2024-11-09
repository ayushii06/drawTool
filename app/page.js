import Home from "./components/board/draw"
import Options from "./components/fileMenu/options"
import Menu from "./components/menu/menu"
import Toolbar from "./components/toolbar/toolbar"

export default function Page() {
  return (
    <>
      <Menu />
      <Toolbar />
      <Home /> 
      <Options/>
    </>
  )
}
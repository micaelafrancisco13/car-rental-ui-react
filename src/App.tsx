import "./App.css"
import { RouterProvider } from "react-router-dom"
import routerRBAC from "./rbac/index.tsx"

function App() {
	return (
		<>	
			<RouterProvider router={routerRBAC} />
		</>
	)
}

export default App

import "./reset.css";
import { createContext, useState } from "react";
import TextInput from "./components/qwe";
import Graph3D from "./components/outputArea";
import "./App.css";

export const DataContext = createContext();

function App() {
    const [sharedData, setSharedData] = useState("");

    const updateSharedData = (newData) => {
        setSharedData(newData);
    };

    return (
        <>
            <DataContext.Provider value={{ sharedData, updateSharedData }}>
                <TextInput />
                <Graph3D />
            </DataContext.Provider>
        </>
    );
}

export default App;

import "./reset.css";
import { createContext, useState, useCallback } from "react";
import TextInput from "./components/inputArea";
import Graph3D from "./components/outputArea";
import "./App.css";

export const DataContext = createContext();

function App() {
    const [sharedData, setSharedData] = useState({
        nodes: [],
        links: [],
        direct: "direct",
    });
    const [warn, setWarn] = useState("");
    const updateSharedData = useCallback(
        (newData) => {
            console.log(JSON.stringify(sharedData), JSON.stringify(newData));
            if (JSON.stringify(sharedData) !== JSON.stringify(newData)) {
                console.log("Data updated");
                setSharedData({ ...newData });
                console.log("update thành công", newData);
            }
        },
        [sharedData]
    );

    const updateWarn = useCallback((newWarn) => {
        setWarn(newWarn);
    }, []);

    return (
        <>
            <DataContext.Provider
                value={{ sharedData, updateSharedData, warn, updateWarn }}
            >
                <TextInput />
                <Graph3D />
            </DataContext.Provider>
        </>
    );
}

export default App;

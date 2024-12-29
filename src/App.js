import "./reset.css";
import { createContext, useState, useCallback } from "react";
import TextInput from "./components/inputArea";
// import Graph3D from "./components/outputArea";
import Graph3D from "./components/outputArea/test";
import "./App.css";

export const DataContext = createContext();

function App() {
    const [sharedData, setSharedData] = useState({
        nodes: [],
        links: [],
        direct: "direct",
    });
    const [warn, setWarn] = useState("");
    const [warnAlgo, setWarnAlgo] = useState("");
    const [input, setInput] = useState("");

    const updateSharedData = useCallback((newData) => {
        console.log(JSON.stringify(sharedData), JSON.stringify(newData));
        if (JSON.stringify(sharedData) !== JSON.stringify(newData)) {
            console.log("Data updated");
            setSharedData({ ...newData });
            console.log("update thành công", newData);
        }
    }, []);

    const updateInput = useCallback((data) => {
        setInput(data);
    }, []);

    const updateWarn = useCallback((newWarn) => {
        setWarn(newWarn);
    }, []);

    const updateWarnAlgo = useCallback((newWarn) => {
        setWarnAlgo(newWarn);
    }, []);

    return (
        <>
            <DataContext.Provider
                value={{
                    sharedData,
                    updateSharedData,
                    warn,
                    updateWarn,
                    warnAlgo,
                    updateWarnAlgo,
                    input,
                    updateInput,
                }}
            >
                <TextInput />
                {/* <Graph3D /> */}
                <Graph3D />
            </DataContext.Provider>
        </>
    );
}

export default App;

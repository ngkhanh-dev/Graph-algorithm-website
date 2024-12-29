import "./output.css";
import React, { useEffect, useState, useContext, memo } from "react";

import { DataContext } from "../../App";
import Graph from "react-graph-vis";
import "vis-network/styles/vis-network.css";

const Graph3D = () => {
    //const networkRef = useRef(null);
    const { sharedData, input } = useContext(DataContext);

    const [graph, setGraph] = useState({
        nodes: [
            {
                id: "1",
                label: "1",
            },
            {
                id: "2",
                label: "2",
            },
        ],
        edges: [
            {
                id: "1-2",
                from: "1",
                to: "2",
                label: "1",
            },
        ],
        direct: "none",
    });

    useEffect(() => {
        if (sharedData) {
            console.log(sharedData);
            const inp = input.replace(/\s+/g, " ").trim().split(" ");
            console.log("inpppp", inp);
            const newGraph = {
                nodes:
                    sharedData?.nodes?.map((item) => ({
                        id: `${item.id}`,
                        label: `${item.id}`,
                        color: inp.includes(`${item.id}`)
                            ? { background: "#97C2FC", border: "black" }
                            : { background: "#c49397", border: "#000" },
                    })) || [],
                edges:
                    sharedData?.links?.map((item) => ({
                        id: `${item.source}-${item.target}`,
                        from: `${item.source}`,
                        to: `${item.target}`,
                        label: `${item.weight}`,
                        mark: `${item.mark}` || 0,
                        color: {
                            color: item.mark === "1" ? "#c49397" : "#ccc",
                        },
                        //size: parseFloat(`${item.weight}`),
                    })) || [],
                direct: sharedData?.direct || "none",
            };

            setGraph(newGraph);

            // // Dữ liệu cho node và cạnh
            // const nodes = graph.nodes;

            // const edges = graph.links;

            // // Cấu hình cho mạng
            // const data = {
            //     nodes,
            //     edges,
            // };
        }
    }, [sharedData, input]);

    const options = {
        nodes: {
            shape: "dot",
            size: 20,
        },
        edges: {
            width: 2,
            smooth: { type: "continuous" },
            arrows: {
                to: {
                    enabled: true,
                    scaleFactor: 1, // Tỷ lệ kích thước mũi tên
                },
            },
        },
        physics: {
            enabled: true, // Disable physics để mạng không di chuyển
        },
    };

    return (
        // <div
        //     ref={networkRef}
        //     style={{
        //         width: "600px",
        //         height: "400px",
        //         border: "1px solid lightgray",
        //     }}
        // ></div>

        <div className="show-container">
            <Graph
                key={JSON.stringify(graph)} // Ensures a re-render when graph changes
                graph={graph}
                options={options}
            />
        </div>
    );
};

export default memo(Graph3D);
